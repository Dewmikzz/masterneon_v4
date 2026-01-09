import axios from 'axios'

// Use environment variable if set, otherwise use relative path for production or localhost for development
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  // In production (Vercel), use relative path
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
