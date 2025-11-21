'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Square, RotateCcw } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'

export function SimulationPanel() {
  const { project } = useProjectStore()
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [simulationLog, setSimulationLog] = useState<string[]>([])
  const [simulationSpeed, setSimulationSpeed] = useState(1000) // 毫秒

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setSimulationLog(prev => [...prev, `[${timestamp}] ${message}`])
  }

  const startSimulation = () => {
    setIsRunning(true)
    setCurrentStep(0)
    setSimulationLog([])
    addLog('开始项目模拟运行')
  }

  const pauseSimulation = () => {
    setIsRunning(false)
    addLog('模拟运行已暂停')
  }

  const stopSimulation = () => {
    setIsRunning(false)
    setCurrentStep(0)
    addLog('模拟运行已停止')
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setCurrentStep(0)
    setSimulationLog([])
  }

  // 模拟运行逻辑
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      // 这里可以实现更复杂的模拟逻辑
      // 目前只是简单的步骤计数
      setCurrentStep(prev => {
        const nextStep = prev + 1
        addLog(`执行步骤 ${nextStep}`)
        
        // 模拟完成所有任务
        if (nextStep >= project.taskConfigs.length * 5) {
          setIsRunning(false)
          addLog('模拟运行完成')
          return prev
        }
        
        return nextStep
      })
    }, simulationSpeed)

    return () => clearInterval(interval)
  }, [isRunning, simulationSpeed, project.taskConfigs.length])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">项目模拟运行</h2>
        <p className="text-gray-600">在线模拟项目运行，验证设计正确性</p>
      </div>

      {/* 模拟控制面板 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">模拟控制</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">运行速度:</span>
              <select
                value={simulationSpeed}
                onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                disabled={isRunning}
              >
                <option value={500}>快速 (0.5s)</option>
                <option value={1000}>正常 (1s)</option>
                <option value={2000}>慢速 (2s)</option>
                <option value={5000}>调试 (5s)</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={startSimulation}
            disabled={isRunning}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4 mr-2" />
            开始模拟
          </button>
          
          <button
            onClick={pauseSimulation}
            disabled={!isRunning}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Pause className="w-4 h-4 mr-2" />
            暂停
          </button>
          
          <button
            onClick={stopSimulation}
            disabled={!isRunning}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Square className="w-4 h-4 mr-2" />
            停止
          </button>
          
          <button
            onClick={resetSimulation}
            disabled={isRunning}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重置
          </button>
        </div>

        {/* 运行状态 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">运行状态</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              isRunning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isRunning ? '运行中' : '已停止'}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            当前步骤: {currentStep} / {project.taskConfigs.length * 5}
          </div>
        </div>
      </div>

      {/* 模拟日志 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">模拟日志</h3>
        </div>
        <div className="p-6">
          <div className="bg-gray-900 text-green-400 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {simulationLog.length === 0 ? (
              <div className="text-gray-500">暂无日志信息</div>
            ) : (
              simulationLog.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 项目统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <span className="text-blue-600 font-medium">IO</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">IO配置</p>
              <p className="text-2xl font-semibold text-gray-900">{project.ioConfigs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <span className="text-green-600 font-medium">轴</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">轴配置</p>
              <p className="text-2xl font-semibold text-gray-900">{project.axisConfigs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                <span className="text-yellow-600 font-medium">工位</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">工位配置</p>
              <p className="text-2xl font-semibold text-gray-900">{project.stationConfigs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                <span className="text-purple-600 font-medium">任务</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">任务配置</p>
              <p className="text-2xl font-semibold text-gray-900">{project.taskConfigs.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
