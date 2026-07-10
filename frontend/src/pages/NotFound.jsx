import React from 'react'
import { Link } from 'react-router-dom'
import { RiCheckboxCircleLine } from 'react-icons/ri'

/**
 * NotFound (404) page — shown when no route matches.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6">
      <div className="text-center max-w-md animate-fade-in">
        {/* Large 404 */}
        <div className="text-[8rem] font-black leading-none bg-gradient-to-br from-indigo-400 to-violet-500 bg-clip-text text-transparent mb-4">
          404
        </div>

        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 flex items-center justify-center mb-6">
          <RiCheckboxCircleLine className="text-indigo-400 text-3xl" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 shadow-lg shadow-indigo-500/25 transition-all"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/tasks"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/5 transition-all"
          >
            My Tasks
          </Link>
        </div>
      </div>
    </div>
  )
}
