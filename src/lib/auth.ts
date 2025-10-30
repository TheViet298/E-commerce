import { http } from './http'

export type JwtPayload = { sub: string; role?: 'ADMIN' | 'USER'; exp?: number }

// Login APIs
export async function login(username: string, password: string) {
  const { data } = await http.post<{token:string}>('/auth/login', { username, password })
  localStorage.setItem('token', data.token)
  return data.token
}

// Register APIs
export async function registerUser(username: string, password: string) {
  return http.post('/auth/register-user', { username, password })
}
export async function registerAdmin(username: string, password: string) {
  return http.post('/auth/register-admin', { username, password })
}

export function logout() { localStorage.removeItem('token') }
export function getToken() { return localStorage.getItem('token') }

export function getPayload(): JwtPayload | null {
  const t = getToken(); if (!t) return null
  try {
    const base = t.split('.')[1]
    const json = JSON.parse(atob(base.replace(/-/g, '+').replace(/_/g, '/')))
    return json
  } catch { return null }
}
export function getRole(): 'ADMIN' | 'USER' | null { return getPayload()?.role ?? null }
export function isAuthed() { return !!getToken() }
