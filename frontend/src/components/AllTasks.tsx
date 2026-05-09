import React, { useState, useEffect, useRef } from 'react'
import { Check, Edit, MoreVertical, Plus, Trash2, X } from 'lucide-react'
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
  onTaskCreateStart: (task: Task) => void
  onTaskCreateSuccess: (temporaryTaskId: number, savedTask: Task) => void
  onTaskCreateFailure: (temporaryTaskId: number) => void
}

export interface AllTasksHandle {
  openCreateForm: () => void
}

const AllTasks = React.forwardRef<AllTasksHandle, AllTasksProps>(({
  selectedTag,
  allTasks,
  isDarkMode,
  handleTaskComplete,
  onTaskCreated,
  onTaskCreateStart,
  onTaskCreateSuccess,
  onTaskCreateFailure,
}, ref) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', tags: '', today: false })
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState({ title: '', description: '', tags: '', today: false })
  const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null)
  const [menuOpenTaskId, setMenuOpenTaskId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)

  const title = selectedTag === 'All tasks' ? 'My Tasks' : selectedTag
  const pageClass = isDarkMode
    ? 'bg-[#121212] text-zinc-100 border-zinc-950'
    : 'bg-white text-zinc-950 border-zinc-200'
  const mutedClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
  const inputClass = `w-full rounded-md border px-3 py-2 text-sm transition-colors ${
    isDarkMode
      ? 'border-zinc-700 bg-[#121212] text-zinc-100 placeholder-zinc-500 focus:border-zinc-400 focus:outline-none'
      : 'border-zinc-300 bg-white text-zinc-950 placeholder-zinc-400 focus:border-zinc-700 focus:outline-none'
  }`
  const secondaryButtonClass = `rounded-md px-3 py-1.5 text-sm transition-colors ${
    isDarkMode ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
  }`
  const primaryButtonClass = `rounded-md px-3 py-1.5 text-sm transition-colors ${
    isDarkMode ? 'bg-zinc-100 text-zinc-950 hover:bg-white' : 'bg-zinc-950 text-white hover:bg-zinc-800'
  }`

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
    setEditingTaskId(null)
    setShowAddForm(true)
  }

  React.useImperativeHandle(ref, () => ({
    openCreateForm: handleAddTaskClick
  }))

  const sortedTasks = React.useMemo(
    () => [...allTasks].sort((a, b) => Number(a.completed) - Number(b.completed)),
    [allTasks]
  )

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
    if (formData.title.trim() && !isCreating) {
      const parsedTags = parseTags(formData.tags, formData.today)
      const temporaryTaskId = -Date.now()
      const optimisticTask: Task = {
        id: temporaryTaskId,
        title: formData.title.trim(),
        description: formData.description,
        completed: false,
        userId: 0,
        tags: parsedTags.map((tag, index) => ({
          id: temporaryTaskId - index - 1,
          name: tag
        }))
      }

      onTaskCreateStart(optimisticTask)
      setFormData({ title: '', description: '', tags: '', today: false })
      setShowAddForm(false)
      setIsCreating(true)

      try {
        const response = await apiCall('/todo/add', {
          method: 'POST',
          body: JSON.stringify({
            title: optimisticTask.title,
            description: optimisticTask.description,
            tags: parsedTags
          })
        })

        if (response.ok) {
          const data = await response.json()
          onTaskCreateSuccess(temporaryTaskId, data.todo || data)
        } else {
          console.error('Failed to create task')
          onTaskCreateFailure(temporaryTaskId)
        }
      } catch (error) {
        console.error('Error creating task:', error)
        onTaskCreateFailure(temporaryTaskId)
      } finally {
        setIsCreating(false)
      }
    }
  }

  const handleEditSubmit = async () => {
    if (editingTaskId && editFormData.title.trim() && !isUpdating) {
      setIsUpdating(true)
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
          await onTaskCreated()
        } else {
          console.error('Failed to update task')
        }
      } catch (error) {
        console.error('Error updating task:', error)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const handleDelete = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setDeletingTaskId(taskId)
      try {
        const response = await apiCall(`/todo/delete/${taskId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await onTaskCreated()
        } else {
          console.error('Failed to delete task')
        }
      } catch (error) {
        console.error('Error deleting task:', error)
      } finally {
        setDeletingTaskId(null)
        setMenuOpenTaskId(null)
      }
    }
  }

  const startEditing = (task: Task) => {
    const taskTagNames = (task.tags || []).map(tag => tag.name)
    setEditingTaskId(task.id)
    setEditFormData({
      title: task.title,
      description: task.description,
      tags: taskTagNames.filter(tagName => tagName !== 'today').join(', '),
      today: taskTagNames.includes('today')
    })
    setMenuOpenTaskId(null)
  }

  return (
    <div className={`flex-1 overflow-y-auto border-r px-5 py-5 ${pageClass}`}>
      <div className="mb-5">
        <h2 className="text-lg font-normal">{title}</h2>
      </div>

      <button
        type="button"
        onClick={handleAddTaskClick}
        className={`mb-4 flex items-center gap-4 text-sm transition-colors ${
          isDarkMode ? 'text-blue-200 hover:text-white' : 'text-zinc-700 hover:text-black'
        }`}
      >
        <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border ${
          isDarkMode ? 'border-blue-200 text-blue-200' : 'border-zinc-700 text-zinc-700'
        }`}>
          <Plus size={13} />
        </span>
        Add a task
      </button>

      {showAddForm && (
        <div className={`mb-5 rounded-lg border p-4 ${isDarkMode ? 'border-zinc-700 bg-[#161616]' : 'border-zinc-300 bg-zinc-50'}`}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium">New task</h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className={`rounded-md p-1 transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-200'}`}
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="Task title"
              className={inputClass}
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Optional note"
              rows={2}
              className={`${inputClass} resize-none`}
            />
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleFormChange}
              placeholder="Tags separated by commas"
              className={inputClass}
            />
            <label className={`flex items-center gap-2 text-sm ${mutedClass}`}>
              <input
                type="checkbox"
                name="today"
                checked={formData.today}
                onChange={handleFormChange}
                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
              />
              Today
            </label>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowAddForm(false)} className={secondaryButtonClass}>
                Cancel
              </button>
              <button type="button" onClick={handleSubmit} disabled={isCreating} className={`${primaryButtonClass} disabled:cursor-not-allowed disabled:opacity-70`}>
                {isCreating ? 'Creating...' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {sortedTasks.length === 0 ? (
          <p className={`py-8 text-sm ${mutedClass}`}>No tasks yet</p>
        ) : (
          sortedTasks.map(task => (
            <div
              key={task.id}
              className={`group relative flex items-start gap-4 rounded-md py-2 pr-9 transition-colors ${
                isDarkMode ? 'hover:bg-[#181818]' : 'hover:bg-zinc-50'
              }`}
              onMouseEnter={() => setHoveredTaskId(task.id)}
              onMouseLeave={() => setHoveredTaskId(null)}
            >
              <button
                type="button"
                onClick={() => handleTaskComplete(task)}
                className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  task.completed
                    ? isDarkMode ? 'border-zinc-100 bg-zinc-100 text-black' : 'border-black bg-black text-white'
                    : isDarkMode ? 'border-zinc-300 hover:border-white' : 'border-zinc-700 hover:border-black'
                }`}
                aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
              >
                {task.completed && <Check size={12} />}
              </button>

              {editingTaskId === task.id ? (
                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    className={inputClass}
                  />
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                  <input
                    type="text"
                    name="tags"
                    value={editFormData.tags}
                    onChange={handleEditChange}
                    placeholder="Tags separated by commas"
                    className={inputClass}
                  />
                  <label className={`flex items-center gap-2 text-sm ${mutedClass}`}>
                    <input
                      type="checkbox"
                      name="today"
                      checked={editFormData.today}
                      onChange={handleEditChange}
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    Today
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleEditSubmit} disabled={isUpdating} className={`${primaryButtonClass} disabled:cursor-not-allowed disabled:opacity-70`}>
                      {isUpdating ? 'Saving...' : 'Submit'}
                    </button>
                    <button type="button" onClick={() => setEditingTaskId(null)} disabled={isUpdating} className={`${secondaryButtonClass} disabled:cursor-not-allowed disabled:opacity-70`}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="min-w-0 flex-1">
                  <p className={`text-sm leading-5 ${
                    task.completed ? 'text-zinc-500 line-through' : isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
                  }`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className={`text-xs leading-4 ${mutedClass}`}>
                      {task.description}
                    </p>
                  )}
                  {task.tags && task.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {task.tags.map(tag => (
                        <span
                          key={tag.id}
                          className={`text-[11px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {hoveredTaskId === task.id && editingTaskId !== task.id && (
                <button
                  type="button"
                  onClick={() => setMenuOpenTaskId(menuOpenTaskId === task.id ? null : task.id)}
                  className={`absolute right-1 top-1 rounded-md p-1 transition-colors ${
                    isDarkMode ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'
                  }`}
                  aria-label="Task options"
                >
                  <MoreVertical size={16} />
                </button>
              )}

              {menuOpenTaskId === task.id && (
                <div
                  ref={menuRef}
                  className={`absolute right-1 top-8 z-10 w-32 rounded-md border shadow-lg ${
                    isDarkMode ? 'border-zinc-700 bg-[#191919]' : 'border-zinc-200 bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => startEditing(task)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
                      isDarkMode ? 'text-white hover:bg-zinc-800' : 'text-black hover:bg-zinc-100'
                    }`}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(task.id)}
                    disabled={deletingTaskId === task.id}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
                      isDarkMode ? 'text-red-300 hover:bg-zinc-800' : 'text-red-600 hover:bg-red-50'
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    <Trash2 size={14} />
                    {deletingTaskId === task.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
})

export default AllTasks
