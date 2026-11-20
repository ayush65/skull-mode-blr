const BUSINESS_TIME_ZONE = 'Asia/Kolkata'

export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function todayInBengaluru(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

export function addRentalDays(startDate: string, durationDays: number): string {
  if (!isCalendarDate(startDate) || !Number.isInteger(durationDays) || durationDays < 1) {
    throw new Error('Invalid rental dates')
  }

  const date = new Date(`${startDate}T00:00:00.000Z`)
  date.setUTCDate(date.getUTCDate() + durationDays)
  return date.toISOString().slice(0, 10)
}

export function formatRentalDate(value: string): string {
  if (!isCalendarDate(value)) return value
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: BUSINESS_TIME_ZONE,
  }).format(new Date(`${value}T00:00:00.000Z`))
}
