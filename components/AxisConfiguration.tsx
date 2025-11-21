'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { AxisConfig } from '@/types/project'

export function AxisConfiguration() {
  const { project, addAxisConfig, updateAxisConfig, deleteAxisConfig } = useProjectStore()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<AxisConfig>>({
    name: '',
    type: 'X',
    maxSpeed: 100,
    acceleration: 50,
    deceleration: 50,
    homePosition: 0,
    softLimitMin: -1000,
    softLimitMax: 1000,
    enabled: true
  })

  const handleAdd = () => {
    if (formData.name) {
      const newConfig: AxisConfig = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name!,
        type: formData.type!,
        maxSpeed: formData.maxSpeed!,
        acceleration: formData.acceleration!,
        deceleration: formData.deceleration!,
        homePosition: formData.homePosition!,
        softLimitMin: formData.softLimitMin!,
        softLimitMax: formData.softLimitMax!,
        enabled: formData.enabled!
      }
      addAxisConfig(newConfig)
      setFormData({
        name: '',
        type: 'X',
        maxSpeed: 100,
        acceleration: 50,
        deceleration: 50,
        homePosition: 0,
        softLimitMin: -1000,
        softLimitMax: 1000,
        enabled: true
      })
      setIsAdding(false)
    }
  }

  const handleEdit = (config: AxisConfig) => {
    setEditingId(config.id)
    setFormData(config)
  }

  const handleSave = () => {
    if (editingId && formData.name) {
      updateAxisConfig(editingId, formData)
      setEditingId(null)
      setFormData({
        name: '',
        type: 'X',
        maxSpeed: 100,
        acceleration: 50,
        deceleration: 50,
        homePosition: 0,
        softLimitMin: -1000,
        softLimitMax: 1000,
        enabled: true
      })
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({
      name: '',
      type: 'X',
      maxSpeed: 100,
      acceleration: 50,
      deceleration: 50,
      homePosition: 0,
      softLimitMin: -1000,
      softLimitMax: 1000,
      enabled: true
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个轴配置吗？')) {
      deleteAxisConfig(id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">轴配置</h3>
          <p className="text-sm text-gray-500">配置运动轴的参数和限制</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          添加轴
        </button>
      </div>

      {/* 添加/编辑表单 */}
      {(isAdding || editingId) && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="输入轴名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">轴类型</label>
              <select
                value={formData.type || 'X'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="X">X轴</option>
                <option value="Y">Y轴</option>
                <option value="Z">Z轴</option>
                <option value="A">A轴</option>
                <option value="B">B轴</option>
                <option value="C">C轴</option>
              </select>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">最大速度</label>
              <input
                type="number"
                value={formData.maxSpeed || 100}
                onChange={(e) => setFormData({ ...formData, maxSpeed: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">加速度</label>
              <input
                type="number"
                value={formData.acceleration || 50}
                onChange={(e) => setFormData({ ...formData, acceleration: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">减速度</label>
              <input
                type="number"
                value={formData.deceleration || 50}
                onChange={(e) => setFormData({ ...formData, deceleration: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">原点位置</label>
              <input
                type="number"
                value={formData.homePosition || 0}
                onChange={(e) => setFormData({ ...formData, homePosition: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">软限位最小值</label>
              <input
                type="number"
                value={formData.softLimitMin || -1000}
                onChange={(e) => setFormData({ ...formData, softLimitMin: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="-1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">软限位最大值</label>
              <input
                type="number"
                value={formData.softLimitMax || 1000}
                onChange={(e) => setFormData({ ...formData, softLimitMax: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="1000"
              />
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

      {/* 轴配置列表 */}
      <div className="bg-white rounded-lg border">
        {project.axisConfigs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">暂无轴配置，点击&ldquo;添加轴&rdquo;开始配置</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最大速度</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">加速度</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">原点位置</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">软限位</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {project.axisConfigs.map((config) => (
                  <tr key={config.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {config.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {config.type}轴
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {config.maxSpeed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {config.acceleration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {config.homePosition}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {config.softLimitMin} ~ {config.softLimitMax}
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
