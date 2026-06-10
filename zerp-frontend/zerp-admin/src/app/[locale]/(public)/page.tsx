import { notFound, redirect } from 'next/navigation'

import { isLocale } from '@/core/constants/locales'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  redirect(`/${locale}/login`)
}
