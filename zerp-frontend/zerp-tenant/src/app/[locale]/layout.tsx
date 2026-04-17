import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { isLocale } from '@/core/constants/locales'
import { getMessages } from '@/core/i18n/messages'
import { AppProviders } from '@/core/providers/app-providers'
import { buildMetadata } from '@/core/seo/metadata'
import type { Locale } from '@/core/types/common'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!isLocale(locale)) {
    return buildMetadata({ locale: 'tr', title: 'Not Found' })
  }

  return buildMetadata({
    locale,
    title: `ZERP ${locale.toUpperCase()}`,
    path: `/${locale}`,
  })
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const safeLocale = locale as Locale
  const messages = getMessages(safeLocale)

  return (
    <AppProviders locale={safeLocale} messages={messages}>
      {children}
    </AppProviders>
  )
}
