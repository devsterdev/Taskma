import { AlertTriangle, Trash2, X } from 'lucide-react'

interface DeleteTaskDialogProps {
  isDarkMode: boolean
  isDeleting: boolean
  taskTitle?: string
  onCancel: () => void
  onConfirm: () => void
}

const DeleteTaskDialog = ({
  isDarkMode,
  isDeleting,
  taskTitle,
  onCancel,
  onConfirm
}: DeleteTaskDialogProps) => {
  const panelClass = isDarkMode
    ? 'border-zinc-700 bg-[#191919] text-zinc-100'
    : 'border-zinc-200 bg-white text-zinc-950'
  const mutedClass = isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
  const secondaryButtonClass = isDarkMode
    ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
    : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
  const dangerButtonClass = isDarkMode
    ? 'bg-red-500 text-white hover:bg-red-400'
    : 'bg-red-600 text-white hover:bg-red-700'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-task-title"
    >
      <div className={`w-full max-w-sm rounded-lg border p-4 shadow-xl ${panelClass}`}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              isDarkMode ? 'bg-red-500/15 text-red-300' : 'bg-red-50 text-red-600'
            }`}>
              <AlertTriangle size={18} />
            </span>
            <div>
              <h3 id="delete-task-title" className="text-sm font-medium">Delete task?</h3>
              <p className={`mt-1 text-sm leading-5 ${mutedClass}`}>
                {taskTitle ? `This will permanently delete "${taskTitle}".` : 'This task will be permanently deleted.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className={`rounded-md p-1 transition-colors ${
              isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
            } disabled:cursor-not-allowed disabled:opacity-60`}
            aria-label="Close delete confirmation"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className={`rounded-md px-3 py-1.5 text-sm transition-colors ${secondaryButtonClass} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${dangerButtonClass} disabled:cursor-not-allowed disabled:opacity-70`}
          >
            <Trash2 size={14} />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteTaskDialog
