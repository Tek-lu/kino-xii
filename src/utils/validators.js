const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const required = (label) => (v) => (!v?.trim() ? `${label} is required` : undefined)

export const emailRule = (v) =>
  !v ? 'Email is required' : !EMAIL_RE.test(v) ? 'Please enter a valid email address' : undefined

export const passwordRule = (v) =>
  !v ? 'Password is required' : v.length < 3 ? 'Password must be at least 3 characters' : undefined