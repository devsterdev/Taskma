import React from 'react'
import { CheckCircle2, Plus } from 'lucide-react'

interface TodayPanelProps {
  isDarkMode: boolean
}

const TodayPanel: React.FC<TodayPanelProps> = ({ isDarkMode }) => {
  return (
    <div className={`mb-6 rounded-3xl p-6 shadow-lg transition-colors ${
      isDarkMode ? 'bg-zinc-950 text-white shadow-black/40' : 'bg-white text-black shadow-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className={`text-sm uppercase tracking-[0.3em] font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Today
          </p>
        </div>
        <button
          type="button"
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            isDarkMode ? 'border-white/10 bg-white/5 text-white hover:bg-white/10' : 'border-black/10 bg-black/5 text-black hover:bg-black/10'
          }`}
        >
          <Plus size={16} />
          Add a task
        </button>
      </div>

      <div className={`flex flex-col items-center text-center py-12 px-4 rounded-3xl border border-dashed transition-colors ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}>
        <div className={`mb-5 rounded-full p-4 ${isDarkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}>
          <CheckCircle2 size={42} />
        </div>
        <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          All tasks complete
        </h3>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Nice work!
        </p>
      </div>

      <div className={`mt-6 rounded-2xl border p-4 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-black/10 bg-black/5'}`}>
        <p className={`text-sm font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          Today section is ready for your task implementation
        </p>
        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          The UI is prepared here so you can add the actual logic later.
        </p>
      </div>
    </div>
  )
}

export default TodayPanel
