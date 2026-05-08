import React, { useState, useEffect, useRef } from 'react'
import { Check, Plus, Menu, X, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { apiCall } from '../utils/api'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  userId: number
  tags?: { id: number; name: string }[]
}

interface AllTasksProps {
  selectedTag: string
  allTasks: Task[]
  isDarkMode: boolean
  handleTaskComplete: (task: Task) => Promise<void>
  onTaskCreated: () => Promise<void>
}

const AllTasks: React.FC<AllTasksProps> = ({
  selectedTag,
  allTasks,
  isDarkMode,
  handleTaskComplete,
  onTaskCreated,
}) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', tags: '', today: false })
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState({ title: '', description: '', tags: '', today: false })
  const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null)
  const [menuOpenTaskId, setMenuOpenTaskId] = useState<number | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)

  const normalizeTagsInput = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z,]/g, '')

  const parseTags = (tags: string, today: boolean) => {
    const parsedTags = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)

    if (today && !parsedTags.includes('today')) {
      parsedTags.push('today')
    }

    return parsedTags
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenTaskId(null)
      }
    }

    if (menuOpenTaskId !== null) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpenTaskId])

  const handleAddTaskClick = () => {
    setShowAddForm(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement

    if (name === 'tags') {
      setFormData(prev => ({
        ...prev,
        tags: normalizeTagsInput(value)
      }))
      return
    }

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement

    if (name === 'tags') {
      setEditFormData(prev => ({
        ...prev,
        tags: normalizeTagsInput(value)
      }))
      return
    }

    if (type === 'checkbox') {
      setEditFormData(prev => ({
        ...prev,
        [name]: checked
      }))
      return
    }

    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    if (formData.title.trim()) {
      try {
        const parsedTags = parseTags(formData.tags, formData.today)

        const response = await apiCall('/todo/add', {
          method: 'POST',
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            tags: parsedTags
          })
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Task created:', data)
          setFormData({ title: '', description: '', tags: '', today: false })
          setShowAddForm(false)
          alert('Task created successfully!')
          await onTaskCreated()
        } else {
          alert('Failed to create task')
        }
      } catch (error) {
        console.error('Error creating task:', error)
        alert('An error occurred while creating the task')
      }
    }
  }

  const handleEditSubmit = async () => {
    if (editingTaskId && editFormData.title.trim()) {
      try {
        const response = await apiCall(`/todo/update/${editingTaskId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: editFormData.title,
            description: editFormData.description,
            tags: parseTags(editFormData.tags, editFormData.today)
          })
        })

        if (response.ok) {
          setEditingTaskId(null)
          setEditFormData({ title: '', description: '', tags: '', today: false })
          alert('Task updated successfully!')
          await onTaskCreated()
        } else {
          alert('Failed to update task')
        }
      } catch (error) {
        console.error('Error updating task:', error)
        alert('An error occurred while updating the task')
      }
    }
  }

  const handleDelete = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await apiCall(`/todo/delete/${taskId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          alert('Task deleted successfully!')
          await onTaskCreated()
        } else {
          alert('Failed to delete task')
        }
      } catch (error) {
        console.error('Error deleting task:', error)
        alert('An error occurred while deleting the task')
      }
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

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleFormChange}
                  placeholder="Enter tags separated by commas"
                  className={`w-full px-3 py-2 rounded border-2 transition-colors ${
                    isDarkMode
                      ? 'bg-black border-white text-white placeholder-gray-500 focus:outline-none focus:border-gray-300'
                      : 'bg-white border-black text-black placeholder-gray-400 focus:outline-none focus:border-gray-600'
                  }`}
                />
                <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Example: work, urgent, frontend
                </p>
              </div>

              <div className={`flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                <input
                  type="checkbox"
                  name="today"
                  checked={formData.today}
                  onChange={handleFormChange}
                  id="today-checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="today-checkbox" className="text-sm font-medium">
                  Add today tag
                </label>
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
            <div
              key={task.id}
              className={`relative flex items-start gap-3 p-3 rounded-lg transition-colors ${
                isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-100'
              }`}
              onMouseEnter={() => setHoveredTaskId(task.id)}
              onMouseLeave={() => setHoveredTaskId(null)}
            >
              <div
                onClick={() => handleTaskComplete(task)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                  task.completed
                    ? isDarkMode ? 'bg-white border-white' : 'bg-black border-black'
                    : isDarkMode ? 'border-white hover:bg-gray-800' : 'border-black hover:bg-gray-200'
                }`}
              >
                {task.completed && (
                  <Check size={16} className={isDarkMode ? 'text-black' : 'text-white'} />
                )}
              </div>

              {editingTaskId === task.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    className={`w-full px-2 py-1 rounded border transition-colors ${
                      isDarkMode
                        ? 'bg-black border-white text-white focus:outline-none focus:border-gray-300'
                        : 'bg-white border-black text-black focus:outline-none focus:border-gray-600'
                    }`}
                  />
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows={2}
                    className={`w-full px-2 py-1 rounded border transition-colors resize-none ${
                      isDarkMode
                        ? 'bg-black border-white text-white focus:outline-none focus:border-gray-300'
                      : 'bg-white border-black text-black focus:outline-none focus:border-gray-600'
                    }`}
                  />
                  <input
                    type="text"
                    name="tags"
                    value={editFormData.tags}
                    onChange={handleEditChange}
                    placeholder="Enter tags separated by commas"
                    className={`w-full px-2 py-1 rounded border transition-colors ${
                      isDarkMode
                        ? 'bg-black border-white text-white placeholder-gray-500 focus:outline-none focus:border-gray-300'
                        : 'bg-white border-black text-black placeholder-gray-400 focus:outline-none focus:border-gray-600'
                    }`}
                  />
                  <div className={`flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    <input
                      type="checkbox"
                      name="today"
                      checked={editFormData.today}
                      onChange={handleEditChange}
                      id={`today-edit-checkbox-${task.id}`}
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor={`today-edit-checkbox-${task.id}`} className="text-sm font-medium">
                      Add today tag
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditSubmit}
                      className={`px-3 py-1 rounded transition-colors ${
                        isDarkMode
                          ? 'bg-white text-black hover:bg-gray-200'
                          : 'bg-black text-white hover:bg-gray-900'
                      }`}
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setEditingTaskId(null)}
                      className={`px-3 py-1 rounded transition-colors ${
                        isDarkMode
                          ? 'bg-gray-800 text-white hover:bg-gray-700'
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="min-w-0 flex-1">
                  <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : isDarkMode ? 'text-white' : 'text-black'}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className={`text-xs mt-1 leading-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}
                  {task.tags && task.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {task.tags.map(tag => (
                        <span
                          key={tag.id}
                          className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {hoveredTaskId === task.id && editingTaskId !== task.id && (
                <button 
                  onClick={() => setMenuOpenTaskId(menuOpenTaskId === task.id ? null : task.id)}
                  className={`p-1 rounded transition-colors ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
                >
                  <MoreVertical size={16} className={isDarkMode ? 'text-white' : 'text-black'} />
                </button>
              )}

              {menuOpenTaskId === task.id && (
                <div 
                  ref={menuRef}
                  className={`absolute right-0 mt-1 w-32 rounded-md shadow-lg z-10 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <button
                    onClick={() => {
                      const taskTagNames = (task.tags || []).map(tag => tag.name)
                      setEditingTaskId(task.id)
                      setEditFormData({
                        title: task.title,
                        description: task.description,
                        tags: taskTagNames.filter(tagName => tagName !== 'today').join(', '),
                        today: taskTagNames.includes('today')
                      })
                      setMenuOpenTaskId(null)
                    }}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
                      isDarkMode ? 'text-white hover:bg-gray-700' : 'text-black hover:bg-gray-100'
                    }`}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(task.id)
                      setMenuOpenTaskId(null)
                    }}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${
                      isDarkMode ? 'text-white hover:bg-gray-700' : 'text-red-400 hover:bg-gray-700'
                    }`}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllTasks
