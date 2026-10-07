import { useState } from 'react'

export function useForm(initial, rules) {
  const [values, setValues] = useState(initial)
  const [touched, setTouched] = useState({})
  const [serverErrors, setServerErrors] = useState({})

  const clientError = (name) => rules[name]?.(values[name], values)

  const field = (name) => {
    const error = serverErrors[name] || (touched[name] ? clientError(name) : undefined)
    return {
      name,
      value: values[name],
      onChange: (e) => {
        const value = e.target.value
        setValues((v) => ({ ...v, [name]: value }))
        if (serverErrors[name]) {
          setServerErrors((s) => {
            const next = { ...s }
            delete next[name]
            return next
          })
        }
      },
      onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
      error,
      valid: !!touched[name] && !error && !!values[name],
    }
  }

  const validateAll = () => {
    setTouched(Object.fromEntries(Object.keys(rules).map((k) => [k, true])))
    return Object.keys(rules).every((k) => !clientError(k))
  }

  // API 422: { field: ["message"] } -> show first message per field
  const applyApiErrors = (errors = {}) =>
    setServerErrors(Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v[0]])))

  return { values, field, validateAll, applyApiErrors }
}