import React from 'react'
import { RiAlertLine, RiCloseLine } from 'react-icons/ri'

/**
 * ConfirmDialog — modal overlay asking the user to confirm a destructive action.
 *
 * Props:
 *   isOpen    - boolean to show/hide the dialog
 *   title     - dialog title
 *   message   - body text describing the action
 *   onConfirm - callback when "Delete" is clicked
 *   onCancel  - callback when "Cancel" or backdrop is clicked
 *   loading   - shows a disabled loading state on the confirm button
 */
export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, loading = false }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog box */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 animate-fade-in overflow-hidden">
        {/* Red accent top bar */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-400 to-red-500" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-11 h-11 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
              <RiAlertLine className="text-rose-500 text-xl" />
            </div>
            <div className="flex-1">
              <h2 id="confirm-dialog-title" className="text-slate-800 dark:text-white font-semibold text-lg">
                {title || 'Confirm Action'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {message || 'Are you sure you want to proceed? This action cannot be undone.'}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors p-1 rounded-lg"
              aria-label="Close dialog"
            >
              <RiCloseLine className="text-xl" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              id="confirm-dialog-cancel-btn"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              id="confirm-dialog-confirm-btn"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-rose-500/20"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
