'use client'

import { useEffect } from 'react'
import { useProjectStore } from '@/store/projectStore'
import { useAuth } from './AuthProvider'

export function ProjectList({ onSelectProject, onCreateProject }: {
  onSelectProject: (projectId: string) => void
  onCreateProject: () => void
}) {
  const { user, signOut } = useAuth()
  const { projects, isLoading, loadProjects, deleteProject } = useProjectStore()

  useEffect(() => {
    if (user) {
      loadProjects()
    }
  }, [user, loadProjects])

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('确定要删除这个项目吗？此操作无法撤销。')) {
      await deleteProject(projectId)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载项目列表...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MDKSYS 项目管理</h1>
              <p className="mt-1 text-sm text-gray-600">
                欢迎, {user?.email} • {projects.length} 个项目
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onCreateProject}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                + 新建项目
              </button>
              <button
                onClick={handleSignOut}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                退出登录
              </button>
            </div>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">还没有项目</h3>
              <p className="text-gray-600 mb-6">创建您的第一个自动化项目</p>
              <button
                onClick={onCreateProject}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
              >
                创建项目
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {project.name}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        v{project.version}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {project.description || '暂无描述'}
                    </p>

                    <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                      <span>📡 {project.ioConfigs.length} IO配置</span>
                      <span>🎯 {project.axisConfigs.length} 轴配置</span>
                      <span>🏭 {project.stationConfigs.length} 工位</span>
                    </div>

                    <div className="text-xs text-gray-400 mb-4">
                      更新于 {new Date(project.updatedAt).toLocaleDateString('zh-CN')}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => onSelectProject(project.id)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
                      >
                        打开项目
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium py-2 px-3 rounded transition-colors"
                        title="删除项目"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}