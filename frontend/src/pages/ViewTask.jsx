import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  RiEditLine, RiDeleteBin6Line, RiArrowLeftLine,
  RiCalendarLine, RiPriceTag3Line, RiFlagLine, RiTimeLine,
} from 'react-icons/ri'
import { taskService } from '../services/taskService'
import { FullPageSpinner } from '../components/common/Spinner'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { toast } from 'react-toastify'

const STATUS_STYLES = {
  'Pending':     'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  'Completed':   'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
}
const PRIORITY_STYLES = {
  'High':   'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
  'Medium': 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  'Low':    'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400',
}

/**
 * ViewTask page — detailed view of a single task with edit/delete actions.
 */
export default function ViewTask() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    taskService.getTask(id)
      .then(data => setTask(data.task))
      .catch(() => { toast.error('Task not found.'); navigate('/tasks') })
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await taskService.deleteTask(id)
      toast.success('Task deleted.')
      navigate('/tasks')
    } catch { toast.error('Failed to delete task.') }
    finally { setDeleting(false) }
  }

  if (loading) return <FullPageSpinner />
  if (!task) return null

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-4">
      {/* Back + actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm transition-colors"
        >
          <RiArrowLeftLine /> Back
        </button>
        <div className="flex gap-2">
          <Link
            to={`/tasks/${id}/edit`}
            id="view-task-edit-btn"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all"
          >
            <RiEditLine /> Edit
          </Link>
          <button
            id="view-task-delete-btn"
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all"
          >
            <RiDeleteBin6Line /> Delete
          </button>
        </div>
      </div>

      {/* Task card */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
        {/* Color accent by priority */}
        <div className={`h-1.5 w-full ${task.priority === 'High' ? 'bg-gradient-to-r from-rose-400 to-pink-500' : task.priority === 'Medium' ? 'bg-gradient-to-r from-orange-400 to-amber-500' : 'bg-gradient-to-r from-slate-300 to-slate-400'}`} />

        <div className="p-6 space-y-5">
          {/* Title + badges */}
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
              {task.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[task.status] || ''}`}>
                {task.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${PRIORITY_STYLES[task.priority] || ''}`}>
                {task.priority} Priority
              </span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            </div>
          )}

          {/* Meta info grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            {task.category && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center shrink-0">
                  <RiPriceTag3Line className="text-violet-500 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Category</p>
                  <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">{task.category}</p>
                </div>
              </div>
            )}

            {task.due_date && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0">
                  <RiCalendarLine className="text-amber-500 text-sm" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Due Date</p>
                  <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">
                    {new Date(task.due_date).toLocaleDateString('en-US', {
                      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0">
                <RiTimeLine className="text-blue-500 text-sm" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Created</p>
                <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">
                  {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
                <RiTimeLine className="text-indigo-500 text-sm" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Last Updated</p>
                <p className="text-slate-700 dark:text-slate-200 text-sm font-medium">
                  {new Date(task.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm delete */}
      <ConfirmDialog
        isOpen={showDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </div>
  )
}
