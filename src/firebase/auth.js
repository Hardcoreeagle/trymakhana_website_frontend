// src/firebase/auth.js — JWT auth via backend API (no Firebase)
const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '')

export async function loginAdmin(email, password) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login failed')
  localStorage.setItem('admin_token', data.token)
  localStorage.setItem('admin_user', JSON.stringify(data.admin))
  return data.admin
}

export async function logoutAdmin() {
  localStorage.removeItem('admin_token')
  localStorage.removeItem('admin_user')
}

export async function getCurrentAdmin() {
  const token = localStorage.getItem('admin_token')
  if (!token) return null
  try {
    const res = await fetch(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      return null
    }
    const data = await res.json()
    return data.admin
  } catch {
    return null
  }
}

export function subscribeToAuth(callback) {
  const token = localStorage.getItem('admin_token')
  const user  = localStorage.getItem('admin_user')
  if (token && user) {
    callback(JSON.parse(user))
  } else {
    callback(null)
  }
  return () => {}
}
