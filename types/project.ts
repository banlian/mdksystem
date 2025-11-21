export interface IOConfig {
  id: string
  name: string
  type: 'DI' | 'DO' | 'AI' | 'AO' | 'SIGNAL'
  address: string
  description?: string
  enabled: boolean
}

export interface AxisConfig {
  id: string
  name: string
  type: 'X' | 'Y' | 'Z' | 'A' | 'B' | 'C'
  maxSpeed: number
  acceleration: number
  deceleration: number
  homePosition: number
  softLimitMin: number
  softLimitMax: number
  enabled: boolean
}

export interface StationConfig {
  id: string
  name: string
  position: { x: number; y: number }
  ioConfigs: string[] // IO配置ID列表
  axisConfigs: string[] // 轴配置ID列表
  description?: string
  enabled: boolean
}

export interface TaskConfig {
  id: string
  name: string
  stationId: string
  sequence: TaskStep[]
  priority: number
  enabled: boolean
}

export interface TaskStep {
  id: string
  type: 'MOVE' | 'IO' | 'WAIT' | 'CONDITION'
  parameters: Record<string, any>
  description?: string
}

export interface ProjectConfig {
  id: string
  name: string
  description?: string
  version: string
  createdAt: string
  updatedAt: string
  ioConfigs: IOConfig[]
  axisConfigs: AxisConfig[]
  stationConfigs: StationConfig[]
  taskConfigs: TaskConfig[]
}
