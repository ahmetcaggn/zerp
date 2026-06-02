import { notFound } from 'next/navigation'

import { isLocale } from '@/core/constants/locales'
import { WelcomeScreen } from '@/modules/restaurants/ui/welcome-screen'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return <WelcomeScreen />
}
