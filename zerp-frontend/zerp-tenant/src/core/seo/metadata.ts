import type { Metadata } from 'next'

import { appConfig } from '@/core/config/app-config'
import type { Locale } from '@/core/types/common'

const localeToOg: Record<Locale, string> = {
  tr: 'tr_TR',
  en: 'en_US',
}

const localeNames: Record<Locale, string> = {
  tr: 'Turkce',
  en: 'English',
}

export function buildMetadata(options?: {
  locale?: Locale
  title?: string
  description?: string
  path?: string
}): Metadata {
  const locale = options?.locale ?? appConfig.locale.defaultLocale
  const title = options?.title ?? 'ZERP'
  const description = options?.description ?? appConfig.seo.description
  const path = options?.path ?? '/'

  const canonical = new URL(path, appConfig.app.baseUrl).toString()

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        tr: `${appConfig.app.baseUrl}/tr`,
        en: `${appConfig.app.baseUrl}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: appConfig.app.name,
      locale: localeToOg[locale],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    other: {
      'x-locale-name': localeNames[locale],
    },
  }
}
