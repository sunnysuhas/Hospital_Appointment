import axios from 'axios'
import { getApiErrorMessage } from '../utils/apiError'

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:8000/api/'

const normalizedBaseUrl = rawBaseUrl.replace(/\/+$|^\s+|\s+$/g, '')
const API_BASE_URL = normalizedBaseUrl.endsWith('/api')
  ? `${normalizedBaseUrl}/`
  : `${normalizedBaseUrl}/api/`

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config
    error.userMessage = getApiErrorMessage(error)

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.clear()
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/'
      }
    }

    return Promise.reject(error)
  }
)

export default api
