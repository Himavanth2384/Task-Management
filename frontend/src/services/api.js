import axios from 'axios'

/**
 * Axios instance pre-configured for the Task Manager API.
 * - Base URL points to the Flask backend (proxied via Vite in dev)
 * - Automatically attaches JWT token from localStorage
 * - Redirects to /login on 401 responses
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// ── Request Interceptor: attach JWT token ─────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tm_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor: handle 401 (token expired / unauthorized) ───────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('tm_token')
      // Only redirect if not already on an auth page
      const authPages = ['/login', '/register']
      if (!authPages.includes(window.location.pathname)) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
