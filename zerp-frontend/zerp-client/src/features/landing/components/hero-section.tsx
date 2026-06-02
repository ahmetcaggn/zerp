'use client'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'
import type { Locale } from '@/core/types/common'

interface HeroSectionProps {
  locale: Locale
}

export function HeroSection({ locale }: HeroSectionProps) {
  const { t } = useI18n()
  const theme = useTheme()

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 'calc(100vh - 60px)', sm: 'calc(100vh - 68px)' },
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 75% 45% at 50% 0%, ${alpha(theme.palette.primary.main, 0.12)}, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      <Container
        maxWidth="lg"
        sx={{ px: responsiveLayout.containerPaddingX, position: 'relative' }}
      >
        <Stack
          alignItems="center"
          textAlign="center"
          gap={{ xs: 3, sm: 4 }}
          sx={{ py: { xs: 6, sm: 8, md: 10 } }}
        >
          <Typography
            variant="overline"
            sx={{
              color: 'primary.main',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            {locale === 'tr'
              ? 'Restoran Yonetiminde Yeni Nesil'
              : 'Next generation restaurant management'}
          </Typography>

          {/* Headlines */}
          <Stack gap={{ xs: 2.5, sm: 3 }} maxWidth="lg">
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem', lg: '4.25rem' },
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: 0,
                textWrap: 'balance',
                color: 'text.primary',
              }}
            >
              {t('landing.heroTitle')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                lineHeight: 1.7,
                maxWidth: 640,
                mx: 'auto',
                textWrap: 'balance',
              }}
            >
              {t('landing.heroSubtitle')}
            </Typography>
          </Stack>

          {/* CTA Buttons */}
          <Stack
            direction="row"
            justifyContent="center"
            sx={{ width: { xs: '100%', sm: 'auto' }, mt: 1 }}
          >
            <Button
              href={`/${locale}/dashboard`}
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                px: { xs: 3.5, sm: 4 },
                py: { xs: 1.5, sm: 1.75 },
                fontSize: { xs: '0.9375rem', sm: '1rem' },
                fontWeight: 600,
                borderRadius: 2.5,
                textTransform: 'none',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
            >
              {t('landing.heroCta')}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
