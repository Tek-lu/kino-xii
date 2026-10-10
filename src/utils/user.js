// name shown next to the avatar: first name, or the part of the email before @
export const displayName = (u) =>
  u.fullName?.trim() ? u.fullName.trim().split(/\s+/)[0] : u.email.split('@')[0]

// full name in the dropdown header, same fallback
export const fullDisplayName = (u) =>
  u.fullName?.trim() || u.email.split('@')[0]

// "Meri Sanikidze" -> "MS", "merisanikidze@gmail.com" -> "ME"
export function initials(u) {
  const words = u.fullName?.trim().split(/\s+/).filter(Boolean)
  if (words?.length) {
    return (words[0][0] + (words[1]?.[0] ?? words[0][1] ?? '')).toUpperCase()
  }
  return u.email.split('@')[0].slice(0, 2).toUpperCase()
}