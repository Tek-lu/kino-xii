import { request } from './client'

// multipart, so the avatar can be added later
export const updateProfile = (formData) =>
  request('/profile', { method: 'PUT', body: formData }).then((r) => r.data)