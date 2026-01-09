import axios from 'axios'

// In production (Vercel), use relative paths. In development, use localhost
const getBaseURL = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  // In production, use relative path (works with Vercel)
  if (import.meta.env.PROD) {
    return '/api'
  }
  // In development, use localhost
  return 'http://localhost:5000/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  // Increase timeout because sending emails (SMTP) can occasionally take longer
  // than the default 15s when mail servers are slow. 60s is a reasonable tradeoff.
  timeout: 60000,
})

export default api
