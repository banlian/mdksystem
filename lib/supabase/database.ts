import { createClient } from './client'
import type { ProjectConfig, IOConfig, AxisConfig, StationConfig, TaskConfig, TaskStep } from '@/types/project'

interface DatabaseProject {
  id: string
  user_id: string
  name: string
  description?: string
  version: string
  created_at: string
  updated_at: string
}

interface DatabaseIOConfig {
  id: string
  project_id: string
  name: string
  type: string
  address: string
  description?: string
  enabled: boolean
  created_at: string
  updated_at: string
}

interface DatabaseAxisConfig {
  id: string
  project_id: string
  name: string
  type: string
  max_speed: number
  acceleration: number
  deceleration: number
  home_position: number
  soft_limit_min: number
  soft_limit_max: number
  enabled: boolean
  created_at: string
  updated_at: string
}

interface DatabaseStationConfig {
  id: string
  project_id: string
  name: string
  position_x: number
  position_y: number
  description?: string
  enabled: boolean
  created_at: string
  updated_at: string
}

interface DatabaseTaskConfig {
  id: string
  project_id: string
  station_id?: string
  name: string
  priority: number
  enabled: boolean
  created_at: string
  updated_at: string
}

interface DatabaseTaskStep {
  id: string
  task_id: string
  sequence_order: number
  type: string
  parameters: Record<string, any>
  description?: string
  created_at: string
  updated_at: string
}

// Enhanced error types
interface DatabaseError extends Error {
  code?: string
  details?: any
  context?: Record<string, any>
}

class DatabaseValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message)
    this.name = 'DatabaseValidationError'
  }
}

class TransactionError extends Error {
  constructor(message: string, public operation?: string, public cause?: Error) {
    super(message)
    this.name = 'TransactionError'
  }
}

// Data validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateProjectName = (name: string): boolean => {
  return name.trim().length > 0 && name.length <= 100
}

const validateIOConfig = (config: IOConfig): void => {
  if (!config.name.trim()) throw new DatabaseValidationError('IO配置名称不能为空', 'name')
  if (!config.address.trim()) throw new DatabaseValidationError('IO地址不能为空', 'address')
  if (!['DI', 'DO', 'AI', 'AO', 'SIGNAL'].includes(config.type)) {
    throw new DatabaseValidationError('无效的IO类型', 'type')
  }
}

const validateAxisConfig = (config: AxisConfig): void => {
  if (!config.name.trim()) throw new DatabaseValidationError('轴配置名称不能为空', 'name')
  if (!['X', 'Y', 'Z', 'A', 'B', 'C'].includes(config.type)) {
    throw new DatabaseValidationError('无效的轴类型', 'type')
  }
  if (config.maxSpeed <= 0) throw new DatabaseValidationError('最大速度必须大于0', 'maxSpeed')
  if (config.acceleration <= 0) throw new DatabaseValidationError('加速度必须大于0', 'acceleration')
  if (config.deceleration <= 0) throw new DatabaseValidationError('减速度必须大于0', 'deceleration')
}

const validateStationConfig = (config: StationConfig): void => {
  if (!config.name.trim()) throw new DatabaseValidationError('工站配置名称不能为空', 'name')
  if (isNaN(config.position.x) || isNaN(config.position.y)) {
    throw new DatabaseValidationError('工站位置必须是有效的数字', 'position')
  }
}

const validateTaskConfig = (config: TaskConfig): void => {
  if (!config.name.trim()) throw new DatabaseValidationError('任务配置名称不能为空', 'name')
  if (config.priority < 0) throw new DatabaseValidationError('任务优先级不能为负数', 'priority')
}

export class ProjectDatabaseService {
  private supabase = createClient()

  // Public access to supabase client for auth operations
  get supabaseClient() {
    return this.supabase
  }

  private createError(error: any, context?: Record<string, any>): DatabaseError {
    const dbError: DatabaseError = new Error(error?.message || 'Unknown database error')
    dbError.code = error?.code
    dbError.details = error?.details
    dbError.context = context
    return dbError
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        const dbError = this.createError(error)

        // Don't retry on validation or authentication errors
        if (
          (error as any)?.code === '23505' || // unique violation
          (error as any)?.code === '23503' || // foreign key violation
          (error as any)?.code === '23514' || // check violation
          (error as any)?.message?.includes('Invalid') ||
          (error as any)?.message?.includes('authentication')
        ) {
          throw dbError
        }

        if (attempt === maxRetries) {
          throw new TransactionError(
            `Operation failed after ${maxRetries} attempts`,
            'withRetry',
            dbError
          )
        }

        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
      }
    }

    throw new TransactionError('Unexpected error in withRetry')
  }

  private async validateCurrentUser(): Promise<string> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      if (error) throw error
      if (!user) throw new DatabaseValidationError('用户未登录')
      return user.id
    } catch (error) {
      throw this.createError(error, { operation: 'validateCurrentUser' })
    }
  }

  // Project operations
  async getProjects(): Promise<ProjectConfig[]> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data: projects, error } = await this.supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error

      const projectConfigs: ProjectConfig[] = []

      for (const project of projects || []) {
        const fullProject = await this.getProjectWithDetails(project.id)
        if (fullProject) {
          projectConfigs.push(fullProject)
        }
      }

      return projectConfigs
    } catch (error) {
      console.error('Error fetching projects:', error)
      return []
    }
  }

  async getProject(id: string): Promise<ProjectConfig | null> {
    try {
      return await this.getProjectWithDetails(id)
    } catch (error) {
      console.error('Error fetching project:', error)
      return null
    }
  }

  private async getProjectWithDetails(projectId: string): Promise<ProjectConfig | null> {
    const { data: project, error: projectError } = await this.supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (projectError || !project) return null

    // Get all related data in parallel
    const [ioConfigsResult, axisConfigsResult, stationConfigsResult, taskConfigsResult] = await Promise.all([
      this.supabase.from('io_configs').select('*').eq('project_id', projectId),
      this.supabase.from('axis_configs').select('*').eq('project_id', projectId),
      this.supabase.from('station_configs').select('*').eq('project_id', projectId),
      this.supabase.from('task_configs').select('*').eq('project_id', projectId)
    ])

    // Get station relationships
    const stationIds = stationConfigsResult.data?.map(s => s.id) || []
    const [stationIOResult, stationAxisResult] = await Promise.all([
      stationIds.length > 0 ? this.supabase
        .from('station_io_configs')
        .select('station_id, io_config_id')
        .in('station_id', stationIds) : { data: [], error: null },
      stationIds.length > 0 ? this.supabase
        .from('station_axis_configs')
        .select('station_id, axis_config_id')
        .in('station_id', stationIds) : { data: [], error: null }
    ])

    // Get task steps
    const taskIds = taskConfigsResult.data?.map(t => t.id) || []
    const taskStepsResult = taskIds.length > 0 ? await this.supabase
      .from('task_steps')
      .select('*')
      .in('task_id', taskIds)
      .order('sequence_order') : { data: [], error: null }

    // Build relationships
    const stationRelationships = new Map()
    stationIOResult.data?.forEach(rel => {
      if (!stationRelationships.has(rel.station_id)) {
        stationRelationships.set(rel.station_id, { io: [], axis: [] })
      }
      stationRelationships.get(rel.station_id).io.push(rel.io_config_id)
    })

    stationAxisResult.data?.forEach(rel => {
      if (!stationRelationships.has(rel.station_id)) {
        stationRelationships.set(rel.station_id, { io: [], axis: [] })
      }
      stationRelationships.get(rel.station_id).axis.push(rel.axis_config_id)
    })

    // Build task steps map
    const taskStepsMap = new Map()
    taskStepsResult.data?.forEach(step => {
      if (!taskStepsMap.has(step.task_id)) {
        taskStepsMap.set(step.task_id, [])
      }
      taskStepsMap.get(step.task_id).push({
        id: step.id,
        type: step.type as TaskStep['type'],
        parameters: step.parameters,
        description: step.description
      })
    })

    // Transform data
    const ioConfigs: IOConfig[] = (ioConfigsResult.data || []).map(io => ({
      id: io.id,
      name: io.name,
      type: io.type as IOConfig['type'],
      address: io.address,
      description: io.description,
      enabled: io.enabled
    }))

    const axisConfigs: AxisConfig[] = (axisConfigsResult.data || []).map(axis => ({
      id: axis.id,
      name: axis.name,
      type: axis.type as AxisConfig['type'],
      maxSpeed: axis.max_speed,
      acceleration: axis.acceleration,
      deceleration: axis.deceleration,
      homePosition: axis.home_position,
      softLimitMin: axis.soft_limit_min,
      softLimitMax: axis.soft_limit_max,
      enabled: axis.enabled
    }))

    const stationConfigs: StationConfig[] = (stationConfigsResult.data || []).map(station => {
      const relationships = stationRelationships.get(station.id) || { io: [], axis: [] }
      return {
        id: station.id,
        name: station.name,
        position: { x: station.position_x, y: station.position_y },
        ioConfigs: relationships.io,
        axisConfigs: relationships.axis,
        description: station.description,
        enabled: station.enabled
      }
    })

    const taskConfigs: TaskConfig[] = (taskConfigsResult.data || []).map(task => ({
      id: task.id,
      name: task.name,
      stationId: task.station_id || '',
      sequence: taskStepsMap.get(task.id) || [],
      priority: task.priority,
      enabled: task.enabled
    }))

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      version: project.version,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
      ioConfigs,
      axisConfigs,
      stationConfigs,
      taskConfigs
    }
  }

  async saveProject(project: ProjectConfig): Promise<ProjectConfig | null> {
    return this.withRetry(async () => {
      // Validate project data
      if (!validateProjectName(project.name)) {
        throw new DatabaseValidationError('项目名称无效', 'name')
      }

      // Validate all configurations
      project.ioConfigs.forEach(validateIOConfig)
      project.axisConfigs.forEach(validateAxisConfig)
      project.stationConfigs.forEach(validateStationConfig)
      project.taskConfigs.forEach(validateTaskConfig)

      const userId = await this.validateCurrentUser()

      // Use a transaction-like approach
      const savedProject = await this.supabase.rpc('save_project_transaction', {
        p_id: project.id,
        p_user_id: userId,
        p_name: project.name,
        p_description: project.description,
        p_version: project.version,
        p_io_configs: project.ioConfigs,
        p_axis_configs: project.axisConfigs,
        p_station_configs: project.stationConfigs,
        p_task_configs: project.taskConfigs
      })

      if (savedProject.error) {
        throw this.createError(savedProject.error, {
          operation: 'saveProject',
          projectId: project.id
        })
      }

      return await this.getProjectWithDetails(project.id)
    })
  }

  private async saveIOConfigs(projectId: string, configs: IOConfig[]) {
    if (configs.length === 0) return []

    const ioData = configs.map(config => ({
      id: config.id,
      project_id: projectId,
      name: config.name,
      type: config.type,
      address: config.address,
      description: config.description,
      enabled: config.enabled
    }))

    const { data: savedData, error } = await this.supabase
      .from('io_configs')
      .upsert(ioData)
      .select()

    if (error) throw error
    return savedData
  }

  private async saveAxisConfigs(projectId: string, configs: AxisConfig[]) {
    if (configs.length === 0) return []

    const axisData = configs.map(config => ({
      id: config.id,
      project_id: projectId,
      name: config.name,
      type: config.type,
      max_speed: config.maxSpeed,
      acceleration: config.acceleration,
      deceleration: config.deceleration,
      home_position: config.homePosition,
      soft_limit_min: config.softLimitMin,
      soft_limit_max: config.softLimitMax,
      enabled: config.enabled
    }))

    const { data: savedData, error } = await this.supabase
      .from('axis_configs')
      .upsert(axisData)
      .select()

    if (error) throw error
    return savedData
  }

  private async saveStationConfigs(projectId: string, configs: StationConfig[]) {
    if (configs.length === 0) return []

    // Save stations
    const stationsData = configs.map(config => ({
      id: config.id,
      project_id: projectId,
      name: config.name,
      position_x: config.position.x,
      position_y: config.position.y,
      description: config.description,
      enabled: config.enabled
    }))

    const { data: savedStations, error: stationError } = await this.supabase
      .from('station_configs')
      .upsert(stationsData)
      .select()

    if (stationError) throw stationError

    // Save relationships
    const ioRelationships = configs.flatMap(station =>
      station.ioConfigs.map(ioId => ({ station_id: station.id, io_config_id: ioId }))
    )

    const axisRelationships = configs.flatMap(station =>
      station.axisConfigs.map(axisId => ({ station_id: station.id, axis_config_id: axisId }))
    )

    if (ioRelationships.length > 0) {
      await this.supabase.from('station_io_configs').upsert(ioRelationships)
    }
    if (axisRelationships.length > 0) {
      await this.supabase.from('station_axis_configs').upsert(axisRelationships)
    }

    return savedStations
  }

  private async saveTaskConfigs(projectId: string, configs: TaskConfig[]) {
    if (configs.length === 0) return []

    // Save tasks
    const tasksData = configs.map(config => ({
      id: config.id,
      project_id: projectId,
      station_id: config.stationId || null,
      name: config.name,
      priority: config.priority,
      enabled: config.enabled
    }))

    const { data: savedTasks, error: taskError } = await this.supabase
      .from('task_configs')
      .upsert(tasksData)
      .select()

    if (taskError) throw taskError

    // Save task steps
    const stepsData = configs.flatMap(task =>
      task.sequence.map((step, index) => ({
        id: step.id,
        task_id: task.id,
        sequence_order: index,
        type: step.type,
        parameters: step.parameters,
        description: step.description
      }))
    )

    if (stepsData.length > 0) {
      await this.supabase.from('task_steps').upsert(stepsData)
    }

    return savedTasks
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.withRetry(async () => {
      const userId = await this.validateCurrentUser()

      // First verify project ownership
      const { data: project, error: fetchError } = await this.supabase
        .from('projects')
        .select('user_id')
        .eq('id', id)
        .single()

      if (fetchError) throw this.createError(fetchError, { operation: 'deleteProject_verify', projectId: id })
      if (!project) throw new DatabaseValidationError('项目不存在')
      if (project.user_id !== userId) throw new DatabaseValidationError('无权删除此项目')

      // Delete project (cascade delete should handle related records)
      const { error } = await this.supabase
        .from('projects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw this.createError(error, { operation: 'deleteProject', projectId: id })

      return true
    }).catch(error => {
      console.error('Error deleting project:', error)
      return false
    })
  }

  // Enhanced Authentication methods
  async signUp(email: string, password: string) {
    return this.withRetry(async () => {
      // Client-side validation
      if (!validateEmail(email)) {
        throw new DatabaseValidationError('邮箱格式无效', 'email')
      }
      if (password.length < 6) {
        throw new DatabaseValidationError('密码至少需要6个字符', 'password')
      }

      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            created_at: new Date().toISOString()
          }
        }
      })

      if (error) throw this.createError(error, { operation: 'signUp', email })
      return { data, error: null }
    }).catch(error => {
      return { data: null, error }
    })
  }

  async signIn(email: string, password: string) {
    return this.withRetry(async () => {
      // Client-side validation
      if (!validateEmail(email)) {
        throw new DatabaseValidationError('邮箱格式无效', 'email')
      }
      if (!password) {
        throw new DatabaseValidationError('密码不能为空', 'password')
      }

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw this.createError(error, { operation: 'signIn', email })
      return { data, error: null }
    }).catch(error => {
      return { data: null, error }
    })
  }

  async signOut() {
    return this.withRetry(async () => {
      const { error } = await this.supabase.auth.signOut({
        scope: 'global' // Sign out from all sessions
      })

      if (error) throw this.createError(error, { operation: 'signOut' })
      return { error: null }
    }).catch(error => {
      return { error }
    })
  }

  async getCurrentUser() {
    return this.withRetry(async () => {
      const { data: { user }, error } = await this.supabase.auth.getUser()

      if (error) throw this.createError(error, { operation: 'getCurrentUser' })
      return { user, error: null }
    }).catch(error => {
      return { user: null, error }
    })
  }

  // Health check method
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy', details?: any }> {
    try {
      const startTime = Date.now()
      const { data, error } = await this.supabase
        .from('projects')
        .select('count')
        .limit(1)

      const responseTime = Date.now() - startTime

      if (error) {
        return {
          status: 'unhealthy',
          details: { error: error.message, responseTime }
        }
      }

      return {
        status: 'healthy',
        details: { responseTime, timestamp: new Date().toISOString() }
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  }
}

export const projectDB = new ProjectDatabaseService()