import api from './api'

/**
 * Task API service — wraps all task-related endpoints.
 */
export const taskService = {
  /**
   * Get paginated, filtered, sorted list of tasks.
   * @param {Object} params - { status, priority, category, search, sort_by, order, page, limit }
   * @returns {Promise<{tasks, pagination}>}
   */
  getTasks: async (params = {}) => {
    const res = await api.get('/tasks', { params })
    return res.data.data
  },

  /**
   * Get dashboard statistics.
   * @returns {Promise<{total, pending, in_progress, completed, high_priority}>}
   */
  getStats: async () => {
    const res = await api.get('/tasks/stats')
    return res.data.data
  },

  /**
   * Get a single task by ID.
   * @param {number} id
   * @returns {Promise<{task}>}
   */
  getTask: async (id) => {
    const res = await api.get(`/tasks/${id}`)
    return res.data.data
  },

  /**
   * Create a new task.
   * @param {Object} data - { title, description, status, priority, category, due_date }
   * @returns {Promise<{task}>}
   */
  createTask: async (data) => {
    const res = await api.post('/tasks', data)
    return res.data.data
  },

  /**
   * Update an existing task (partial update supported).
   * @param {number} id
   * @param {Object} data
   * @returns {Promise<{task}>}
   */
  updateTask: async (id, data) => {
    const res = await api.put(`/tasks/${id}`, data)
    return res.data.data
  },

  /**
   * Delete a task by ID.
   * @param {number} id
   * @returns {Promise<void>}
   */
  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`)
  },
}
