import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/Auth/AuthProvider'

export const metadata: Metadata = {
  title: 'MDKSYS - 自动化系统设计平台',
  description: '基于Web的自动化系统设计平台，支持项目配置和模拟运行',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
