import React, { useState, useEffect } from 'react'
import { Check, Plus, Star } from 'lucide-react'
import Navbar from '../Navbar'
import AllTasks from '../AllTasks'
import { apiCall } from '../../utils/api'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  userId: number
}

const Home = ({ onLogout }: { onLogout: () => void }) => {
  const [tasks, setTasks] = useState<Task[]>([])

  const [selectedTag, setSelectedTag] = useState('All tasks')
  const [completedTasks, setCompletedTasks] = useState<number[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const response = await apiCall('/todo/read', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();

        console.log(data);

        setTasks(data.todos); // FIX
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  fetchTasks();
}, []);

  const tags = ['All tasks', 'Starred', 'My Tasks']

  const handleTaskComplete = (id: number) => {
    if (completedTasks.includes(id)) {
      setCompletedTasks(completedTasks.filter(taskId => taskId !== id))
    } else {
      setCompletedTasks([...completedTasks, id])
    }
  }

  const allTasks = (tasks || []).filter(task => {
    if (selectedTag === 'All tasks') return true
    if (selectedTag === 'My Tasks') return !task.completed
    if (selectedTag === 'Starred') return false // Add starred feature later
    return true
  })

  const completedTasksList = (tasks || []).filter(task => task.completed)
  const completedCount = completedTasksList.length

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* NAVBAR */}
      <Navbar isDarkMode={isDarkMode} onThemeToggle={setIsDarkMode} onLogout={onLogout} />

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - TAGS */}
        <div className={`w-64 ${isDarkMode ? 'bg-black border-white' : 'bg-white border-black'} border-r p-6 overflow-y-auto`}>
          <button className={`w-full ${isDarkMode ? 'bg-white text-black hover:bg-gray-300' : 'bg-black hover:bg-gray-900 text-white'} py-2 px-4 rounded-lg mb-8 flex items-center justify-center gap-2`}>
            <Plus size={20} />
            Create
          </button>

          <div className="space-y-3">
            <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-black'} mb-4`}>TAGS</div>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                  selectedTag === tag
                    ? isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
                    : isDarkMode ? 'hover:bg-gray-900 text-white' : 'hover:bg-gray-100 text-black'
                }`}
              >
                {tag === 'Starred' ? (
                  <Star size={18} />
                ) : (
                  <div className={`w-4 h-4 rounded border-2 ${isDarkMode ? 'border-white' : 'border-black'}`} />
                )}
                <span>{tag}</span>
                {tag === 'My Tasks' && <span className={`ml-auto ${isDarkMode ? 'text-white' : 'text-black'}`}>36</span>}
              </button>
            ))}
          </div>

          <button className={`w-full mt-6 text-left px-4 py-2 flex items-center gap-2 transition-colors ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'}`}>
            <Plus size={18} />
            Create new list
          </button>
        </div>

        {/* MIDDLE SECTION - ALL TASKS */}
        <AllTasks 
          selectedTag={selectedTag}
          allTasks={allTasks}
          isDarkMode={isDarkMode}
          completedTasks={completedTasks}
          handleTaskComplete={handleTaskComplete}
        />

        {/* RIGHT SECTION - COMPLETED TASKS */}
        <div className={`w-96 ${isDarkMode ? 'bg-black border-white' : 'bg-white border-black'} border-l p-8 overflow-y-auto flex flex-col`}>
          <h2 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-black'}`}>Completed</h2>

          <button className={`mb-6 flex items-center gap-2 transition-colors ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'}`}>
            <Plus size={20} />
            Add a task
          </button>

          {completedTasksList.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>No completed tasks</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Get started by completing a task!</p>
            </div>
          ) : (
            <div>
              <div className="space-y-2 mb-6">
                {completedTasksList.map(task => (
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
                    <span
                      className={`text-sm ${
                        completedTasks.includes(task.id) ? 'line-through text-gray-500' : isDarkMode ? 'text-white' : 'text-black'
                      }`}
                    >
                      {task.title}
                    </span>
                  </label>
                ))}
              </div>

              <div className={`border-t ${isDarkMode ? 'border-white' : 'border-black'} pt-4`}>
                <button className={`text-sm transition-colors ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'}`}>
                  Completed ({completedCount})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home