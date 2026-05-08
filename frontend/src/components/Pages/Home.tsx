import { useState, useEffect } from 'react'
import Navbar from '../Navbar'
import TagSidebar from '../TagSidebar'
import AllTasks from '../AllTasks'
import TodayPanel from '../TodayPanel'
import { apiCall } from '../../utils/api'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  userId: number
  tags?: { id: number; name: string }[]
}

const Home = ({ onLogout }: { onLogout: () => void }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [uniqueTags, setUniqueTags] = useState<string[]>(['today'])
  const [tagFilters, setTagFilters] = useState<Record<string, boolean>>({ today: true })
  const [isDarkMode, setIsDarkMode] = useState(false)

  const selectedTag = Object.values(tagFilters).every(Boolean) ? 'All tasks' : 'Filtered tasks'

  const fetchTasks = async () => {
    try {
      const response = await apiCall('/todo/read', {
        method: 'GET',
      })

      if (response.status === 401) {
        onLogout()
        return
      }

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        const todos: Task[] = data.todos || data
        setTasks(todos)

        const tagsFromTodos = todos.flatMap(todo =>
          (todo.tags || []).map(tag => tag.name)
        )

        const updatedTags = Array.from(new Set(['today', ...tagsFromTodos]))
        setUniqueTags(updatedTags)

        setTagFilters(prev => {
          const nextFilters: Record<string, boolean> = {}
          updatedTags.forEach(tag => {
            nextFilters[tag] = prev[tag] ?? true
          })
          return nextFilters
        })
      } else {
        console.error('Failed to fetch tasks:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleToggleTag = (tag: string) => {
    setTagFilters(prev => ({
      ...prev,
      [tag]: !prev[tag]
    }))
  }

  const handleTaskComplete = async (task: Task) => {
    try {
      const response = await apiCall(`/todo/update/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !task.completed })
      })

      if (response.status === 401) {
        onLogout()
        return
      }

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

  const allTasks = tasks.filter(task => {
    const taskTags = (task.tags || []).map(tag => tag.name)
    if (taskTags.length === 0) {
      return true
    }

    return taskTags.some(tagName => tagFilters[tagName])
  })

  const todayTasks = tasks.filter(task => {
    const taskTags = (task.tags || []).map(tag => tag.name)
    return taskTags.includes('today') && !task.completed
  })

  const completedTasks = tasks.filter(task => task.completed)

  const tagCounts = uniqueTags.reduce((acc, tag) => {
    acc[tag] = tasks.filter(task => {
      const taskTags = (task.tags || []).map(t => t.name)
      return taskTags.includes(tag)
    }).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* NAVBAR */}
      <Navbar isDarkMode={isDarkMode} onThemeToggle={setIsDarkMode} onLogout={onLogout} />

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - TAGS */}
        <TagSidebar
          tags={uniqueTags}
          tagFilters={tagFilters}
          tagCounts={tagCounts}
          onToggleTag={handleToggleTag}
          isDarkMode={isDarkMode}
        />

        {/* MIDDLE SECTION - ALL TASKS */}
        <AllTasks 
          selectedTag={selectedTag}
          allTasks={allTasks}
          isDarkMode={isDarkMode}
          handleTaskComplete={handleTaskComplete}
          onTaskCreated={fetchTasks}
        />

        <div className="w-96 min-h-0 flex flex-col overflow-hidden rounded-3xl border border-dashed border-slate-400/10">
          <TodayPanel
            isDarkMode={isDarkMode}
            todayTasks={todayTasks}
            completedTasks={completedTasks}
            onTaskComplete={handleTaskComplete}
          />
        </div>
      </div>
    </div>
  )
}

export default Home