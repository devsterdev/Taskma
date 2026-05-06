import React, { useState } from 'react'
import { Check, Plus, Menu, X } from 'lucide-react'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  userId: number
}

interface AllTasksProps {
  selectedTag: string
  allTasks: Task[]
  isDarkMode: boolean
  completedTasks: number[]
  handleTaskComplete: (id: number) => void
}

const AllTasks: React.FC<AllTasksProps> = ({
  selectedTag,
  allTasks,
  isDarkMode,
  completedTasks,
  handleTaskComplete,
}) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '' })

  const handleAddTaskClick = () => {
    setShowAddForm(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = () => {
    if (formData.title.trim()) {
      console.log('New task:', formData)
      setFormData({ title: '', description: '' })
      setShowAddForm(false)
    }
  }
  return (
    <div className={`flex-1 ${isDarkMode ? 'border-white' : 'border-black'} border-r p-8 overflow-y-auto`}>
      <div className="mb-8">
        <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          <Menu size={24} />
          {selectedTag}
        </h2>

        <button 
          onClick={handleAddTaskClick}
          className={`mb-6 flex items-center gap-2 transition-colors ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'}`}
        >
          <Plus size={20} />
          Add a task
        </button>

        {/* Add Task Form */}
        {showAddForm && (
          <div className={`mb-6 p-4 rounded-lg border-2 transition-all ${isDarkMode ? 'bg-gray-900 border-white' : 'bg-gray-50 border-black'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>New Task</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
              >
                <X size={20} className={isDarkMode ? 'text-white' : 'text-black'} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Enter task title"
                  className={`w-full px-3 py-2 rounded border-2 transition-colors ${
                    isDarkMode
                      ? 'bg-black border-white text-white placeholder-gray-500 focus:outline-none focus:border-gray-300'
                      : 'bg-white border-black text-black placeholder-gray-400 focus:outline-none focus:border-gray-600'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Enter task description (optional)"
                  rows={3}
                  className={`w-full px-3 py-2 rounded border-2 transition-colors resize-none ${
                    isDarkMode
                      ? 'bg-black border-white text-white placeholder-gray-500 focus:outline-none focus:border-gray-300'
                      : 'bg-white border-black text-black placeholder-gray-400 focus:outline-none focus:border-gray-600'
                  }`}
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className={`px-4 py-2 rounded transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className={`px-4 py-2 rounded transition-colors ${
                    isDarkMode
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {allTasks.map(task => (
            <label
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
              }`}
            >
              <div
                onClick={() => handleTaskComplete(task.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  completedTasks.includes(task.id)
                    ? isDarkMode ? 'bg-white border-white' : 'bg-black border-black'
                    : isDarkMode ? 'border-white hover:bg-gray-800' : 'border-black hover:bg-gray-200'
                }`}
              >
                {completedTasks.includes(task.id) && (
                  <Check size={16} className={isDarkMode ? 'text-black' : 'text-white'} />
                )}
              </div>
              <span className={completedTasks.includes(task.id) ? 'line-through text-gray-500' : isDarkMode ? 'text-white' : 'text-black'}>
                {task.title}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllTasks
