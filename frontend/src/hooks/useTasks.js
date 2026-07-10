import { useState, useCallback } from 'react'
import { taskService } from '../services/taskService'
import { toast } from 'react-toastify'

/**
 * useTasks — custom hook for task list state management.
 * Handles fetching, filters, pagination, and CRUD operations.
 */
export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    search: '',
    sort_by: 'created_at',
    order: 'desc',
    page: 1,
    limit: 10,
  })

  const fetchTasks = useCallback(async (overrides = {}) => {
    setLoading(true)
    try {
      const params = { ...filters, ...overrides }
      // Remove empty string params
      Object.keys(params).forEach(k => params[k] === '' && delete params[k])
      const data = await taskService.getTasks(params)
      setTasks(data.tasks)
      setPagination(data.pagination)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [filters])

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }, [])

  const setPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  const deleteTask = useCallback(async (id) => {
    try {
      await taskService.deleteTask(id)
      toast.success('Task deleted successfully')
      setTasks(prev => prev.filter(t => t.id !== id))
      setPagination(prev => prev ? { ...prev, total: prev.total - 1 } : prev)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task')
    }
  }, [])

  return {
    tasks,
    pagination,
    loading,
    filters,
    fetchTasks,
    updateFilter,
    setPage,
    deleteTask,
  }
}
