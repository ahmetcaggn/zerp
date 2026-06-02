'use client'

import { Box } from '@mui/material'

import type { Locale } from '@/core/types/common'

import { CtaSection } from './cta-section'
import { FeaturesSection } from './features-section'
import { FooterSection } from './footer-section'
import { HeroSection } from './hero-section'

// ileride kullanilabilir sade zerp-tenant landing page tasarimi
export function OldLandingPage({ locale }: { locale: Locale }) {
  return (
    <Box component="main">
      <HeroSection locale={locale} />
      <FeaturesSection />
      <CtaSection locale={locale} />
      <FooterSection />
    </Box>
  )
}
