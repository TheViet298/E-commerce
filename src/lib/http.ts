import axios from 'axios'
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
})
http.interceptors.request.use(cfg => {
  const t = localStorage.getItem('token')
  if (t) {
    cfg.headers = cfg.headers ?? {}
    cfg.headers.Authorization = `Bearer ${t}`
  }
  return cfg
})
