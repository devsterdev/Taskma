import { Plus } from 'lucide-react'

interface TagSidebarProps {
  tags: string[]
  tagFilters: Record<string, boolean>
  tagCounts: Record<string, number>
  onToggleTag: (tag: string) => void
  isDarkMode: boolean
  onCreate?: () => void
  onCreateList?: () => void
}

const TagSidebar = ({
  tags,
  tagFilters,
  tagCounts,
  onToggleTag,
  isDarkMode,
  onCreate,
  onCreateList,
}: TagSidebarProps) => {
  return (
    <div className={`w-64 ${isDarkMode ? 'bg-black border-white' : 'bg-white border-black'} border-r p-6 overflow-y-auto`}>
      <button
        onClick={onCreate}
        className={`w-full ${isDarkMode ? 'bg-white text-black hover:bg-gray-300' : 'bg-black hover:bg-gray-900 text-white'} py-2 px-4 rounded-lg mb-8 flex items-center justify-center gap-2`}
      >
        <Plus size={20} />
        Create
      </button>

      <div className="space-y-3">
        <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-black'} mb-4`}>TAGS</div>
        {tags.map(tag => (
          <label
            key={tag}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors cursor-pointer ${
              tagFilters[tag]
                ? isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
                : isDarkMode ? 'hover:bg-gray-900 text-white' : 'hover:bg-gray-100 text-black'
            }`}
          >
            <span className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!tagFilters[tag]}
                onChange={() => onToggleTag(tag)}
                className="h-4 w-4 rounded border-gray-300 bg-white text-black focus:ring-black"
              />
              <span>{tag}</span>
            </span>
            <span className="text-xs font-medium">{tagCounts[tag] || 0}</span>
          </label>
        ))}
      </div>

      <button
        onClick={onCreateList}
        className={`w-full mt-6 text-left px-4 py-2 flex items-center gap-2 transition-colors ${isDarkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700'}`}
      >
        <Plus size={18} />
        Create new list
      </button>
    </div>
  )
}

export default TagSidebar
