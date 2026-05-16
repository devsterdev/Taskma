import React, { useState, useEffect, useRef } from 'react'
import { Calendar, Check, Edit, MoreVertical, Plus, Trash2, X } from 'lucide-react'
import { apiCall } from '../utils/api'
import DeleteTaskDialog from './DeleteTaskDialog'

interface Task {
  id: number
  title: string
  description: string
  completed: boolean
  userId: number
  dueDate?: string | null
  tags?: { id: number; name: string }[]
}

interface AllTasksProps {
  selectedTag: string
  allTasks: Task[]
  isDarkMode: boolean
  handleTaskComplete: (task: Task) => Promise<void>
  onTaskCreated: () => Promise<void>
  onTaskCreateStart: (task: Task) => void
  onTaskCreateSuccess: (temporaryTaskId: number, savedTask: Task) => void
  onTaskCreateFailure: (temporaryTaskId: number) => void
}

export interface AllTasksHandle {
  openCreateForm: () => void
}

const AllTasks = React.forwardRef<AllTasksHandle, AllTasksProps>(({
  selectedTag,
  allTasks,
  isDarkMode,
  handleTaskComplete,
  onTaskCreated,
  onTaskCreateStart,
  onTaskCreateSuccess,
  onTaskCreateFailure,
}, ref) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', tags: '', today: false, dueDate: '' })
  const [tagDraft, setTagDraft] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editFormData, setEditFormData] = useState({ title: '', description: '', tags: '', today: false, dueDate: '' })
  const [editTagDraft, setEditTagDraft] = useState('')
  const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null)
  const [menuOpenTaskId, setMenuOpenTaskId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null)
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null)

  const menuRef = useRef<HTMLDivElement>(null)
  const tagInputRef = useRef<HTMLInputElement>(null)
  const editTagInputRef = useRef<HTMLInputElement>(null)

  const title = selectedTag === 'All tasks' ? 'My Tasks' : selectedTag
  const pageClass = isDarkMode
    ? 'bg-[#121212] text-zinc-100 border-zinc-950'
    : 'bg-white text-zinc-950 border-zinc-200'
  const mutedClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
  const inputClass = `w-full rounded-md border px-3 py-2 text-sm transition-colors ${
    isDarkMode
      ? 'border-zinc-700 bg-[#121212] text-zinc-100 placeholder-zinc-500 focus:border-zinc-400 focus:outline-none'
      : 'border-zinc-300 bg-white text-zinc-950 placeholder-zinc-400 focus:border-zinc-700 focus:outline-none'
  }`
  const tagFieldClass = `flex min-h-[42px] w-full flex-wrap items-center gap-2 rounded-md border px-2.5 py-2 text-sm transition-colors ${
    isDarkMode
      ? 'border-zinc-700 bg-[#121212] text-zinc-100 focus-within:border-zinc-400'
      : 'border-zinc-300 bg-white text-zinc-950 focus-within:border-zinc-700'
  }`
  const tagPillClass = `inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-sm ${
    isDarkMode ? 'bg-zinc-800 text-zinc-100' : 'bg-zinc-200 text-zinc-800'
  }`
  const secondaryButtonClass = `rounded-md px-3 py-1.5 text-sm transition-colors ${
    isDarkMode ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
  }`
  const primaryButtonClass = `rounded-md px-3 py-1.5 text-sm transition-colors ${
    isDarkMode ? 'bg-zinc-100 text-zinc-950 hover:bg-white' : 'bg-zinc-950 text-white hover:bg-zinc-800'
  }`
  const dateIconInputClass = `h-10 w-10 cursor-pointer rounded-md border text-transparent transition-colors [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 ${
    isDarkMode
      ? 'border-zinc-700 bg-[#121212] focus:border-zinc-400 focus:outline-none'
      : 'border-zinc-300 bg-white focus:border-zinc-700 focus:outline-none'
  }`
  const dateIconClass = isDarkMode ? 'text-zinc-300' : 'text-zinc-700'

  const normalizeTagName = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z]/g, '')

  const normalizeTagsInput = (value: string) =>
    Array.from(new Set(
      value
        .split(',')
        .map(normalizeTagName)
        .filter(Boolean)
    )).join(', ')

  const getTagList = (tags: string) =>
    tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)

  const serializeTags = (tags: string[]) => tags.join(', ')

  const getTodayDateInputValue = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const toDateInputValue = (value?: string | null) => {
    if (!value) {
      return ''
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return ''
    }

    return date.toISOString().slice(0, 10)
  }

  const formatDueDate = (value?: string | null) => {
    if (!value) {
      return ''
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return ''
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const isTaskOverdue = (task: Task) => {
    if (!task.dueDate || task.completed) {
      return false
    }

    const dueDate = new Date(task.dueDate)
    if (Number.isNaN(dueDate.getTime())) {
      return false
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)

    return dueDate < today
  }

  const addTagsToValue = (currentTags: string, nextTags: string[]) => {
    const existingTags = getTagList(currentTags)
    const mergedTags = [...existingTags]

    nextTags.forEach(tag => {
      const normalizedTag = normalizeTagName(tag)

      if (normalizedTag && !mergedTags.includes(normalizedTag)) {
        mergedTags.push(normalizedTag)
      }
    })

    return serializeTags(mergedTags)
  }

  const removeTagFromValue = (currentTags: string, tagToRemove: string) =>
    serializeTags(getTagList(currentTags).filter(tag => tag !== tagToRemove))

  const parseTags = (tags: string, today: boolean) => {
    const parsedTags = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)

    if (today && !parsedTags.includes('today')) {
      parsedTags.push('today')
    }

    return parsedTags
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenTaskId(null)
      }
    }

    if (menuOpenTaskId !== null) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpenTaskId])

  const handleAddTaskClick = () => {
    setEditingTaskId(null)
    setTagDraft('')
    setShowAddForm(true)
  }

  const closeCreateForm = () => {
    setShowAddForm(false)
    setTagDraft('')
  }

  React.useImperativeHandle(ref, () => ({
    openCreateForm: handleAddTaskClick
  }))

  const sortedTasks = React.useMemo(
    () => [...allTasks].sort((a, b) => Number(a.completed) - Number(b.completed)),
    [allTasks]
  )

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement

    if (name === 'tags') {
      setFormData(prev => ({
        ...prev,
        tags: normalizeTagsInput(value)
      }))
      return
    }

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        ...(name === 'today' && checked ? { dueDate: getTodayDateInputValue() } : {})
      }))
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement

    if (name === 'tags') {
      setEditFormData(prev => ({
        ...prev,
        tags: normalizeTagsInput(value)
      }))
      return
    }

    if (type === 'checkbox') {
      setEditFormData(prev => ({
        ...prev,
        [name]: checked,
        ...(name === 'today' && checked ? { dueDate: getTodayDateInputValue() } : {})
      }))
      return
    }

    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const commitTagDraft = (mode: 'create' | 'edit') => {
    if (mode === 'create') {
      setFormData(prev => ({
        ...prev,
        tags: addTagsToValue(prev.tags, [tagDraft])
      }))
      setTagDraft('')
      return
    }

    setEditFormData(prev => ({
      ...prev,
      tags: addTagsToValue(prev.tags, [editTagDraft])
    }))
    setEditTagDraft('')
  }

  const handleTagDraftChange = (value: string, mode: 'create' | 'edit') => {
    const parts = value.split(',')
    const setDraft = mode === 'create' ? setTagDraft : setEditTagDraft

    if (parts.length === 1) {
      setDraft(normalizeTagName(value))
      return
    }

    const tagsToAdd = parts.slice(0, -1)
    const nextDraft = normalizeTagName(parts[parts.length - 1])

    if (mode === 'create') {
      setFormData(prev => ({
        ...prev,
        tags: addTagsToValue(prev.tags, tagsToAdd)
      }))
    } else {
      setEditFormData(prev => ({
        ...prev,
        tags: addTagsToValue(prev.tags, tagsToAdd)
      }))
    }

    setDraft(nextDraft)
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, mode: 'create' | 'edit') => {
    const draft = mode === 'create' ? tagDraft : editTagDraft
    const currentTags = mode === 'create' ? formData.tags : editFormData.tags

    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commitTagDraft(mode)
      return
    }

    if (e.key === 'Backspace' && !draft) {
      const tags = getTagList(currentTags)

      if (tags.length === 0) {
        return
      }

      e.preventDefault()
      const updatedTags = serializeTags(tags.slice(0, -1))

      if (mode === 'create') {
        setFormData(prev => ({ ...prev, tags: updatedTags }))
      } else {
        setEditFormData(prev => ({ ...prev, tags: updatedTags }))
      }
    }
  }

  const handleRemoveTag = (tag: string, mode: 'create' | 'edit') => {
    if (mode === 'create') {
      setFormData(prev => ({
        ...prev,
        tags: removeTagFromValue(prev.tags, tag)
      }))
      tagInputRef.current?.focus()
      return
    }

    setEditFormData(prev => ({
      ...prev,
      tags: removeTagFromValue(prev.tags, tag)
    }))
    editTagInputRef.current?.focus()
  }

  const renderTagField = (mode: 'create' | 'edit') => {
    const tags = getTagList(mode === 'create' ? formData.tags : editFormData.tags)
    const draft = mode === 'create' ? tagDraft : editTagDraft
    const inputRef = mode === 'create' ? tagInputRef : editTagInputRef

    return (
      <div className={tagFieldClass} onClick={() => inputRef.current?.focus()}>
        {tags.map(tag => (
          <span key={tag} className={tagPillClass}>
            {tag}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                handleRemoveTag(tag, mode)
              }}
              className={`rounded-full p-0.5 transition-colors ${
                isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-300'
              }`}
              aria-label={`Remove ${tag} tag`}
            >
              <X size={13} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(event) => handleTagDraftChange(event.target.value, mode)}
          onKeyDown={(event) => handleTagKeyDown(event, mode)}
          onBlur={() => commitTagDraft(mode)}
          placeholder={tags.length === 0 ? 'Add an interest...' : ''}
          className={`min-w-[140px] flex-1 border-0 bg-transparent p-0 text-sm outline-none ${
            isDarkMode ? 'text-zinc-100 placeholder-zinc-500' : 'text-zinc-950 placeholder-zinc-400'
          }`}
        />
      </div>
    )
  }

  const renderDueDateInput = (
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) => (
    <label className="flex shrink-0 items-center gap-2 text-sm" title="Choose due date">
      <span className="relative flex h-10 w-10 items-center justify-center">
        <Calendar size={17} className={`pointer-events-none absolute ${dateIconClass}`} />
        <input
          type="date"
          name="dueDate"
          value={value}
          onChange={onChange}
          className={dateIconInputClass}
          aria-label="Choose due date"
        />
      </span>
      <span className={mutedClass}>Due date</span>
    </label>
  )

  const handleSubmit = async () => {
    if (formData.title.trim() && !isCreating) {
      const parsedTags = parseTags(formData.tags, formData.today)
      const dueDate = formData.today ? getTodayDateInputValue() : formData.dueDate
      const temporaryTaskId = -Date.now()
      const optimisticTask: Task = {
        id: temporaryTaskId,
        title: formData.title.trim(),
        description: formData.description,
        dueDate: dueDate || null,
        completed: false,
        userId: 0,
        tags: parsedTags.map((tag, index) => ({
          id: temporaryTaskId - index - 1,
          name: tag
        }))
      }

      onTaskCreateStart(optimisticTask)
      setFormData({ title: '', description: '', tags: '', today: false, dueDate: '' })
      setTagDraft('')
      setShowAddForm(false)
      setIsCreating(true)

      try {
        const response = await apiCall('/todo/add', {
          method: 'POST',
          body: JSON.stringify({
            title: optimisticTask.title,
            description: optimisticTask.description,
            dueDate: optimisticTask.dueDate,
            tags: parsedTags
          })
        })

        if (response.ok) {
          const data = await response.json()
          onTaskCreateSuccess(temporaryTaskId, data.todo || data)
        } else {
          console.error('Failed to create task')
          onTaskCreateFailure(temporaryTaskId)
        }
      } catch (error) {
        console.error('Error creating task:', error)
        onTaskCreateFailure(temporaryTaskId)
      } finally {
        setIsCreating(false)
      }
    }
  }

  const handleEditSubmit = async () => {
    if (editingTaskId && editFormData.title.trim() && !isUpdating) {
      const dueDate = editFormData.today ? getTodayDateInputValue() : editFormData.dueDate
      setIsUpdating(true)
      try {
        const response = await apiCall(`/todo/update/${editingTaskId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: editFormData.title,
            description: editFormData.description,
            dueDate: dueDate || null,
            tags: parseTags(editFormData.tags, editFormData.today)
          })
        })

        if (response.ok) {
          setEditingTaskId(null)
          setEditFormData({ title: '', description: '', tags: '', today: false, dueDate: '' })
          setEditTagDraft('')
          await onTaskCreated()
        } else {
          console.error('Failed to update task')
        }
      } catch (error) {
        console.error('Error updating task:', error)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const requestDelete = (task: Task) => {
    setTaskPendingDelete(task)
    setMenuOpenTaskId(null)
  }

  const cancelDelete = () => {
    if (deletingTaskId === null) {
      setTaskPendingDelete(null)
    }
  }

  const confirmDelete = async () => {
    if (!taskPendingDelete || deletingTaskId !== null) {
      return
    }

    setDeletingTaskId(taskPendingDelete.id)
    try {
      const response = await apiCall(`/todo/delete/${taskPendingDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTaskPendingDelete(null)
        await onTaskCreated()
      } else {
        console.error('Failed to delete task')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setDeletingTaskId(null)
    }
  }

  const startEditing = (task: Task) => {
    const taskTagNames = (task.tags || []).map(tag => tag.name)
    setEditingTaskId(task.id)
    setEditTagDraft('')
    setEditFormData({
      title: task.title,
      description: task.description,
      tags: taskTagNames.filter(tagName => tagName !== 'today').join(', '),
      today: taskTagNames.includes('today'),
      dueDate: toDateInputValue(task.dueDate)
    })
    setMenuOpenTaskId(null)
  }

  return (
    <div className={`flex-1 overflow-y-auto border-r px-5 py-5 ${pageClass}`}>
      {taskPendingDelete && (
        <DeleteTaskDialog
          isDarkMode={isDarkMode}
          isDeleting={deletingTaskId === taskPendingDelete.id}
          taskTitle={taskPendingDelete.title}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}

      <div className="mb-5">
        <h2 className="text-lg font-normal">{title}</h2>
      </div>

      <button
        type="button"
        onClick={handleAddTaskClick}
        className={`mb-4 flex items-center gap-4 text-sm transition-colors ${
          isDarkMode ? 'text-blue-200 hover:text-white' : 'text-zinc-700 hover:text-black'
        }`}
      >
        <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border ${
          isDarkMode ? 'border-blue-200 text-blue-200' : 'border-zinc-700 text-zinc-700'
        }`}>
          <Plus size={13} />
        </span>
        Add a task
      </button>

      {showAddForm && (
        <div className={`mb-5 rounded-lg border p-4 ${isDarkMode ? 'border-zinc-700 bg-[#161616]' : 'border-zinc-300 bg-zinc-50'}`}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium">New task</h3>
            <button
              type="button"
              onClick={closeCreateForm}
              className={`rounded-md p-1 transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-200'}`}
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              placeholder="Task title"
              className={inputClass}
            />
            <label className="block space-y-1.5">
              <span className={`text-xs font-medium ${mutedClass}`}>Description</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Optional note"
                rows={2}
                className={`${inputClass} resize-none`}
              />
            </label>
            <label className="block space-y-1.5">
              <span className={`text-xs font-medium ${mutedClass}`}>Tags</span>
              {renderTagField('create')}
            </label>
            <div className="flex items-center gap-3">
              <label className={`flex items-center gap-2 text-sm ${mutedClass}`}>
                <input
                  type="checkbox"
                  name="today"
                  checked={formData.today}
                  onChange={handleFormChange}
                  className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                />
                Today
              </label>
              {renderDueDateInput(formData.dueDate, handleFormChange)}
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeCreateForm} className={secondaryButtonClass}>
                Cancel
              </button>
              <button type="button" onClick={handleSubmit} disabled={isCreating} className={`${primaryButtonClass} disabled:cursor-not-allowed disabled:opacity-70`}>
                {isCreating ? 'Creating...' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {sortedTasks.length === 0 ? (
          <p className={`py-8 text-sm ${mutedClass}`}>No tasks yet</p>
        ) : (
          sortedTasks.map(task => (
            <div
              key={task.id}
              className={`group relative flex items-start gap-4 rounded-md py-2 pr-9 transition-colors ${
                isDarkMode ? 'hover:bg-[#181818]' : 'hover:bg-zinc-50'
              }`}
              onMouseEnter={() => setHoveredTaskId(task.id)}
              onMouseLeave={() => setHoveredTaskId(null)}
            >
              <button
                type="button"
                onClick={() => handleTaskComplete(task)}
                className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  task.completed
                    ? isDarkMode ? 'border-zinc-100 bg-zinc-100 text-black' : 'border-black bg-black text-white'
                    : isDarkMode ? 'border-zinc-300 hover:border-white' : 'border-zinc-700 hover:border-black'
                }`}
                aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
              >
                {task.completed && <Check size={12} />}
              </button>

              {editingTaskId === task.id ? (
                <div className="min-w-0 flex-1 space-y-2">
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    className={inputClass}
                  />
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows={2}
                    className={`${inputClass} resize-none`}
                  />
                  {renderTagField('edit')}
                  <div className="flex items-center gap-3">
                    <label className={`flex items-center gap-2 text-sm ${mutedClass}`}>
                      <input
                        type="checkbox"
                        name="today"
                        checked={editFormData.today}
                        onChange={handleEditChange}
                        className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                      />
                      Today
                    </label>
                    {renderDueDateInput(editFormData.dueDate, handleEditChange)}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleEditSubmit} disabled={isUpdating} className={`${primaryButtonClass} disabled:cursor-not-allowed disabled:opacity-70`}>
                      {isUpdating ? 'Saving...' : 'Submit'}
                    </button>
                    <button type="button" onClick={() => {
                      setEditingTaskId(null)
                      setEditTagDraft('')
                    }} disabled={isUpdating} className={`${secondaryButtonClass} disabled:cursor-not-allowed disabled:opacity-70`}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="min-w-0 flex-1">
                  <p className={`text-sm leading-5 ${
                    task.completed
                      ? 'text-zinc-500 line-through'
                      : isTaskOverdue(task)
                        ? isDarkMode ? 'text-red-300' : 'text-red-600'
                        : isDarkMode ? 'text-zinc-100' : 'text-zinc-900'
                  }`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className={`text-xs leading-4 ${mutedClass}`}>
                      {task.description}
                    </p>
                  )}
                  {task.dueDate && (
                    <p className={`mt-1 text-xs ${
                      isTaskOverdue(task) ? isDarkMode ? 'text-red-300' : 'text-red-600' : mutedClass
                    }`}>
                      Due: {formatDueDate(task.dueDate)}
                    </p>
                  )}
                  {task.tags && task.tags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {task.tags.map(tag => (
                        <span
                          key={tag.id}
                          className={`text-[11px] ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {hoveredTaskId === task.id && editingTaskId !== task.id && (
                <button
                  type="button"
                  onClick={() => setMenuOpenTaskId(menuOpenTaskId === task.id ? null : task.id)}
                  className={`absolute right-1 top-1 rounded-md p-1 transition-colors ${
                    isDarkMode ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-black'
                  }`}
                  aria-label="Task options"
                >
                  <MoreVertical size={16} />
                </button>
              )}

              {menuOpenTaskId === task.id && (
                <div
                  ref={menuRef}
                  className={`absolute right-1 top-8 z-10 w-32 rounded-md border shadow-lg ${
                    isDarkMode ? 'border-zinc-700 bg-[#191919]' : 'border-zinc-200 bg-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => startEditing(task)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
                      isDarkMode ? 'text-white hover:bg-zinc-800' : 'text-black hover:bg-zinc-100'
                    }`}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => requestDelete(task)}
                    disabled={deletingTaskId === task.id}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors ${
                      isDarkMode ? 'text-red-300 hover:bg-zinc-800' : 'text-red-600 hover:bg-red-50'
                    } disabled:cursor-not-allowed disabled:opacity-70`}
                  >
                    <Trash2 size={14} />
                    {deletingTaskId === task.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
})

export default AllTasks
