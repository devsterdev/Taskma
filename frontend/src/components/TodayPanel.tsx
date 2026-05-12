import React, { useState } from 'react'
import { Calendar, Check, CheckCircle2, ChevronDown, ChevronRight, Plus, X } from 'lucide-react'
import { apiCall } from '../utils/api'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  userId: number
  dueDate?: string | null
  createdAt?: string
  updatedAt?: string
  tags?: { id: number; name: string }[]
}

interface TodayPanelProps {
  isDarkMode: boolean
  todayTasks?: Task[]
  completedTasks?: Task[]
  onTaskComplete?: (task: Task) => Promise<void>
  onTaskCreateStart?: (task: Task) => void
  onTaskCreateSuccess?: (temporaryTaskId: number, savedTask: Task) => void
  onTaskCreateFailure?: (temporaryTaskId: number) => void
}

const TodayPanel: React.FC<TodayPanelProps> = ({
  isDarkMode,
  todayTasks = [],
  completedTasks = [],
  onTaskComplete,
  onTaskCreateStart,
  onTaskCreateSuccess,
  onTaskCreateFailure
}) => {
  const [expandedCompleted, setExpandedCompleted] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' })
  const [isCreating, setIsCreating] = useState(false)

  const panelClass = isDarkMode
    ? 'border-zinc-950 bg-[#121212] text-zinc-100'
    : 'border-zinc-200 bg-white text-zinc-950'
  const mutedClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
  const inputClass = `w-full rounded-md border px-3 py-2 text-sm transition-colors ${
    isDarkMode
      ? 'border-zinc-700 bg-[#121212] text-zinc-100 placeholder-zinc-500 focus:border-zinc-400 focus:outline-none'
      : 'border-zinc-300 bg-white text-zinc-950 placeholder-zinc-400 focus:border-zinc-700 focus:outline-none'
  }`
  const dateIconInputClass = `h-10 w-10 cursor-pointer rounded-md border text-transparent transition-colors [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 ${
    isDarkMode
      ? 'border-zinc-700 bg-[#121212] focus:border-zinc-400 focus:outline-none'
      : 'border-zinc-300 bg-white focus:border-zinc-700 focus:outline-none'
  }`
  const dateIconClass = isDarkMode ? 'text-zinc-300' : 'text-zinc-700'

  const formatCompletedDate = (task: Task) => {
    const dateValue = task.updatedAt || task.createdAt
    if (!dateValue) {
      return 'Completed'
    }

    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) {
      return 'Completed'
    }

    return `Completed: ${new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date)}`
  }

  const getTodayDateInputValue = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const formatDueDate = (value?: string | null) => {
    if (!value) {
      return ''
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return ''
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const isTaskOverdue = (task: Task) => {
    if (!task.dueDate || task.completed) {
      return false
    }

    const dueDate = new Date(task.dueDate)
    if (Number.isNaN(dueDate.getTime())) {
      return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)

    return dueDate < today
  }

  const handleAddTodayTask = async () => {
    if (!newTask.title.trim() || isCreating) {
      return
    }

    const dueDate = newTask.dueDate || getTodayDateInputValue()
    const temporaryTaskId = -Date.now()
    const optimisticTask: Task = {
      id: temporaryTaskId,
      title: newTask.title.trim(),
      description: newTask.description,
      dueDate,
      completed: false,
      userId: 0,
      tags: [{ id: temporaryTaskId - 1, name: 'today' }]
    }

    onTaskCreateStart?.(optimisticTask)
    setNewTask({ title: '', description: '', dueDate: '' })
    setShowAddForm(false)
    setIsCreating(true)

    try {
      const response = await apiCall('/todo/add', {
        method: 'POST',
        body: JSON.stringify({
          title: optimisticTask.title,
          description: optimisticTask.description,
          dueDate: optimisticTask.dueDate,
          tags: ['today']
        })
      })

      if (response.ok) {
        const data = await response.json()
        onTaskCreateSuccess?.(temporaryTaskId, data.todo || data)
      } else {
        console.error('Failed to create task')
        onTaskCreateFailure?.(temporaryTaskId)
      }
    } catch (error) {
      console.error('Error creating task:', error)
      onTaskCreateFailure?.(temporaryTaskId)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className={`h-full w-full overflow-hidden border ${panelClass}`}>
      <div className="flex h-full flex-col px-4 py-4">
        <header className="mb-5">
          <h2 className="text-xl font-normal">Today</h2>
        </header>

        <button
          type="button"
          onClick={() => {
            setNewTask(prev => ({ ...prev, dueDate: prev.dueDate || getTodayDateInputValue() }))
            setShowAddForm(true)
          }}
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
          <div className={`mb-4 rounded-lg border p-3 ${isDarkMode ? 'border-zinc-700 bg-[#161616]' : 'border-zinc-300 bg-zinc-50'}`}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">New today task</p>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className={`rounded-md p-1 transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-200'}`}
                aria-label="Close add task form"
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={newTask.title}
                onChange={event => setNewTask(prev => ({ ...prev, title: event.target.value }))}
                placeholder="Task title"
                className={inputClass}
              />
              <textarea
                value={newTask.description}
                onChange={event => setNewTask(prev => ({ ...prev, description: event.target.value }))}
                placeholder="Optional note"
                rows={2}
                className={`${inputClass} resize-none`}
              />
              <div className="flex items-center gap-3">
                <label className="flex shrink-0 items-center gap-2 text-sm" title="Choose due date">
                  <span className="relative flex h-10 w-10 items-center justify-center">
                    <Calendar size={17} className={`pointer-events-none absolute ${dateIconClass}`} />
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={event => setNewTask(prev => ({ ...prev, dueDate: event.target.value }))}
                      className={dateIconInputClass}
                      aria-label="Choose due date"
                    />
                  </span>
                  <span className={mutedClass}>Due date</span>
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  disabled={isCreating}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isDarkMode ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                  } disabled:cursor-not-allowed disabled:opacity-70`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddTodayTask}
                  disabled={isCreating}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isDarkMode ? 'bg-zinc-100 text-zinc-950 hover:bg-white' : 'bg-zinc-950 text-white hover:bg-zinc-800'
                  } disabled:cursor-not-allowed disabled:opacity-70`}
                >
                  {isCreating ? 'Creating...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="h-[42%] min-h-[220px] shrink-0 overflow-y-auto">
          {todayTasks.length === 0 ? (
            <div className="flex h-full min-h-[230px] flex-col items-center justify-center text-center">
              <div className="relative mb-5 h-24 w-24">
                <div className={`absolute left-4 top-7 h-12 w-12 rounded-full ${isDarkMode ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-950 text-white'}`}>
                  <CheckCircle2 className="absolute left-2 top-2" size={30} />
                </div>
                <div className={`absolute bottom-3 right-4 h-16 w-9 skew-x-[-10deg] rounded-t-full border-4 ${
                  isDarkMode ? 'border-blue-200' : 'border-zinc-700'
                }`} />
                <div className={`absolute bottom-1 left-8 h-2 w-11 rounded-full ${isDarkMode ? 'bg-zinc-300' : 'bg-zinc-800'}`} />
                <div className={`absolute right-5 top-5 h-3 w-3 rounded-full ${isDarkMode ? 'bg-zinc-400' : 'bg-zinc-500'}`} />
                <div className={`absolute left-2 top-14 h-3 w-3 rounded-sm ${isDarkMode ? 'bg-zinc-300' : 'bg-zinc-800'}`} />
              </div>
              <p className="text-lg font-normal">All tasks complete</p>
              <p className={`mt-4 text-sm ${mutedClass}`}>Nice work!</p>
            </div>
          ) : (
            <div className="space-y-1 pb-4">
              {todayTasks.map(task => (
                <div key={task.id} className={`flex items-start gap-4 rounded-md py-2 transition-colors ${
                  isDarkMode ? 'hover:bg-[#181818]' : 'hover:bg-zinc-50'
                }`}>
                  <button
                    type="button"
                    onClick={() => onTaskComplete?.(task)}
                    className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      isDarkMode ? 'border-zinc-300 hover:border-white' : 'border-zinc-700 hover:border-black'
                    }`}
                    aria-label="Mark task complete"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm leading-5 ${
                      isTaskOverdue(task) ? isDarkMode ? 'text-red-300' : 'text-red-600' : ''
                    }`}>{task.title}</p>
                    {task.description && (
                      <p className={`text-xs leading-4 ${mutedClass}`}>{task.description}</p>
                    )}
                    {task.dueDate && (
                      <p className={`mt-1 text-xs ${
                        isTaskOverdue(task) ? isDarkMode ? 'text-red-300' : 'text-red-600' : mutedClass
                      }`}>
                        Due: {formatDueDate(task.dueDate)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <section className="shrink-0 pt-3">
          <button
            type="button"
            onClick={() => setExpandedCompleted(!expandedCompleted)}
            className={`flex w-full items-center gap-3 py-2 text-left text-sm transition-colors ${
              isDarkMode ? 'hover:text-white' : 'hover:text-black'
            }`}
          >
            {expandedCompleted ? <ChevronDown size={17} className={mutedClass} /> : <ChevronRight size={17} className={mutedClass} />}
            <span>Completed ({completedTasks.length})</span>
          </button>

          {expandedCompleted && (
            <div className="max-h-40 overflow-y-auto pb-1">
              {completedTasks.length === 0 ? (
                <p className={`py-2 pl-7 text-sm ${mutedClass}`}>No completed tasks yet.</p>
              ) : (
                completedTasks.map(task => (
                  <div key={task.id} className="flex items-start gap-4 py-2">
                    <Check size={18} className={isDarkMode ? 'text-blue-200' : 'text-zinc-700'} />
                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-sm line-through ${isDarkMode ? 'text-zinc-300' : 'text-zinc-800'}`}>
                        {task.title}
                      </p>
                      <p className={`text-xs ${mutedClass}`}>{formatCompletedDate(task)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default TodayPanel
