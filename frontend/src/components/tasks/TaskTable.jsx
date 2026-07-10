import React from 'react'
import { useNavigate } from 'react-router-dom'
import { RiEditLine, RiDeleteBin6Line, RiEyeLine, RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri'

/**
 * Status badge colors
 */
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
 * SortHeader — a column header with sort direction indicator.
 */
function SortHeader({ label, field, sortBy, order, onSort }) {
  const isActive = sortBy === field
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-indigo-500 transition-colors"
    >
      {label}
      {isActive && (
        order === 'asc'
          ? <RiArrowUpLine className="text-indigo-500" />
          : <RiArrowDownLine className="text-indigo-500" />
      )}
    </button>
  )
}

/**
 * TaskTable — displays a list of tasks in a styled, sortable table.
 *
 * Props:
 *   tasks       - array of task objects
 *   sortBy      - current sort field
 *   order       - 'asc' | 'desc'
 *   onSort      - (field) => void
 *   onDelete    - (task) => void — triggers confirm dialog
 *   emptyMessage - shown when tasks array is empty
 */
export default function TaskTable({ tasks, sortBy, order, onSort, onDelete }) {
  const navigate = useNavigate()

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-slate-500 dark:text-slate-400 font-medium">No tasks found</p>
        <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Create your first task to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-white/2 border-b border-slate-200 dark:border-white/5">
            <th className="px-4 py-3 text-left">
              <SortHeader label="Title" field="title" sortBy={sortBy} order={order} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left hidden md:table-cell">Status</th>
            <th className="px-4 py-3 text-left hidden md:table-cell">Priority</th>
            <th className="px-4 py-3 text-left hidden lg:table-cell">Category</th>
            <th className="px-4 py-3 text-left hidden lg:table-cell">
              <SortHeader label="Due Date" field="due_date" sortBy={sortBy} order={order} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-left hidden xl:table-cell">
              <SortHeader label="Created" field="created_at" sortBy={sortBy} order={order} onSort={onSort} />
            </th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
          {tasks.map((task, idx) => (
            <tr
              key={task.id}
              className="bg-white dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-white/3 transition-colors animate-fade-in"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {/* Title */}
              <td className="px-4 py-3">
                <button
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="text-slate-800 dark:text-slate-100 font-medium hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors text-left max-w-[200px] truncate"
                >
                  {task.title}
                </button>
                {task.description && (
                  <p className="text-slate-400 text-xs mt-0.5 truncate max-w-[200px]">{task.description}</p>
                )}
              </td>

              {/* Status */}
              <td className="px-4 py-3 hidden md:table-cell">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[task.status] || ''}`}>
                  {task.status}
                </span>
              </td>

              {/* Priority */}
              <td className="px-4 py-3 hidden md:table-cell">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${PRIORITY_STYLES[task.priority] || ''}`}>
                  {task.priority}
                </span>
              </td>

              {/* Category */}
              <td className="px-4 py-3 hidden lg:table-cell text-slate-500 dark:text-slate-400">
                {task.category || <span className="text-slate-300 dark:text-slate-600">—</span>}
              </td>

              {/* Due Date */}
              <td className="px-4 py-3 hidden lg:table-cell text-slate-500 dark:text-slate-400">
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : <span className="text-slate-300 dark:text-slate-600">—</span>
                }
              </td>

              {/* Created At */}
              <td className="px-4 py-3 hidden xl:table-cell text-slate-400 dark:text-slate-500 text-xs">
                {new Date(task.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </td>

              {/* Actions */}
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                    title="View task"
                  >
                    <RiEyeLine />
                  </button>
                  <button
                    onClick={() => navigate(`/tasks/${task.id}/edit`)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
                    title="Edit task"
                  >
                    <RiEditLine />
                  </button>
                  <button
                    onClick={() => onDelete(task)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                    title="Delete task"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
