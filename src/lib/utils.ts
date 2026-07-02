export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

/** Local-timezone yyyy-MM-dd. */
export function toDayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function dayKeyToDate(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysBetween(aKey: string, bKey: string): number {
  const ms = dayKeyToDate(bKey).getTime() - dayKeyToDate(aKey).getTime()
  return Math.round(ms / 86_400_000)
}

export function addDays(key: string, n: number): string {
  const d = dayKeyToDate(key)
  d.setDate(d.getDate() + n)
  return toDayKey(d)
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function formatDayKey(key: string): string {
  const d = dayKeyToDate(key)
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`
}

export function monthLabel(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`
}

/** Deterministic PRNG so daily quests are stable for a given date. */
export function seededRng(seed: string): () => number {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}
