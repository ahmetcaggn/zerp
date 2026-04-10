import type { Locale } from '@/core/types/common'

const localeMap: Record<Locale, string> = {
  tr: 'tr-TR',
  en: 'en-US',
}

export function formatDate(value: Date | string, locale: Locale): string {
  const date = typeof value === 'string' ? new Date(value) : value

  return new Intl.DateTimeFormat(localeMap[locale], {
    dateStyle: 'medium',
  }).format(date)
}
