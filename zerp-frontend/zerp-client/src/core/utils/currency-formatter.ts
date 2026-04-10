import type { Locale } from '@/core/types/common'

const localeMap: Record<Locale, string> = {
  tr: 'tr-TR',
  en: 'en-US',
}

export function formatCurrency(amount: number, locale: Locale, currency = 'TRY'): string {
  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}
