'use client'

import { useState } from 'react'
import { Plus, Settings, Trash2 } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { StationConfig } from '@/types/project'

export function ProjectDesigner() {
  const { project, addStationConfig, deleteStationConfig } = useProjectStore()
  const [selectedStation, setSelectedStation] = useState<string | null>(null)

  const handleAddStation = () => {
    const newStation: StationConfig = {
      id: Math.random().toString(36).substr(2, 9),
      name: `工位${project.stationConfigs.length + 1}`,
      position: { x: 100, y: 100 },
      ioConfigs: [],
      axisConfigs: [],
      description: '',
      enabled: true
    }
    addStationConfig(newStation)
  }

  const handleStationClick = (stationId: string) => {
    setSelectedStation(selectedStation === stationId ? null : stationId)
  }

  const handleDeleteStation = (stationId: string) => {
    deleteStationConfig(stationId)
    if (selectedStation === stationId) {
      setSelectedStation(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">项目设计</h2>
        <button
          onClick={handleAddStation}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          添加工位
        </button>
      </div>

      {/* 设计画布 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="relative w-full h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          {project.stationConfigs.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">点击&ldquo;添加工位&rdquo;开始设计项目</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {project.stationConfigs.map((station) => (
                <div
                  key={station.id}
                  className={`absolute w-32 h-20 bg-white border-2 rounded-lg shadow-sm cursor-pointer transition-all ${
                    selectedStation === station.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    left: station.position.x,
                    top: station.position.y,
                  }}
                  onClick={() => handleStationClick(station.id)}
                >
                  <div className="p-3 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-sm text-gray-900 truncate">
                        {station.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        IO: {station.ioConfigs.length} | 轴: {station.axisConfigs.length}
                      </p>
                    </div>
                    {selectedStation === station.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteStation(station.id)
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 工位列表 */}
      {project.stationConfigs.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">工位列表</h3>
          </div>
          <div className="divide-y">
            {project.stationConfigs.map((station) => (
              <div
                key={station.id}
                className={`px-6 py-4 hover:bg-gray-50 cursor-pointer ${
                  selectedStation === station.id ? 'bg-primary-50' : ''
                }`}
                onClick={() => handleStationClick(station.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{station.name}</h4>
                    <p className="text-sm text-gray-500">
                      IO配置: {station.ioConfigs.length} | 轴配置: {station.axisConfigs.length}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      station.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {station.enabled ? '启用' : '禁用'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
