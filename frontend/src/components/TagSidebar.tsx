import { Check, CheckCircle2, ChevronUp, Menu, Plus } from 'lucide-react'

interface TagSidebarProps {
  tags: string[]
  tagFilters: Record<string, boolean>
  tagCounts: Record<string, number>
  onToggleTag: (tag: string) => void
  onShowAll: () => void
  isDarkMode: boolean
  onCreate?: () => void
}

const TagSidebar = ({
  tags,
  tagFilters,
  tagCounts,
  onToggleTag,
  onShowAll,
  isDarkMode,
  onCreate,
}: TagSidebarProps) => {
  const visibleTags = tags.filter(tag => tag !== 'today')
  const isAllSelected = Object.values(tagFilters).every(Boolean)
  const panelClass = isDarkMode
    ? 'border-zinc-950 bg-[#121212] text-zinc-100'
    : 'border-zinc-200 bg-white text-zinc-950'
  const mutedClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
  const softRowClass = isDarkMode ? 'hover:bg-[#181818]' : 'hover:bg-zinc-50'
  const activeRowClass = isDarkMode ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-950 text-white'
  const createButtonClass = isDarkMode
    ? 'bg-zinc-100 text-zinc-950 shadow-black/30 hover:bg-white'
    : 'bg-zinc-950 text-white shadow-zinc-300/70 hover:bg-zinc-800'
  const createIconClass = isDarkMode
    ? 'bg-zinc-950 text-white'
    : 'bg-white text-zinc-950'
  const renderListCheckbox = (checked: boolean) => (
    <span
      className={`flex h-[18px] w-[18px] items-center justify-center rounded-sm border transition-colors ${
        checked
          ? isDarkMode
            ? 'border-zinc-300 bg-zinc-300 text-black'
            : 'border-zinc-950 bg-zinc-950 text-white'
          : isDarkMode
            ? 'border-zinc-600 bg-transparent text-transparent'
            : 'border-zinc-400 bg-transparent text-transparent'
      }`}
      aria-hidden="true"
    >
      <Check size={14} />
    </span>
  )

  return (
    <aside className={`w-[17rem] shrink-0 overflow-y-auto border-r px-3 py-5 ${panelClass}`}>
      <div className="mb-8 flex items-center gap-5 px-4">
        <Menu size={21} />
        <div className="flex items-center gap-2">
          <CheckCircle2 size={32} />
          <span className="text-xl font-semibold">Tasks</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onCreate}
        className={`mb-8 flex h-13 w-full items-center gap-3 rounded-lg px-4 text-sm font-semibold shadow-md transition-colors ${createButtonClass}`}
      >
        <span className={`flex h-8 w-8 items-center justify-center rounded-md ${createIconClass}`}>
          <Plus size={18} strokeWidth={2.5} />
        </span>
        <span>Create task</span>
      </button>

      <div className="mb-8 space-y-1">
        <button
          type="button"
          onClick={onShowAll}
          className={`flex w-full items-center gap-4 rounded-full px-4 py-2 text-left text-sm transition-colors ${
            isAllSelected ? activeRowClass : `${mutedClass} ${softRowClass}`
          }`}
        >
          <CheckCircle2 size={18} />
          All tasks
        </button>

      </div>

      <div className="px-4">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold">Lists</p>
          <ChevronUp size={18} className={mutedClass} />
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => onToggleTag('today')}
            className={`flex w-full items-center justify-between rounded-md py-1 text-left text-sm transition-colors ${
              !isAllSelected && tagFilters.today ? 'font-medium' : ''
            } ${softRowClass}`}
          >
            <span className="flex items-center gap-4">
              {renderListCheckbox(Boolean(tagFilters.today))}
              Today
            </span>
            <span className={`text-xs ${mutedClass}`}>{tagCounts.today || 0}</span>
          </button>

          {visibleTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => onToggleTag(tag)}
              className={`flex w-full items-center justify-between rounded-md py-1 text-left text-sm transition-colors ${softRowClass}`}
            >
              <span className="flex min-w-0 items-center gap-4">
                {renderListCheckbox(Boolean(tagFilters[tag]))}
                <span className="truncate capitalize">{tag}</span>
              </span>
              <span className={`text-xs ${mutedClass}`}>{tagCounts[tag] || 0}</span>
            </button>
          ))}
        </div>
      </div>

    </aside>
  )
}

export default TagSidebar
