import type { Locale } from '@/core/types/common'

const localeMap: Record<Locale, string> = {
  tr: 'tr-TR',
  en: 'en-US',
}

function toDate(value: Date | string): Date | null {
  const date = typeof value === 'string' ? new Date(value) : value
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value: Date | string, locale: Locale): string {
  const date = toDate(value)
  if (!date) {
    return '—'
  }

  return new Intl.DateTimeFormat(localeMap[locale], {
    dateStyle: 'medium',
  }).format(date)
}

export function formatDateTime(value: Date | string | null | undefined, locale: Locale): string {
  if (!value) {
    return '—'
  }

  const date = toDate(value)
  if (!date) {
    return '—'
  }

  return new Intl.DateTimeFormat(localeMap[locale], {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
