import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  RiTaskLine, RiTimeLine, RiPlayCircleLine,
  RiCheckboxCircleLine, RiAlertLine, RiAddCircleLine,
  RiArrowRightLine,
} from 'react-icons/ri'
import { taskService } from '../services/taskService'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/common/StatCard'
import { FullPageSpinner } from '../components/common/Spinner'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const PRIORITY_BADGE = {
  High:   'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
  Medium: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  Low:    'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400',
}
const STATUS_BADGE = {
  Pending:     'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  Completed:   'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
}

/**
 * Dashboard page — shows stats, a motivational greeting, and recent tasks.
 */
export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, tasksData] = await Promise.all([
          taskService.getStats(),
          taskService.getTasks({ limit: 5, sort_by: 'created_at', order: 'desc' }),
        ])
        setStats(statsData)
        setRecent(tasksData.tasks)
      } catch {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <FullPageSpinner />

  const statCards = [
    { label: 'Total Tasks',       value: stats?.total,        icon: RiTaskLine,           color: 'bg-gradient-to-br from-indigo-400 to-violet-500' },
    { label: 'Pending',           value: stats?.pending,       icon: RiTimeLine,           color: 'bg-gradient-to-br from-amber-400 to-orange-500' },
    { label: 'In Progress',       value: stats?.in_progress,   icon: RiPlayCircleLine,     color: 'bg-gradient-to-br from-blue-400 to-cyan-500' },
    { label: 'Completed',         value: stats?.completed,     icon: RiCheckboxCircleLine, color: 'bg-gradient-to-br from-emerald-400 to-teal-500' },
    { label: 'High Priority',     value: stats?.high_priority, icon: RiAlertLine,          color: 'bg-gradient-to-br from-rose-400 to-pink-500' },
  ]

  const completionRate = stats?.total
    ? Math.round((stats.completed / stats.total) * 100)
    : 0

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <Link
          to="/tasks/new"
          id="dashboard-create-task-btn"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 shadow-lg shadow-indigo-500/25 transition-all w-fit"
        >
          <RiAddCircleLine className="text-lg" />
          New Task
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map(card => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Completion progress */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/5 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-slate-700 dark:text-slate-200 font-semibold text-sm">Overall Completion</p>
          <p className="text-slate-800 dark:text-white font-bold text-lg">{completionRate}%</p>
        </div>
        <div className="h-2.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <p className="text-slate-400 text-xs mt-2">
          {stats?.completed} of {stats?.total} tasks completed
        </p>
      </div>

      {/* Recent tasks */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-white/5">
          <h3 className="font-semibold text-slate-800 dark:text-white">Recent Tasks</h3>
          <Link
            to="/tasks"
            className="flex items-center gap-1 text-indigo-500 hover:text-indigo-400 text-sm font-medium transition-colors"
          >
            View all <RiArrowRightLine />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">✨</div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">No tasks yet. Create your first one!</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {recent.map(task => (
              <li
                key={task.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-white/3 cursor-pointer transition-colors"
                onClick={() => navigate(`/tasks/${task.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 dark:text-slate-200 font-medium text-sm truncate">{task.title}</p>
                  {task.category && (
                    <p className="text-slate-400 text-xs mt-0.5">{task.category}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PRIORITY_BADGE[task.priority] || ''}`}>
                    {task.priority}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[task.status] || ''}`}>
                    {task.status}
                  </span>
                  {task.due_date && (
                    <span className="text-slate-400 text-xs hidden sm:inline">
                      {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
