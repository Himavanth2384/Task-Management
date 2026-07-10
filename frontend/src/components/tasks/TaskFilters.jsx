import React from 'react'
import { RiSearchLine, RiFilterLine, RiRefreshLine } from 'react-icons/ri'

const STATUSES  = ['', 'Pending', 'In Progress', 'Completed']
const PRIORITIES = ['', 'High', 'Medium', 'Low']
const SORT_OPTIONS = [
  { value: 'created_at', label: 'Created Date' },
  { value: 'due_date',   label: 'Due Date' },
]

/**
 * TaskFilters — search bar + filter dropdowns + sort controls.
 *
 * Props:
 *   filters      - current filter state object
 *   onFilter     - (key, value) => void
 *   onReset      - () => void — resets all filters
 */
export default function TaskFilters({ filters, onFilter, onReset }) {
  const hasActiveFilters = filters.status || filters.priority || filters.category || filters.search

  return (
    <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/5 p-4 space-y-3">
      {/* Row 1: search + reset */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none" />
          <input
            id="task-search-input"
            type="text"
            placeholder="Search tasks by title or description…"
            value={filters.search}
            onChange={e => onFilter('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
          />
        </div>
        {hasActiveFilters && (
          <button
            id="reset-filters-btn"
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all"
          >
            <RiRefreshLine />
            Reset
          </button>
        )}
      </div>

      {/* Row 2: filter dropdowns + sort */}
      <div className="flex flex-wrap gap-3">
        {/* Status filter */}
        <select
          id="filter-status"
          value={filters.status}
          onChange={e => onFilter('status', e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all cursor-pointer"
        >
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Priority filter */}
        <select
          id="filter-priority"
          value={filters.priority}
          onChange={e => onFilter('priority', e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all cursor-pointer"
        >
          <option value="">All Priorities</option>
          {PRIORITIES.filter(Boolean).map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Category filter */}
        <input
          id="filter-category"
          type="text"
          placeholder="Filter by category…"
          value={filters.category}
          onChange={e => onFilter('category', e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 placeholder:text-slate-400 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
        />

        {/* Sort by */}
        <select
          id="sort-by"
          value={filters.sort_by}
          onChange={e => onFilter('sort_by', e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>

        {/* Order */}
        <select
          id="sort-order"
          value={filters.order}
          onChange={e => onFilter('order', e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all cursor-pointer"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
    </div>
  )
}
