import React from 'react'
import { useAuth } from '../context/AuthContext'
import { RiUser3Line, RiMailLine, RiCalendarLine, RiShieldCheckLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'

/**
 * Profile page — displays authenticated user's info.
 */
export default function Profile() {
  const { user } = useAuth()

  if (!user) return null

  const joined = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  })

  return (
    <div className="max-w-xl mx-auto animate-fade-in space-y-4">
      {/* Profile header card */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden">
        {/* Banner gradient */}
        <div className="h-24 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

        {/* Avatar */}
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-indigo-500/30 ring-4 ring-white dark:ring-slate-800">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="mt-4">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{user.name}</h1>
            <p className="text-slate-400 text-sm">{user.email}</p>
          </div>

          {/* Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
            <RiShieldCheckLine />
            Verified Account
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/5 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Account Information
        </h2>

        {[
          { icon: RiUser3Line, label: 'Full Name', value: user.name },
          { icon: RiMailLine, label: 'Email Address', value: user.email },
          { icon: RiCalendarLine, label: 'Member Since', value: joined },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0">
              <Icon className="text-indigo-500 text-lg" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{label}</p>
              <p className="text-slate-700 dark:text-slate-200 font-medium">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/5 p-5">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Quick Actions
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/tasks"
            className="px-4 py-2 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all"
          >
            View My Tasks
          </Link>
          <Link
            to="/tasks/new"
            className="px-4 py-2 rounded-xl text-sm font-medium text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-all"
          >
            Create Task
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
