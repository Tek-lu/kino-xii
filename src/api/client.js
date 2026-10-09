const BASE =
  import.meta.env.VITE_API_URL ?? 'https://api.kinoxii.redberryinternship.ge/api'
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message || 'Request failed')
    this.status = status
    this.errors = body?.errors
    this.contested = body?.contested
  }
}

export const tokenStore = {
  get: () => localStorage.getItem('token'),
  set: (t) => localStorage.setItem('token', t),
  clear: () => localStorage.removeItem('token'),
}

let loginGate = null
export const registerLoginGate = (fn) => { loginGate = fn }

// gate: on 401, open the login modal and replay the request after login
export async function request(path, { method = 'GET', body, gate = true } = {}, retried = false) {
  const headers = { Accept: 'application/json' }
  const token = tokenStore.get()
  if (token) headers.Authorization = `Bearer ${token}`

  let payload = body
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    payload = JSON.stringify(body)
  }

  const res = await fetch(BASE + path, { method, headers, body: payload })
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)

  if (res.status === 401 && gate && !retried && loginGate) {
    try {
      await loginGate()
    } catch {
      throw new ApiError(401, data) // user closed the modal
    }
    return request(path, { method, body, gate }, true)
  }

  if (!res.ok) throw new ApiError(res.status, data)
  return data
}
