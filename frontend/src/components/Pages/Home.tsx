import { useState, useEffect, useRef } from 'react'
import Navbar from '../Navbar'
import TagSidebar from '../TagSidebar'
import AllTasks, { type AllTasksHandle } from '../AllTasks'
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

interface CurrentUser {
  name: string
  email: string
}

const THEME_STORAGE_KEY = 'taskma-theme'

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)

  if (savedTheme === 'dark') {
    return true
  }

  if (savedTheme === 'light') {
    return false
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const Home = ({
  onLogout,
  isLoggingOut,
  currentUser
}: {
  onLogout: () => void | Promise<void>
  isLoggingOut?: boolean
  currentUser: CurrentUser | null
}) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [uniqueTags, setUniqueTags] = useState<string[]>(['today'])
  const [tagFilters, setTagFilters] = useState<Record<string, boolean>>({ today: true })
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme)
  const allTasksRef = useRef<AllTasksHandle>(null)

  const allTagsSelected = Object.values(tagFilters).every(Boolean)
  const selectedTags = Object.entries(tagFilters)
    .filter(([, isSelected]) => isSelected)
    .map(([tag]) => tag)
  const selectedTag = allTagsSelected
    ? 'All tasks'
    : selectedTags.length === 1
      ? selectedTags[0][0].toUpperCase() + selectedTags[0].slice(1)
      : 'Filtered tasks'

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

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const handleToggleTag = (tag: string) => {
    setTagFilters(prev => ({
      ...prev,
      [tag]: !prev[tag]
    }))
  }

  const handleShowAllTags = () => {
    setTagFilters(prev => {
      const nextFilters: Record<string, boolean> = {}
      Object.keys(prev).forEach(tag => {
        nextFilters[tag] = true
      })
      return nextFilters
    })
  }

  const addTaskToView = (task: Task) => {
    setTasks(prevTasks => [task, ...prevTasks])

    const taskTags = (task.tags || []).map(tag => tag.name)
    if (taskTags.length > 0) {
      setUniqueTags(prevTags => Array.from(new Set([...prevTags, ...taskTags])))
      setTagFilters(prevFilters => {
        const nextFilters = { ...prevFilters }
        taskTags.forEach(tag => {
          nextFilters[tag] = prevFilters[tag] ?? true
        })
        return nextFilters
      })
    }
  }

  const replaceTaskInView = (temporaryTaskId: number, savedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === temporaryTaskId ? savedTask : task))
    )

    const taskTags = (savedTask.tags || []).map(tag => tag.name)
    if (taskTags.length > 0) {
      setUniqueTags(prevTags => Array.from(new Set([...prevTags, ...taskTags])))
    }
  }

  const removeTaskFromView = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
  }

  const handleTaskComplete = async (task: Task) => {
    const nextCompleted = !task.completed

    setTasks(prevTasks =>
      prevTasks.map(prevTask =>
        prevTask.id === task.id ? { ...prevTask, completed: nextCompleted } : prevTask
      )
    )

    try {
      const response = await apiCall(`/todo/update/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: nextCompleted })
      })

      if (response.status === 401) {
        setTasks(prevTasks =>
          prevTasks.map(prevTask =>
            prevTask.id === task.id ? { ...prevTask, completed: task.completed } : prevTask
          )
        )
        onLogout()
        return
      }

      if (!response.ok) {
        console.error('Failed to update task status')
        setTasks(prevTasks =>
          prevTasks.map(prevTask =>
            prevTask.id === task.id ? { ...prevTask, completed: task.completed } : prevTask
          )
        )
      }
    } catch (error) {
      console.error('Error updating task:', error)
      setTasks(prevTasks =>
        prevTasks.map(prevTask =>
          prevTask.id === task.id ? { ...prevTask, completed: task.completed } : prevTask
        )
      )
    }
  }

  const allTasks = tasks.filter(task => {
    const taskTags = (task.tags || []).map(tag => tag.name)
    if (taskTags.length === 0) {
      return allTagsSelected
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
      <Navbar
        isDarkMode={isDarkMode}
        onThemeToggle={setIsDarkMode}
        onLogout={onLogout}
        isLoggingOut={isLoggingOut}
        currentUser={currentUser}
      />

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - TAGS */}
        <TagSidebar
          tags={uniqueTags}
          tagFilters={tagFilters}
          tagCounts={tagCounts}
          onToggleTag={handleToggleTag}
          onShowAll={handleShowAllTags}
          isDarkMode={isDarkMode}
          onCreate={() => allTasksRef.current?.openCreateForm()}
        />

        {/* MIDDLE SECTION - ALL TASKS */}
        <AllTasks
          ref={allTasksRef}
          selectedTag={selectedTag}
          allTasks={allTasks}
          isDarkMode={isDarkMode}
          handleTaskComplete={handleTaskComplete}
          onTaskCreated={fetchTasks}
          onTaskCreateStart={addTaskToView}
          onTaskCreateSuccess={replaceTaskInView}
          onTaskCreateFailure={removeTaskFromView}
        />

        <div className="w-96 min-h-0 flex flex-col overflow-hidden">
          <TodayPanel
            isDarkMode={isDarkMode}
            todayTasks={todayTasks}
            completedTasks={completedTasks}
            onTaskComplete={handleTaskComplete}
            onTaskCreateStart={addTaskToView}
            onTaskCreateSuccess={replaceTaskInView}
            onTaskCreateFailure={removeTaskFromView}
          />
        </div>
      </div>
    </div>
  )
}

export default Home
