import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { taskService } from '../services/taskService'
import TaskForm from '../components/tasks/TaskForm'
import { toast } from 'react-toastify'

/**
 * CreateTask page — wraps TaskForm for creating new tasks.
 */
export default function CreateTask() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      const data = await taskService.createTask(formData)
      toast.success('Task created successfully! 🎉')
      navigate(`/tasks/${data.task.id}`)
    } catch (err) {
      const apiErrors = err.response?.data?.errors
      if (apiErrors) {
        const firstErr = Object.values(apiErrors)[0]
        toast.error(Array.isArray(firstErr) ? firstErr[0] : firstErr)
      } else {
        toast.error(err.response?.data?.message || 'Failed to create task.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Create New Task</h2>
        <p className="text-slate-400 text-sm mt-1">Fill in the details below to add a new task.</p>
      </div>

      {/* Form card */}
      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/5 p-6">
        <TaskForm onSubmit={handleSubmit} loading={loading} mode="create" />
      </div>
    </div>
  )
}
