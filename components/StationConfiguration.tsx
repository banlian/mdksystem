'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { StationConfig } from '@/types/project'

export function StationConfiguration() {
  const { project, addStationConfig, updateStationConfig, deleteStationConfig } = useProjectStore()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<StationConfig>>({
    name: '',
    position: { x: 100, y: 100 },
    ioConfigs: [],
    axisConfigs: [],
    description: '',
    enabled: true
  })

  const handleAdd = () => {
    if (formData.name) {
      const newConfig: StationConfig = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name!,
        position: formData.position!,
        ioConfigs: formData.ioConfigs!,
        axisConfigs: formData.axisConfigs!,
        description: formData.description || '',
        enabled: formData.enabled!
      }
      addStationConfig(newConfig)
      setFormData({
        name: '',
        position: { x: 100, y: 100 },
        ioConfigs: [],
        axisConfigs: [],
        description: '',
        enabled: true
      })
      setIsAdding(false)
    }
  }

  const handleEdit = (config: StationConfig) => {
    setEditingId(config.id)
    setFormData(config)
  }

  const handleSave = () => {
    if (editingId && formData.name) {
      updateStationConfig(editingId, formData)
      setEditingId(null)
      setFormData({
        name: '',
        position: { x: 100, y: 100 },
        ioConfigs: [],
        axisConfigs: [],
        description: '',
        enabled: true
      })
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({
      name: '',
      position: { x: 100, y: 100 },
      ioConfigs: [],
      axisConfigs: [],
      description: '',
      enabled: true
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个工位配置吗？')) {
      deleteStationConfig(id)
    }
  }

  const handleIOConfigToggle = (ioId: string) => {
    const currentIOs = formData.ioConfigs || []
    const newIOs = currentIOs.includes(ioId)
      ? currentIOs.filter(id => id !== ioId)
      : [...currentIOs, ioId]
    setFormData({ ...formData, ioConfigs: newIOs })
  }

  const handleAxisConfigToggle = (axisId: string) => {
    const currentAxes = formData.axisConfigs || []
    const newAxes = currentAxes.includes(axisId)
      ? currentAxes.filter(id => id !== axisId)
      : [...currentAxes, axisId]
    setFormData({ ...formData, axisConfigs: newAxes })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">工位配置</h3>
          <p className="text-sm text-gray-500">配置工位并关联IO和轴配置</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          添加工位
        </button>
      </div>

      {/* 添加/编辑表单 */}
      {(isAdding || editingId) && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">工位名称</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="输入工位名称"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.enabled || false}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">启用</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <input
              type="text"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="输入描述（可选）"
            />
          </div>

          {/* IO配置选择 */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">关联IO配置</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {project.ioConfigs.map((io) => (
                <label key={io.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(formData.ioConfigs || []).includes(io.id)}
                    onChange={() => handleIOConfigToggle(io.id)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{io.name} ({io.type})</span>
                </label>
              ))}
            </div>
          </div>

          {/* 轴配置选择 */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">关联轴配置</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {project.axisConfigs.map((axis) => (
                <label key={axis.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(formData.axisConfigs || []).includes(axis.id)}
                    onChange={() => handleAxisConfigToggle(axis.id)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{axis.name} ({axis.type}轴)</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              取消
            </button>
            <button
              onClick={editingId ? handleSave : handleAdd}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingId ? '保存' : '添加'}
            </button>
          </div>
        </div>
      )}

      {/* 工位配置列表 */}
      <div className="bg-white rounded-lg border">
        {project.stationConfigs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">暂无工位配置，点击&ldquo;添加工位&rdquo;开始配置</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">工位名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">位置</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IO配置</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">轴配置</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {project.stationConfigs.map((config) => (
                  <tr key={config.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {config.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ({config.position.x}, {config.position.y})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {config.ioConfigs.length} 个
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {config.axisConfigs.length} 个
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {config.enabled ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(config)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(config.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
