'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { projectDB } from '@/lib/supabase/database'
import { User, AuthError } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null; message: string }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; message: string }>
  signOut: () => Promise<{ error: AuthError | null; message: string }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null; message: string }>
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const getErrorMessage = (error: AuthError | null): string => {
    if (!error) return ''

    switch (error.message) {
      case 'Invalid login credentials':
        return '邮箱或密码错误，请重试'
      case 'User already registered':
        return '该邮箱已注册，请直接登录'
      case 'Email not confirmed':
        return '请先验证邮箱后再登录'
      case 'Too many requests':
        return '请求过于频繁，请稍后再试'
      case 'Password should be at least 6 characters':
        return '密码至少需要6个字符'
      case 'Invalid email':
        return '请输入有效的邮箱地址'
      case 'Signup requires a valid password':
        return '请输入密码'
      case 'User not found':
        return '用户不存在，请先注册'
      case 'Invalid token':
        return '认证令牌无效，请重新登录'
      default:
        return error.message || '操作失败，请重试'
    }
  }

  useEffect(() => {
    // Get initial session with retry logic
    const getInitialSession = async (retries = 2) => {
      try {
        const { user, error } = await projectDB.getCurrentUser()
        if (error && retries > 0) {
          // Retry once after a short delay
          setTimeout(() => getInitialSession(retries - 1), 1000)
          return
        }
        setUser(user)
      } catch (error) {
        console.error('Failed to get initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = projectDB.supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)

        switch (event) {
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
            setUser(session?.user ?? null)
            break
          case 'SIGNED_OUT':
            setUser(null)
            break
          case 'USER_UPDATED':
            setUser(session?.user ?? null)
            break
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await projectDB.signUp(email, password)
      const message = error ? getErrorMessage(error) : '注册成功！请查看邮箱验证链接'
      return { error, message }
    } catch (err) {
      const message = '注册过程中出现错误，请重试'
      return { error: err as AuthError, message }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await projectDB.signIn(email, password)
      const message = error ? getErrorMessage(error) : '登录成功！'
      return { error, message }
    } catch (err) {
      const message = '登录过程中出现错误，请重试'
      return { error: err as AuthError, message }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await projectDB.signOut()
      if (!error) {
        setUser(null)
      }
      const message = error ? getErrorMessage(error) : '已成功退出登录'
      return { error, message }
    } catch (err) {
      const message = '退出登录时出现错误'
      return { error: err as AuthError, message }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await projectDB.supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      const message = error ? getErrorMessage(error) : '密码重置链接已发送到您的邮箱'
      return { error, message }
    } catch (err) {
      const message = '发送密码重置链接时出现错误'
      return { error: err as AuthError, message }
    }
  }

  const refreshSession = async () => {
    if (refreshing) return

    setRefreshing(true)
    try {
      const { error } = await projectDB.supabaseClient.auth.refreshSession()
      if (error) {
        console.error('Failed to refresh session:', error)
      }
    } catch (error) {
      console.error('Session refresh error:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const value = {
    user,
    loading: loading || refreshing,
    signUp,
    signIn,
    signOut,
    resetPassword,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}