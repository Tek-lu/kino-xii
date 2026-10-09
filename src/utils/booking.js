export const money = (n) => {
    const r = Math.round(n * 100) / 100
    return `₾${Number.isInteger(r) ? r : r.toFixed(2)}`
  }
  
  export const priceFor = (sessionPrice, ratio) => sessionPrice * ratio
  
  export const secondsLeft = (iso) =>
    Math.max(0, Math.ceil((new Date(iso) - Date.now()) / 1000))
  
  export const fmtTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  
  export const formatCard = (v) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
  
  export const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 4)
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
  }
  
  export const formatCvv = (v) => v.replace(/\D/g, '').slice(0, 3)