import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AuthContext } from './authContext'
import { registerLoginGate, tokenStore } from '../api/client'
import { getMe, logout as apiLogout } from '../api/auth'
import LoginModal from '../components/auth/LoginModal'
import RegisterModal from '../components/auth/RegisterModal'

export default function AuthProvider({ children }) {
  const qc = useQueryClient()
  const [user, setUser] = useState(null)
  const [booting, setBooting] = useState(() => !!tokenStore.get())
  const [modal, setModal] = useState(null) // 'login' | 'register' | null
  const pending = useRef(null) // { run(user), cancel?() }

  // Restore session
  useEffect(() => {
    if (!tokenStore.get()) return
    getMe()
      .then(setUser)
      .catch(() => tokenStore.clear()) // stale token -> guest
      .finally(() => setBooting(false))
  }, [])

  // Closing the modal without logging in cancels the interrupted action
  const closeModal = useCallback(() => {
    setModal(null)
    pending.current?.cancel?.()
    pending.current = null
  }, [])

  // Run `action` now if logged in, otherwise log in first, then run it
  const requireAuth = useCallback(
    (action) => {
      if (user) return action(user)
      pending.current = { run: action }
      setModal('login')
    },
    [user],
  )

  // API 401: session died. Clear it, ask for login, resolve after success
  useEffect(() => {
    registerLoginGate(
      () =>
        new Promise((resolve, reject) => {
          tokenStore.clear()
          setUser(null)
          pending.current = { run: resolve, cancel: () => reject(new Error('cancelled')) }
          setModal('login')
        }),
    )
  }, [])

  const onAuthSuccess = useCallback(
    ({ user, token }) => {
      tokenStore.set(token)
      setUser(user)
      const p = pending.current
      pending.current = null
      setModal(null)
      qc.invalidateQueries() // refetch with the new identity (isNotified etc.)
      p?.run(user) // continue the interrupted action
    },
    [qc],
  )

  const logout = useCallback(async () => {
    try { await apiLogout() } catch { /* clear locally regardless */ }
    tokenStore.clear()
    setUser(null)
    qc.clear()
  }, [qc])

  const value = useMemo(
    () => ({
      user,
      setUser,
      booting,
      profileComplete: !!user?.profileComplete,
      openModal: setModal,
      closeModal,
      requireAuth,
      onAuthSuccess,
      logout,
    }),
    [user, booting, closeModal, requireAuth, onAuthSuccess, logout],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
      {modal === 'login' && <LoginModal />}
      {modal === 'register' && <RegisterModal />}
    </AuthContext.Provider>
  )
}