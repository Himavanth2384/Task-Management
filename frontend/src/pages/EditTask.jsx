import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { taskService } from '../services/taskService'
import TaskForm from '../components/tasks/TaskForm'
import { FullPageSpinner } from '../components/common/Spinner'
import { toast } from 'react-toastify'

/**
 * EditTask page — loads an existing task, pre-fills the form, and submits updates.
 */
export default function EditTask() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await taskService.getTask(id)
        setTask({
          ...data.task,
          // Normalize date for the date input
          due_date: data.task.due_date ? data.task.due_date.substring(0, 10) : '',
        })
      } catch (err) {
        toast.error(err.response?.data?.message || 'Task not found.')
        navigate('/tasks')
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [id])

  const handleSubmit = async (formData) => {
    setLoading(true)
    try {
      await taskService.updateTask(id, formData)
      toast.success('Task updated successfully!')
      navigate(`/tasks/${id}`)
    } catch (err) {
      const apiErrors = err.response?.data?.errors
      if (apiErrors) {
        const firstErr = Object.values(apiErrors)[0]
        toast.error(Array.isArray(firstErr) ? firstErr[0] : firstErr)
      } else {
        toast.error(err.response?.data?.message || 'Failed to update task.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <FullPageSpinner />

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Edit Task</h2>
        <p className="text-slate-400 text-sm mt-1">Update the task details below.</p>
      </div>

      <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/5 p-6">
        <TaskForm
          initialData={task}
          onSubmit={handleSubmit}
          loading={loading}
          mode="edit"
        />
      </div>
    </div>
  )
}
