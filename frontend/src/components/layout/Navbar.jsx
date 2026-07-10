import React from 'react'
import { RiMenuLine, RiSunLine, RiMoonLine, RiBellLine } from 'react-icons/ri'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

/**
 * Navbar — top bar with hamburger menu, page title, dark mode toggle, and avatar.
 */
export default function Navbar({ onMenuClick, pageTitle }) {
  const { isDark, toggleTheme } = useTheme()
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-4">
        <button
          id="navbar-menu-btn"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          aria-label="Open menu"
        >
          <RiMenuLine className="text-xl" />
        </button>
        <h1 className="text-slate-800 dark:text-white font-semibold text-lg">
          {pageTitle}
        </h1>
      </div>

      {/* Right: actions + avatar */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-indigo-500 transition-all duration-200"
          aria-label="Toggle dark mode"
        >
          {isDark ? <RiSunLine className="text-xl text-amber-400" /> : <RiMoonLine className="text-xl" />}
        </button>

        {/* User avatar */}
        {user && (
          <button
            id="navbar-avatar-btn"
            onClick={() => navigate('/profile')}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm hover:scale-105 transition-transform shadow-md shadow-indigo-500/20"
            aria-label="Go to profile"
          >
            {user.name?.charAt(0).toUpperCase()}
          </button>
        )}
      </div>
    </header>
  )
}
