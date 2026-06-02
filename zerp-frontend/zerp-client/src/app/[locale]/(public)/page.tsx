import { Box } from '@mui/material'
import { notFound } from 'next/navigation'

import { isLocale } from '@/core/constants/locales'
import type { Locale } from '@/core/types/common'
import {
  CtaSection,
  FeaturesSection,
  FooterSection,
  HeroSection,
  StatsSection,
} from '@/features/landing'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return (
    <Box component="main">
      <HeroSection locale={locale as Locale} />
      <FeaturesSection />
      <StatsSection />
      <CtaSection locale={locale as Locale} />
      <FooterSection />
    </Box>
  )
}
