import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  RiDashboardLine,
  RiTaskLine,
  RiAddCircleLine,
  RiUser3Line,
  RiLogoutBoxLine,
  RiCheckboxCircleLine,
} from 'react-icons/ri'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const navItems = [
  { to: '/dashboard', icon: RiDashboardLine, label: 'Dashboard' },
  { to: '/tasks',     icon: RiTaskLine,       label: 'My Tasks' },
  { to: '/tasks/new', icon: RiAddCircleLine,  label: 'New Task' },
  { to: '/profile',   icon: RiUser3Line,      label: 'Profile' },
]

/**
 * Sidebar — persistent left navigation with active route highlighting.
 */
export default function Sidebar({ isOpen, onClose }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64 flex flex-col
          bg-gradient-to-b from-indigo-950 to-slate-950
          border-r border-white/5
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <RiCheckboxCircleLine className="text-white text-xl" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">TaskFlow</p>
            <p className="text-indigo-300 text-xs">Pro</p>
          </div>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-4 border-b border-white/5">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.name}</p>
                <p className="text-slate-400 text-xs truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${isActive
                  ? 'bg-indigo-500/20 text-indigo-300 shadow-inner border border-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Icon className="text-lg shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            id="sidebar-logout-btn"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-200"
          >
            <RiLogoutBoxLine className="text-lg" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
