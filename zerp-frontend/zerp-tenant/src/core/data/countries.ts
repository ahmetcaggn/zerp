import type { Locale } from '@/core/types/common'

import countriesByLocale from './countries.json'

export interface CountryOption {
  code: string
  label: string
}

const PRIMARY_COUNTRY_CODE = 'TR'
const FALLBACK_LOCALES: Locale[] = ['tr', 'en']

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase('en-US')
}

function getCountryCodes(locale: Locale): string[] {
  const localeCodes = countriesByLocale[locale] ?? []

  if (localeCodes.length > 0) {
    return localeCodes
  }

  return countriesByLocale.tr
}

function getLocaleDisplayName(locale: Locale, code: string): string {
  return new Intl.DisplayNames([locale], { type: 'region' }).of(code) ?? code
}

export function resolveCountryCode(locale: Locale, value: string | null | undefined): string {
  const normalizedValue = value?.trim()

  if (!normalizedValue) {
    return ''
  }

  const uppercasedValue = normalizedValue.toLocaleUpperCase('en-US')
  const supportedCodes = new Set(countriesByLocale.tr)

  if (supportedCodes.has(uppercasedValue)) {
    return uppercasedValue
  }

  const localesToCheck = [locale, ...FALLBACK_LOCALES.filter((candidate) => candidate !== locale)]

  for (const countryCode of getCountryCodes(locale)) {
    for (const candidateLocale of localesToCheck) {
      const candidateLabel = getLocaleDisplayName(candidateLocale, countryCode)
      if (normalizeText(candidateLabel) === normalizeText(normalizedValue)) {
        return countryCode
      }
    }
  }

  return ''
}

export function getCountryLabel(locale: Locale, value: string | null | undefined): string {
  const countryCode = resolveCountryCode(locale, value)

  if (!countryCode) {
    return value?.trim() ?? ''
  }

  return getLocaleDisplayName(locale, countryCode)
}

export function getCountryOptions(locale: Locale): CountryOption[] {
  const collator = new Intl.Collator(locale, { usage: 'sort', sensitivity: 'base' })

  return [...getCountryCodes(locale)]
    .sort((left, right) => {
      if (left === PRIMARY_COUNTRY_CODE) {
        return -1
      }

      if (right === PRIMARY_COUNTRY_CODE) {
        return 1
      }

      const leftLabel = getLocaleDisplayName(locale, left)
      const rightLabel = getLocaleDisplayName(locale, right)

      return collator.compare(leftLabel, rightLabel)
    })
    .map((code) => ({
      code,
      label: getLocaleDisplayName(locale, code),
    }))
}
