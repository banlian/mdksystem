'use client'

import { useState, useEffect } from 'react'
import { ProjectConfig } from '@/types/project'
import { ProjectDesigner } from '@/components/ProjectDesigner'
import { ConfigurationPanel } from '@/components/ConfigurationPanel'
import { SimulationPanel } from '@/components/SimulationPanel'
import { ExportButton } from '@/components/ExportButton'
import { LoginForm } from '@/components/Auth/LoginForm'
import { ProjectList } from '@/components/Auth/ProjectList'
import LandingPage from '@/components/LandingPage'
import AppNavigation from '@/components/AppNavigation'
import { useProjectStore } from '@/store/projectStore'
import { useAuth } from '@/components/Auth/AuthProvider'

type View = 'landing' | 'auth' | 'projects' | 'designer'

function AppHeader({
  projectName,
  onSave,
  onBack,
  isLoading
}: {
  projectName: string
  onSave: () => void
  onBack: () => void
  isLoading: boolean
}) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="返回项目列表"
            >
              ← 返回
            </button>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">MDKSYS</h1>
              <span className="ml-4 text-sm text-gray-500">
                {projectName}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onSave}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              {isLoading ? '保存中...' : '保存项目'}
            </button>
            <ExportButton onExport={() => {
              const { project } = useProjectStore.getState()
              const dataStr = JSON.stringify(project, null, 2)
              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
              const exportFileDefaultName = `mdk-project-${project.name}-${new Date().toISOString().split('T')[0]}.json`
              const linkElement = document.createElement('a')
              linkElement.setAttribute('href', dataUri)
              linkElement.setAttribute('download', exportFileDefaultName)
              linkElement.click()
            }} />
          </div>
        </div>
      </div>
    </header>
  )
}

function AppDesigner() {
  const [activeTab, setActiveTab] = useState<'design' | 'config' | 'simulation'>('design')
  const { project, saveProject, isLoading } = useProjectStore()

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        projectName={project.name}
        onSave={saveProject}
        onBack={() => window.location.reload()}
        isLoading={isLoading}
      />

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('design')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'design'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              项目设计
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'config'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              项目配置
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'simulation'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              模拟运行
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'design' && <ProjectDesigner />}
        {activeTab === 'config' && <ConfigurationPanel />}
        {activeTab === 'simulation' && <SimulationPanel />}
      </main>
    </div>
  )
}

export default function Home() {
  const [view, setView] = useState<View>('landing')
  const { user, loading } = useAuth()
  const { createNewProject, loadProject } = useProjectStore()

  useEffect(() => {
    if (!loading && user && view === 'landing') {
      // 用户已登录且在首页，可以选择跳转到项目列表或保持首页
      // 这里保持首页，让用户可以自主选择
    }
  }, [user, loading, view])

  const LandingPageWithNav = () => (
    <div>
      <AppNavigation
        onShowAuth={() => setView('auth')}
        currentView="landing"
      />
      <LandingPage onShowAuth={() => setView('auth')} />
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (view === 'landing') {
    return <LandingPageWithNav />
  }

  if (view === 'auth') {
    return (
      <div>
        <AppNavigation
          onShowAuth={() => {}}
          onShowProjects={() => user && setView('projects')}
          onShowLanding={() => setView('landing')}
          currentView="auth"
        />
        <LoginForm onSuccess={() => setView('projects')} />
      </div>
    )
  }

  if (view === 'projects') {
    return (
      <div>
        <AppNavigation
          onShowAuth={() => setView('auth')}
          onShowProjects={() => {}}
          onShowLanding={() => setView('landing')}
          currentView="projects"
        />
        <ProjectList
          onSelectProject={async (projectId) => {
            await loadProject(projectId)
            setView('designer')
          }}
          onCreateProject={async () => {
            await createNewProject()
            setView('designer')
          }}
        />
      </div>
    )
  }

  if (view === 'designer') {
    return <AppDesigner />
  }

  return null
}
