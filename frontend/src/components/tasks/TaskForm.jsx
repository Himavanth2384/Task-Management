import React, { useState, useEffect } from 'react'
import { RiSaveLine, RiArrowLeftLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import Spinner from '../common/Spinner'

const STATUSES   = ['Pending', 'In Progress', 'Completed']
const PRIORITIES = ['Low', 'Medium', 'High']

const INITIAL_STATE = {
  title:       '',
  description: '',
  status:      'Pending',
  priority:    'Medium',
  category:    '',
  due_date:    '',
}

/**
 * TaskForm — reusable form for creating and editing tasks.
 *
 * Props:
 *   initialData  - pre-filled values (for edit mode)
 *   onSubmit     - async (formData) => void
 *   loading      - shows spinner on submit button
 *   mode         - 'create' | 'edit'
 */
export default function TaskForm({ initialData = {}, onSubmit, loading = false, mode = 'create' }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...INITIAL_STATE, ...initialData })
  const [errors, setErrors] = useState({})

  // Sync form when initialData changes (edit mode)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({ ...INITIAL_STATE, ...initialData })
    }
  }, [initialData?.id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (form.due_date) {
      const d = new Date(form.due_date)
      if (isNaN(d.getTime())) errs.due_date = 'Enter a valid date (YYYY-MM-DD).'
    }
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const payload = {
      ...form,
      due_date: form.due_date || null,
      category: form.category.trim() || null,
      description: form.description.trim() || null,
    }
    await onSubmit(payload)
  }

  const inputClass = (field) => `
    w-full px-4 py-2.5 rounded-xl
    bg-slate-50 dark:bg-slate-800
    border ${errors[field] ? 'border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 dark:border-white/10 focus:border-indigo-400 focus:ring-indigo-400/20'}
    text-slate-700 dark:text-slate-200
    placeholder:text-slate-400
    text-sm focus:outline-none focus:ring-2
    transition-all
  `

  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5'

  return (
    <form onSubmit={handleSubmit} id="task-form" className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="task-title" className={labelClass}>
          Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="task-title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="What needs to be done?"
          className={inputClass('title')}
          autoFocus
        />
        {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="task-description" className={labelClass}>Description</label>
        <textarea
          id="task-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add details about this task…"
          rows={4}
          className={`${inputClass('description')} resize-none`}
        />
      </div>

      {/* Status + Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="task-status" className={labelClass}>Status</label>
          <select
            id="task-status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className={inputClass('status') + ' cursor-pointer'}
          >
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="task-priority" className={labelClass}>Priority</label>
          <select
            id="task-priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={inputClass('priority') + ' cursor-pointer'}
          >
            {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Category + Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="task-category" className={labelClass}>Category</label>
          <input
            id="task-category"
            name="category"
            type="text"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Work, Personal, Study"
            className={inputClass('category')}
          />
        </div>
        <div>
          <label htmlFor="task-due-date" className={labelClass}>Due Date</label>
          <input
            id="task-due-date"
            name="due_date"
            type="date"
            value={form.due_date}
            onChange={handleChange}
            className={inputClass('due_date') + ' dark:[color-scheme:dark]'}
          />
          {errors.due_date && <p className="text-rose-500 text-xs mt-1">{errors.due_date}</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
        >
          <RiArrowLeftLine /> Back
        </button>
        <button
          id="task-submit-btn"
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 transition-all"
        >
          {loading ? <Spinner size="sm" className="inline" /> : <RiSaveLine />}
          {loading ? 'Saving…' : mode === 'create' ? 'Create Task' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
