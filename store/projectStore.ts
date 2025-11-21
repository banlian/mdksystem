import { create } from 'zustand'
import { ProjectConfig, IOConfig, AxisConfig, StationConfig, TaskConfig } from '@/types/project'
import { projectDB } from '@/lib/supabase/database'

interface ProjectStore {
  // Current project
  project: ProjectConfig
  // All projects for the user
  projects: ProjectConfig[]
  // Current project ID
  currentProjectId: string | null
  // Loading states
  isLoading: boolean
  isSaving: boolean
  // Error state
  error: string | null
  // Success state for user feedback
  success: string | null
  // Optimistic updates tracking
  optimisticUpdates: Set<string>
  // Offline support
  isOnline: boolean
  pendingChanges: Map<string, any>

  // Project operations
  updateProject: (project: Partial<ProjectConfig>) => void
  setProject: (project: ProjectConfig) => void
  loadProject: (id: string) => Promise<void>
  saveProject: () => Promise<void>
  createNewProject: (name?: string) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  loadProjects: () => Promise<void>
  clearError: () => void
  clearSuccess: () => void

  // IO Configuration operations
  addIOConfig: (config: IOConfig) => void
  updateIOConfig: (id: string, config: Partial<IOConfig>) => void
  deleteIOConfig: (id: string) => void

  // Axis Configuration operations
  addAxisConfig: (config: AxisConfig) => void
  updateAxisConfig: (id: string, config: Partial<AxisConfig>) => void
  deleteAxisConfig: (id: string) => void

  // Station Configuration operations
  addStationConfig: (config: StationConfig) => void
  updateStationConfig: (id: string, config: Partial<StationConfig>) => void
  deleteStationConfig: (id: string) => void

  // Task Configuration operations
  addTaskConfig: (config: TaskConfig) => void
  updateTaskConfig: (id: string, config: Partial<TaskConfig>) => void
  deleteTaskConfig: (id: string) => void

  // Health check
  checkHealth: () => Promise<void>
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const initialProject: ProjectConfig = {
  id: generateId(),
  name: '新项目',
  description: '',
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ioConfigs: [],
  axisConfigs: [],
  stationConfigs: [],
  taskConfigs: []
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  project: initialProject,
  projects: [],
  currentProjectId: null,
  isLoading: false,
  isSaving: false,
  error: null,
  success: null,
  optimisticUpdates: new Set(),
  isOnline: navigator.onLine,
  pendingChanges: new Map(),

  // Utility functions
  clearError: () => set({ error: null }),
  clearSuccess: () => set({ success: null }),

  // Enhanced error handling
  setError: (error: string) => set({ error, success: null }),
  setSuccess: (success: string) => set({ success, error: null }),

  // Project operations with enhanced error handling
  updateProject: (updates) => set((state) => ({
    project: {
      ...state.project,
      ...updates,
      updatedAt: new Date().toISOString()
    },
    error: null,
    success: null
  })),

  setProject: (project) => set({
    project,
    currentProjectId: project.id,
    error: null,
    success: null
  }),

  loadProject: async (id: string) => {
    const state = get()
    if (state.isLoading) return // Prevent duplicate loads

    set({ isLoading: true, error: null, success: null })
    try {
      const project = await projectDB.getProject(id)
      if (project) {
        set({
          project,
          currentProjectId: id,
          isLoading: false,
          error: null
        })
      } else {
        set({
          error: '项目不存在或已被删除',
          isLoading: false
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '加载项目失败'
      set({
        error: errorMessage,
        isLoading: false
      })
      console.error('Load project error:', error)
    }
  },

  saveProject: async () => {
    const state = get()
    if (state.isSaving) return // Prevent duplicate saves

    set({ isSaving: true, error: null })
    try {
      const { project } = get()

      // Validate project before saving
      if (!project.name.trim()) {
        throw new Error('项目名称不能为空')
      }

      const savedProject = await projectDB.saveProject(project)
      if (savedProject) {
        set({
          project: savedProject,
          currentProjectId: savedProject.id,
          isSaving: false,
          success: '项目保存成功！',
          error: null
        })

        // Reload projects list to reflect changes
        get().loadProjects()

        // Clear success message after 3 seconds
        setTimeout(() => {
          set({ success: null })
        }, 3000)
      } else {
        throw new Error('保存项目时发生未知错误')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '保存项目失败'
      set({
        error: errorMessage,
        isSaving: false,
        success: null
      })
      console.error('Save project error:', error)
    }
  },

  createNewProject: async (name = '新项目') => {
    const state = get()
    if (state.isLoading) return

    set({ isLoading: true, error: null })
    try {
      // Validate project name
      if (!name.trim()) {
        throw new Error('项目名称不能为空')
      }
      if (name.length > 100) {
        throw new Error('项目名称不能超过100个字符')
      }

      const newProject: ProjectConfig = {
        ...initialProject,
        id: generateId(),
        name: name.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const savedProject = await projectDB.saveProject(newProject)
      if (savedProject) {
        set({
          project: savedProject,
          currentProjectId: savedProject.id,
          isLoading: false,
          success: '项目创建成功！',
          error: null
        })

        // Reload projects list
        get().loadProjects()

        // Clear success message after 3 seconds
        setTimeout(() => {
          set({ success: null })
        }, 3000)
      } else {
        throw new Error('创建项目时发生未知错误')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '创建项目失败'
      set({
        error: errorMessage,
        isLoading: false,
        success: null
      })
      console.error('Create project error:', error)
    }
  },

  deleteProject: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      const success = await projectDB.deleteProject(id)
      if (success) {
        // If deleting current project, reset to initial
        const { currentProjectId, projects } = get()
        if (id === currentProjectId) {
          set({
            project: initialProject,
            currentProjectId: null
          })
        }
        // Remove from projects list
        set({
          projects: projects.filter(p => p.id !== id),
          isLoading: false
        })
      } else {
        set({
          error: 'Failed to delete project',
          isLoading: false
        })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete project',
        isLoading: false
      })
    }
  },

  loadProjects: async () => {
    set({ isLoading: true, error: null })
    try {
      const projects = await projectDB.getProjects()
      set({
        projects,
        isLoading: false
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load projects',
        isLoading: false
      })
    }
  },

  // IO Configuration operations
  addIOConfig: (config) => set((state) => ({
    project: {
      ...state.project,
      ioConfigs: [...state.project.ioConfigs, config],
      updatedAt: new Date().toISOString()
    }
  })),

  updateIOConfig: (id, updates) => set((state) => ({
    project: {
      ...state.project,
      ioConfigs: state.project.ioConfigs.map(config =>
        config.id === id ? { ...config, ...updates } : config
      ),
      updatedAt: new Date().toISOString()
    }
  })),

  deleteIOConfig: (id) => set((state) => ({
    project: {
      ...state.project,
      ioConfigs: state.project.ioConfigs.filter(config => config.id !== id),
      updatedAt: new Date().toISOString()
    }
  })),

  // Axis Configuration operations
  addAxisConfig: (config) => set((state) => ({
    project: {
      ...state.project,
      axisConfigs: [...state.project.axisConfigs, config],
      updatedAt: new Date().toISOString()
    }
  })),

  updateAxisConfig: (id, updates) => set((state) => ({
    project: {
      ...state.project,
      axisConfigs: state.project.axisConfigs.map(config =>
        config.id === id ? { ...config, ...updates } : config
      ),
      updatedAt: new Date().toISOString()
    }
  })),

  deleteAxisConfig: (id) => set((state) => ({
    project: {
      ...state.project,
      axisConfigs: state.project.axisConfigs.filter(config => config.id !== id),
      updatedAt: new Date().toISOString()
    }
  })),

  // Station Configuration operations
  addStationConfig: (config) => set((state) => ({
    project: {
      ...state.project,
      stationConfigs: [...state.project.stationConfigs, config],
      updatedAt: new Date().toISOString()
    }
  })),

  updateStationConfig: (id, updates) => set((state) => ({
    project: {
      ...state.project,
      stationConfigs: state.project.stationConfigs.map(config =>
        config.id === id ? { ...config, ...updates } : config
      ),
      updatedAt: new Date().toISOString()
    }
  })),

  deleteStationConfig: (id) => set((state) => ({
    project: {
      ...state.project,
      stationConfigs: state.project.stationConfigs.filter(config => config.id !== id),
      updatedAt: new Date().toISOString()
    }
  })),

  // Task Configuration operations
  addTaskConfig: (config) => set((state) => ({
    project: {
      ...state.project,
      taskConfigs: [...state.project.taskConfigs, config],
      updatedAt: new Date().toISOString()
    }
  })),

  updateTaskConfig: (id, updates) => set((state) => ({
    project: {
      ...state.project,
      taskConfigs: state.project.taskConfigs.map(config =>
        config.id === id ? { ...config, ...updates } : config
      ),
      updatedAt: new Date().toISOString()
    }
  })),

  deleteTaskConfig: (id) => set((state) => ({
    project: {
      ...state.project,
      taskConfigs: state.project.taskConfigs.filter(config => config.id !== id),
      updatedAt: new Date().toISOString()
    },
    error: null,
    success: null
  })),

  // Health check and connectivity
  checkHealth: async () => {
    try {
      const healthStatus = await projectDB.healthCheck()
      if (healthStatus.status === 'healthy') {
        set({
          isOnline: true,
          error: null
        })
      } else {
        set({
          isOnline: false,
          error: `数据库连接异常: ${healthStatus.details?.error || '未知错误'}`
        })
      }
    } catch (error) {
      set({
        isOnline: false,
        error: '无法连接到数据库'
      })
      console.error('Health check failed:', error)
    }
  }
}))

