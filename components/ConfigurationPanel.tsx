'use client'

import { useState } from 'react'
import { IOConfiguration } from './IOConfiguration'
import { AxisConfiguration } from './AxisConfiguration'
import { StationConfiguration } from './StationConfiguration'
import { TaskConfiguration } from './TaskConfiguration'

export function ConfigurationPanel() {
  const [activeConfig, setActiveConfig] = useState<'io' | 'axis' | 'station' | 'task'>('io')

  const configTabs = [
    { id: 'io', name: 'IO配置', description: '数字输入/输出、模拟输入/输出、信号配置' },
    { id: 'axis', name: '轴配置', description: '运动轴参数配置' },
    { id: 'station', name: '工位配置', description: '工位IO和轴配置关联' },
    { id: 'task', name: '任务配置', description: '任务序列和步骤配置' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">项目配置</h2>
        <p className="text-gray-600">配置项目的IO、轴、工位和任务参数</p>
      </div>

      {/* 配置标签页 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {configTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveConfig(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeConfig === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeConfig === 'io' && <IOConfiguration />}
          {activeConfig === 'axis' && <AxisConfiguration />}
          {activeConfig === 'station' && <StationConfiguration />}
          {activeConfig === 'task' && <TaskConfiguration />}
        </div>
      </div>
    </div>
  )
}
