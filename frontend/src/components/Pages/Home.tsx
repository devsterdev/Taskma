import React, { useState, useEffect } from 'react'
import { Check, Plus, Star, Menu } from 'lucide-react'
import Navbar from '../Navbar'
import { apiCall } from '../../utils/api'

interface Task {
  id: number
  title: string
  completed: boolean
  isToday: boolean
}

const Home = ({ onLogout }: { onLogout: () => void }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'I have four option to shift in Linux', completed: false, isToday: false },
    { id: 2, title: 'Exam phase being most productive phase', completed: false, isToday: false },
    { id: 3, title: 'Share the demo video', completed: false, isToday: true },
    { id: 4, title: 'Thread of all my components', completed: false, isToday: false },
    { id: 5, title: 'What is the point of winning if you have not lost once', completed: false, isToday: false },
    { id: 6, title: 'At some point we all should stop and appreciate how far we have come', completed: false, isToday: false },
    { id: 7, title: 'My unfair Advantage is I have great friends', completed: false, isToday: false },
    { id: 8, title: 'Ayan money few days ago', completed: false, isToday: false },
    { id: 9, title: 'Everything is fine even if everything is not fine', completed: false, isToday: false },
    { id: 10, title: "Can't wait for Tomorrow", completed: false, isToday: false },
    { id: 11, title: 'Things I do pintrest', completed: false, isToday: false },
    { id: 12, title: 'Throughing my old design and working on new one', completed: false, isToday: false },
    { id: 13, title: 'Something that open browser in terminal', completed: false, isToday: false },
    { id: 14, title: 'I have four linux distro to choose btw', completed: false, isToday: false },
    { id: 15, title: 'Writing code every day until I get a job', completed: false, isToday: false },
    { id: 16, title: 'Jaaneman Kaushal does internship matters', completed: false, isToday: false },
    { id: 17, title: 'I would love to join a sketching club but there is nothing in my area', completed: false, isToday: false },
  ])

  const [selectedTag, setSelectedTag] = useState('All tasks')
  const [completedTasks, setCompletedTasks] = useState<number[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await apiCall('/todo/getTodos', {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const tags = ['All tasks', 'Starred', 'My Tasks', 'Today']

  const handleTaskComplete = (id: number) => {
    if (completedTasks.includes(id)) {
      setCompletedTasks(completedTasks.filter(taskId => taskId !== id))
    } else {
      setCompletedTasks([...completedTasks, id])
    }
  }

  const allTasks = tasks.filter(task => {
    if (selectedTag === 'Today') return task.isToday
    if (selectedTag === 'My Tasks') return !task.isToday
    return true
  })

  const todayTasks = tasks.filter(task => task.isToday)
  const completedTodayCount = todayTasks.filter(task => completedTasks.includes(task.id)).length

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
        <div className={`flex-1 ${isDarkMode ? 'border-white' : 'border-black'} border-r p-8 overflow-y-auto`}>
          <div className="mb-8">
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              <Menu size={24} />
              {selectedTag}
            </h2>

            <button className={`mb-6 flex items-center gap-2 transition-colors ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'}`}>
              <Plus size={20} />
              Add a task
            </button>

            <div className="space-y-2">
              {allTasks.map(task => (
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
                  <span className={completedTasks.includes(task.id) ? 'line-through text-gray-500' : isDarkMode ? 'text-white' : 'text-black'}>
                    {task.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - TODAY'S TASKS */}
        <div className={`w-96 ${isDarkMode ? 'bg-black border-white' : 'bg-white border-black'} border-l p-8 overflow-y-auto flex flex-col`}>
          <h2 className={`text-2xl font-bold mb-8 ${isDarkMode ? 'text-white' : 'text-black'}`}>Today</h2>

          <button className={`mb-6 flex items-center gap-2 transition-colors ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'}`}>
            <Plus size={20} />
            Add a task
          </button>

          {todayTasks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>All tasks complete</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Nice work!</p>
            </div>
          ) : (
            <div>
              <div className="space-y-2 mb-6">
                {todayTasks.map(task => (
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
                  Completed ({completedTodayCount})
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