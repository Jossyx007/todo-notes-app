/**
 * Date and time helper utilities.
 */

export function todayIso(): string {
  return toIso(new Date())
}

export function toIso(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseIso(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Returns:
 * -1 = overdue
 *  0 = due today
 *  1 = upcoming
 *  null = no due date
 */
export function dueStatus(iso: string | undefined): -1 | 0 | 1 | null {
  if (!iso) return null
  const today = parseIso(todayIso()).getTime()
  const due = parseIso(iso).getTime()
  if (due < today) return -1
  if (due === today) return 0
  return 1
}

export function dueBadgeInfo(iso: string): { label: string; status: -1 | 0 | 1 } {
  const today = parseIso(todayIso()).getTime()
  const due = parseIso(iso).getTime()
  const diffDays = Math.round((due - today) / DAY_MS)

  let label: string
  if (diffDays === 0) {
    label = 'Due Today'
  } else if (diffDays === 1) {
    label = 'Due Tomorrow'
  } else if (diffDays === -1) {
    label = '1 day overdue'
  } else if (diffDays < -1) {
    label = `${Math.abs(diffDays)} days overdue`
  } else if (diffDays <= 7) {
    label = `In ${diffDays} days`
  } else {
    const d = parseIso(iso)
    label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const status = diffDays < 0 ? -1 : diffDays === 0 ? 0 : 1
  return { label, status }
}

export function formatGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function formatCurrentDate(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function timeAgo(timestamp: number): string {
  const now = Date.now()
  const elapsedSec = Math.floor((now - timestamp) / 1000)

  if (elapsedSec < 60) return 'Just now'
  const elapsedMin = Math.floor(elapsedSec / 60)
  if (elapsedMin < 60) return `${elapsedMin}m ago`
  const elapsedHours = Math.floor(elapsedMin / 60)
  if (elapsedHours < 24) return `${elapsedHours}h ago`
  const elapsedDays = Math.floor(elapsedHours / 24)
  if (elapsedDays === 1) return 'Yesterday'
  if (elapsedDays < 7) return `${elapsedDays}d ago`

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp)
  return `${d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} at ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
}
