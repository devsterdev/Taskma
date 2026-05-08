import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Check } from 'lucide-react'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  userId: number
  tags?: { id: number; name: string }[]
}

interface TodayPanelProps {
  isDarkMode: boolean
  todayTasks?: Task[]
  completedTasks?: Task[]
  onTaskComplete?: (task: Task) => Promise<void>
}

const TodayPanel: React.FC<TodayPanelProps> = ({
  isDarkMode,
  todayTasks = [],
  completedTasks = [],
  onTaskComplete
}) => {
  const [expandedToday, setExpandedToday] = useState(true)
  const [expandedCompleted, setExpandedCompleted] = useState(false)

  return (
    <div className={`h-full w-full flex flex-col gap-4 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} p-6 overflow-hidden`}>
      {/* TODAY TASKS SECTION */}
      <div className={`flex-1 flex flex-col min-h-0 rounded-2xl border-2 transition-colors ${
        isDarkMode ? 'border-white bg-black' : 'border-black bg-white'
      }`}>
        <button
          type="button"
          onClick={() => setExpandedToday(!expandedToday)}
          className={`w-full flex items-center justify-between gap-2 p-4 border-b-2 transition-colors ${
            isDarkMode ? 'border-white hover:bg-gray-900' : 'border-black hover:bg-gray-100'
          }`}
        >
          <div className="text-left">
            <p className="text-lg font-bold">Today</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {todayTasks.length} task{todayTasks.length === 1 ? '' : 's'}
            </p>
          </div>
          {expandedToday ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>

        {expandedToday && (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 p-4">
            {todayTasks.length === 0 ? (
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No tasks for today
              </p>
            ) : (
              todayTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    isDarkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <button
                    onClick={() => onTaskComplete?.(task)}
                    className={`mt-1 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? isDarkMode ? 'bg-white border-white' : 'bg-black border-black'
                        : isDarkMode ? 'border-white hover:bg-gray-700' : 'border-black hover:bg-gray-200'
                    }`}
                  >
                    {task.completed && (
                      <Check size={14} className={isDarkMode ? 'text-black' : 'text-white'} />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* COMPLETED TASKS SECTION */}
      <div className={`flex-1 flex flex-col min-h-0 rounded-2xl border-2 transition-colors ${
        isDarkMode ? 'border-white bg-black' : 'border-black bg-white'
      }`}>
        <button
          type="button"
          onClick={() => setExpandedCompleted(!expandedCompleted)}
          className={`w-full flex items-center justify-between gap-2 p-4 border-b-2 transition-colors ${
            isDarkMode ? 'border-white hover:bg-gray-900' : 'border-black hover:bg-gray-100'
          }`}
        >
          <div className="text-left">
            <p className="text-lg font-bold">Completed</p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {completedTasks.length} task{completedTasks.length === 1 ? '' : 's'}
            </p>
          </div>
          {expandedCompleted ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>

        {expandedCompleted && (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 p-4">
            {completedTasks.length === 0 ? (
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No completed tasks yet.
              </p>
            ) : (
              completedTasks.map(task => (
                <div
                  key={task.id}
                  className={`rounded-lg p-3 transition-colors ${
                    isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
                  }`}
                >
                  <p className={`text-sm font-medium line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {task.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TodayPanel
