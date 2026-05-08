import React, { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  userId: number
  tags?: { id: number; name: string }[]
}

interface CompletedTasksProps {
  isDarkMode: boolean
  completedTasksList: Task[]
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({ isDarkMode, completedTasksList }) => {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <div className={`h-full w-full ${isDarkMode ? 'bg-black border-white' : 'bg-white border-black'} p-6 flex flex-col`}>
      <button
        type="button"
        onClick={toggleExpanded}
        className={`w-full flex items-center justify-between gap-2 p-4 rounded-lg border-2 transition-colors ${
          isDarkMode ? 'border-white bg-black text-white hover:bg-gray-900' : 'border-black bg-white text-black hover:bg-gray-100'
        }`}
      >
        <div className="text-left">
          <p className="text-xl font-bold">Completed</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {completedTasksList.length} task{completedTasksList.length === 1 ? '' : 's'} completed
          </p>
        </div>
        {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>

      {expanded && (
        <div className="mt-4 flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
          {completedTasksList.length === 0 ? (
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No completed tasks yet.</div>
          ) : (
            completedTasksList.map(task => (
              <div
                key={task.id}
                className={`rounded-lg p-3 border transition-colors ${
                  isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'
                }`}
              >
                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {task.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default CompletedTasks
