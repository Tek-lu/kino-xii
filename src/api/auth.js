import { request } from './client'

export const login = (body) =>
  request('/login', { method: 'POST', body, gate: false })

export const register = (formData) =>
  request('/register', { method: 'POST', body: formData, gate: false })

export const getMe = () => request('/me', { gate: false }).then((r) => r.data)

export const logout = () => request('/logout', { method: 'POST', gate: false })