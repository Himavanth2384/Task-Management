import React, { useEffect, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiAddCircleLine } from 'react-icons/ri'
import { useTasks } from '../hooks/useTasks'
import TaskTable from '../components/tasks/TaskTable'
import TaskFilters from '../components/tasks/TaskFilters'
import ConfirmDialog from '../components/common/ConfirmDialog'
import Spinner from '../components/common/Spinner'

/**
 * TaskList page — full task list with search, filter, sort, pagination, and delete dialog.
 */
export default function TaskList() {
  const {
    tasks, pagination, loading, filters,
    fetchTasks, updateFilter, setPage, deleteTask,
  } = useTasks()

  const [deleteTarget, setDeleteTarget] = useState(null)   // task to delete
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Fetch on mount and whenever filters change
  useEffect(() => { fetchTasks() }, [filters])

  const handleSort = useCallback((field) => {
    if (filters.sort_by === field) {
      updateFilter('order', filters.order === 'asc' ? 'desc' : 'asc')
    } else {
      updateFilter('sort_by', field)
      updateFilter('order', 'desc')
    }
  }, [filters, updateFilter])

  const handleResetFilters = () => {
    updateFilter('status', '')
    updateFilter('priority', '')
    updateFilter('category', '')
    updateFilter('search', '')
    updateFilter('sort_by', 'created_at')
    updateFilter('order', 'desc')
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    await deleteTask(deleteTarget.id)
    setDeleteLoading(false)
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">My Tasks</h2>
          {pagination && (
            <p className="text-slate-400 text-sm mt-0.5">
              {pagination.total} task{pagination.total !== 1 ? 's' : ''} total
            </p>
          )}
        </div>
        <Link
          to="/tasks/new"
          id="tasklist-create-btn"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 shadow-lg shadow-indigo-500/25 transition-all"
        >
          <RiAddCircleLine className="text-lg" />
          New Task
        </Link>
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onFilter={updateFilter} onReset={handleResetFilters} />

      {/* Table or spinner */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
        {loading ? (
          <div className="py-16">
            <Spinner size="lg" className="mx-auto" />
            <p className="text-center text-slate-400 text-sm mt-4">Loading tasks…</p>
          </div>
        ) : (
          <TaskTable
            tasks={tasks}
            sortBy={filters.sort_by}
            order={filters.order}
            onSort={handleSort}
            onDelete={setDeleteTarget}
          />
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">
            Page {pagination.page} of {pagination.pages}
          </p>
          <div className="flex gap-2">
            <button
              id="pagination-prev-btn"
              onClick={() => setPage(pagination.page - 1)}
              disabled={!pagination.has_prev}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>

            {/* Page numbers */}
            <div className="flex gap-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                    p === pagination.page
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              id="pagination-next-btn"
              onClick={() => setPage(pagination.page + 1)}
              disabled={!pagination.has_next}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Delete confirm dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        loading={deleteLoading}
      />
    </div>
  )
}
