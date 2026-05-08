import React, { useState } from 'react'
import { Check, CheckCircle2, ChevronDown, ChevronRight, Plus, X } from 'lucide-react'
import { apiCall } from '../utils/api'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  userId: number
  createdAt?: string
  updatedAt?: string
  tags?: { id: number; name: string }[]
}

interface TodayPanelProps {
  isDarkMode: boolean
  todayTasks?: Task[]
  completedTasks?: Task[]
  onTaskComplete?: (task: Task) => Promise<void>
  onTaskCreated?: () => Promise<void>
}

const TodayPanel: React.FC<TodayPanelProps> = ({
  isDarkMode,
  todayTasks = [],
  completedTasks = [],
  onTaskComplete,
  onTaskCreated
}) => {
  const [expandedCompleted, setExpandedCompleted] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '' })

  const panelClass = isDarkMode
    ? 'border-zinc-700 bg-[#121212] text-zinc-100'
    : 'border-zinc-300 bg-white text-zinc-950'
  const mutedClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
  const inputClass = `w-full rounded-md border px-3 py-2 text-sm transition-colors ${
    isDarkMode
      ? 'border-zinc-700 bg-[#121212] text-zinc-100 placeholder-zinc-500 focus:border-zinc-400 focus:outline-none'
      : 'border-zinc-300 bg-white text-zinc-950 placeholder-zinc-400 focus:border-zinc-700 focus:outline-none'
  }`

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

  const handleAddTodayTask = async () => {
    if (!newTask.title.trim()) {
      return
    }

    try {
      const response = await apiCall('/todo/add', {
        method: 'POST',
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          tags: ['today']
        })
      })

      if (response.ok) {
        setNewTask({ title: '', description: '' })
        setShowAddForm(false)
        await onTaskCreated?.()
      } else {
        alert('Failed to create task')
      }
    } catch (error) {
      console.error('Error creating task:', error)
      alert('An error occurred while creating the task')
    }
  }

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-2xl border ${panelClass}`}>
      <div className={`absolute left-1/2 top-1 h-1 w-9 -translate-x-1/2 rounded-full ${isDarkMode ? 'bg-zinc-600' : 'bg-zinc-300'}`} />

      <div className="flex h-full flex-col px-4 py-4">
        <header className="mb-5">
          <h2 className="text-xl font-normal">Today</h2>
        </header>

        <button
          type="button"
          onClick={() => setShowAddForm(true)}
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
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isDarkMode ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddTodayTask}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isDarkMode ? 'bg-zinc-100 text-zinc-950 hover:bg-white' : 'bg-zinc-950 text-white hover:bg-zinc-800'
                  }`}
                >
                  Add
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
                    <p className="text-sm leading-5">{task.title}</p>
                    {task.description && (
                      <p className={`text-xs leading-4 ${mutedClass}`}>{task.description}</p>
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
