'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Save, X, Play, Pause } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { TaskConfig, TaskStep } from '@/types/project'

export function TaskConfiguration() {
  const { project, addTaskConfig, updateTaskConfig, deleteTaskConfig } = useProjectStore()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<TaskConfig>>({
    name: '',
    stationId: '',
    sequence: [],
    priority: 1,
    enabled: true
  })

  const handleAdd = () => {
    if (formData.name && formData.stationId) {
      const newConfig: TaskConfig = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name!,
        stationId: formData.stationId!,
        sequence: formData.sequence!,
        priority: formData.priority!,
        enabled: formData.enabled!
      }
      addTaskConfig(newConfig)
      setFormData({
        name: '',
        stationId: '',
        sequence: [],
        priority: 1,
        enabled: true
      })
      setIsAdding(false)
    }
  }

  const handleEdit = (config: TaskConfig) => {
    setEditingId(config.id)
    setFormData(config)
  }

  const handleSave = () => {
    if (editingId && formData.name && formData.stationId) {
      updateTaskConfig(editingId, formData)
      setEditingId(null)
      setFormData({
        name: '',
        stationId: '',
        sequence: [],
        priority: 1,
        enabled: true
      })
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({
      name: '',
      stationId: '',
      sequence: [],
      priority: 1,
      enabled: true
    })
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个任务配置吗？')) {
      deleteTaskConfig(id)
    }
  }

  const handleAddStep = () => {
    const newStep: TaskStep = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'MOVE',
      parameters: {},
      description: ''
    }
    setFormData({
      ...formData,
      sequence: [...(formData.sequence || []), newStep]
    })
  }

  const handleUpdateStep = (stepId: string, updates: Partial<TaskStep>) => {
    const newSequence = (formData.sequence || []).map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    )
    setFormData({ ...formData, sequence: newSequence })
  }

  const handleDeleteStep = (stepId: string) => {
    const newSequence = (formData.sequence || []).filter(step => step.id !== stepId)
    setFormData({ ...formData, sequence: newSequence })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">任务配置</h3>
          <p className="text-sm text-gray-500">配置任务序列和步骤</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          添加任务
        </button>
      </div>

      {/* 添加/编辑表单 */}
      {(isAdding || editingId) && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">任务名称</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="输入任务名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">关联工位</label>
              <select
                value={formData.stationId || ''}
                onChange={(e) => setFormData({ ...formData, stationId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">选择工位</option>
                {project.stationConfigs.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
              <input
                type="number"
                value={formData.priority || 1}
                onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                min="1"
                max="10"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center">
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

          {/* 任务步骤配置 */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-md font-medium text-gray-900">任务步骤</h4>
              <button
                onClick={handleAddStep}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-100 hover:bg-primary-200"
              >
                <Plus className="w-4 h-4 mr-1" />
                添加步骤
              </button>
            </div>

            <div className="space-y-3">
              {(formData.sequence || []).map((step, index) => (
                <div key={step.id} className="bg-white rounded-lg border p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">步骤 {index + 1}</span>
                    <button
                      onClick={() => handleDeleteStep(step.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">步骤类型</label>
                      <select
                        value={step.type}
                        onChange={(e) => handleUpdateStep(step.id, { type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="MOVE">移动</option>
                        <option value="IO">IO操作</option>
                        <option value="WAIT">等待</option>
                        <option value="CONDITION">条件判断</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                      <input
                        type="text"
                        value={step.description || ''}
                        onChange={(e) => handleUpdateStep(step.id, { description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="步骤描述"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">参数</label>
                      <input
                        type="text"
                        value={JSON.stringify(step.parameters)}
                        onChange={(e) => {
                          try {
                            const params = JSON.parse(e.target.value)
                            handleUpdateStep(step.id, { parameters: params })
                          } catch (error) {
                            // 忽略JSON解析错误
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder='{"key": "value"}'
                      />
                    </div>
                  </div>
                </div>
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

      {/* 任务配置列表 */}
      <div className="bg-white rounded-lg border">
        {project.taskConfigs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">暂无任务配置，点击&ldquo;添加任务&rdquo;开始配置</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">任务名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">关联工位</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">步骤数</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">优先级</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {project.taskConfigs.map((config) => {
                  const station = project.stationConfigs.find(s => s.id === config.stationId)
                  return (
                    <tr key={config.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {config.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {station?.name || '未关联'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {config.sequence.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {config.priority}
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
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
