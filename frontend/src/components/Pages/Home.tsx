import React, { useState, useEffect } from 'react'
import { Check, Plus, Star } from 'lucide-react'
import Navbar from '../Navbar'
import AllTasks from '../AllTasks'
import CompletedTasks from '../CompletedTasks'
import TodayPanel from '../TodayPanel'
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
  const [isDarkMode, setIsDarkMode] = useState(false)

  const fetchTasks = async () => {
    try {
      const response = await apiCall('/todo/read', {
        method: 'GET',
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setTasks(data.todos || data)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const tags = ['All tasks', 'Starred', 'My Tasks']

  const handleTaskComplete = async (task: Task) => {
    try {
      const response = await apiCall(`/todo/update/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !task.completed })
      })

      if (response.ok) {
        await fetchTasks()
      } else {
        alert('Failed to update task status')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      alert('An error occurred while updating the task')
    }
  }

  const allTasks = (tasks || []).filter(task => {
    if (selectedTag === 'All tasks') return true
    if (selectedTag === 'My Tasks') return !task.completed
    if (selectedTag === 'Starred') return false // Add starred feature later
    return true
  })


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
          handleTaskComplete={handleTaskComplete}
          onTaskCreated={fetchTasks}
        />

        <div className="w-96 min-h-0 flex flex-col gap-6">
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-3xl border border-dashed border-slate-400/10">
            <TodayPanel isDarkMode={isDarkMode} />
          </div>
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden rounded-3xl border border-dashed border-slate-400/10">
            <CompletedTasks isDarkMode={isDarkMode} completedTasksList={tasks.filter(task => task.completed)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home