import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import TaskList from './pages/TaskList'
import CreateTask from './pages/CreateTask'
import EditTask from './pages/EditTask'
import ViewTask from './pages/ViewTask'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import { FullPageSpinner } from './components/common/Spinner'

/**
 * ProtectedRoute — redirects unauthenticated users to /login.
 * Shows a spinner while the session is being restored.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

/**
 * PublicRoute — redirects authenticated users away from login/register.
 */
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <FullPageSpinner />
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

/**
 * App — root component with routing and global providers.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* Protected routes — wrapped in the app Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="tasks" element={<TaskList />} />
              <Route path="tasks/new" element={<CreateTask />} />
              <Route path="tasks/:id" element={<ViewTask />} />
              <Route path="tasks/:id/edit" element={<EditTask />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Global toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
            theme="colored"
            toastStyle={{ borderRadius: '12px', fontSize: '14px' }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
