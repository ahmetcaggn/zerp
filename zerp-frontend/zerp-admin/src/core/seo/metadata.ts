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

const zerpIcon = {
  url: '/zerp_icon_rounded.svg',
  width: 512,
  height: 512,
  alt: 'ZERP',
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
    metadataBase: new URL(appConfig.app.baseUrl),
    title,
    description,
    manifest: '/manifest.json',
    icons: {
      icon: [
        { url: '/zerp_icon_white.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico', sizes: 'any' },
      ],
      shortcut: [{ url: '/zerp_icon_white.svg', type: 'image/svg+xml' }],
      apple: [{ url: '/zerp_icon_rounded.svg', type: 'image/svg+xml' }],
    },
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
      images: [zerpIcon],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [zerpIcon.url],
    },
    other: {
      'x-locale-name': localeNames[locale],
    },
  }
}
