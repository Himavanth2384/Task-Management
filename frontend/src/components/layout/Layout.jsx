import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Outlet, useLocation } from 'react-router-dom'

/**
 * Maps URL paths to human-readable page titles for the Navbar.
 */
const PAGE_TITLES = {
  '/dashboard':  'Dashboard',
  '/tasks':      'My Tasks',
  '/tasks/new':  'Create Task',
  '/profile':    'Profile',
}

/**
 * Layout — main app shell with Sidebar, Navbar, and scrollable content area.
 * Uses React Router's <Outlet /> to render the active page.
 */
export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Derive page title from path (handles /tasks/:id/edit too)
  const getPageTitle = () => {
    const path = location.pathname
    if (PAGE_TITLES[path]) return PAGE_TITLES[path]
    if (path.startsWith('/tasks/') && path.endsWith('/edit')) return 'Edit Task'
    if (path.startsWith('/tasks/')) return 'Task Details'
    return 'TaskFlow'
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          pageTitle={getPageTitle()}
        />

        {/* Scrollable page area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
