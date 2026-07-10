import api from './api'

/**
 * Authentication API service — wraps all auth-related endpoints.
 */
export const authService = {
  /**
   * Register a new user.
   * @param {Object} data - { name, email, password }
   * @returns {Promise<{user, access_token}>}
   */
  register: async (data) => {
    const res = await api.post('/auth/register', data)
    return res.data.data
  },

  /**
   * Log in an existing user.
   * @param {Object} data - { email, password }
   * @returns {Promise<{user, access_token}>}
   */
  login: async (data) => {
    const res = await api.post('/auth/login', data)
    return res.data.data
  },

  /**
   * Get the authenticated user's profile.
   * @returns {Promise<{user}>}
   */
  getProfile: async () => {
    const res = await api.get('/auth/profile')
    return res.data.data
  },
}
