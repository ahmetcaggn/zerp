'use client'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
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
      {/* Modern gradient mesh background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, ${alpha(theme.palette.primary.main, 0.15)}, transparent),
            radial-gradient(ellipse 60% 40% at 100% 50%, ${alpha(theme.palette.primary.light, 0.08)}, transparent),
            radial-gradient(ellipse 50% 30% at 0% 80%, ${alpha(theme.palette.secondary.main, 0.06)}, transparent)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle grid pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${alpha(theme.palette.divider, 0.03)} 1px, transparent 1px),
                           linear-gradient(90deg, ${alpha(theme.palette.divider, 0.03)} 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
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
          gap={{ xs: 4, sm: 5 }}
          sx={{ py: { xs: 6, sm: 8, md: 10 } }}
        >
          {/* Badge */}
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.75,
              borderRadius: 10,
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
              backdropFilter: 'blur(8px)',
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                letterSpacing: '0.02em',
                fontSize: '0.75rem',
              }}
            >
              {locale === 'tr'
                ? 'Restoran Yonetiminde Yeni Nesil'
                : 'Next generation restaurant management'}
            </Typography>
          </Box>

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
                background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${alpha(theme.palette.text.primary, 0.7)} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
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
            direction={{ xs: 'column', sm: 'row' }}
            gap={{ xs: 1.5, sm: 2 }}
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
            <Button
              variant="outlined"
              size="large"
              startIcon={<PlayArrowRoundedIcon sx={{ fontSize: 20 }} />}
              sx={{
                px: { xs: 3.5, sm: 4 },
                py: { xs: 1.5, sm: 1.75 },
                fontSize: { xs: '0.9375rem', sm: '1rem' },
                fontWeight: 600,
                borderRadius: 2.5,
                textTransform: 'none',
                borderColor: alpha(theme.palette.divider, 0.8),
                color: 'text.primary',
                backdropFilter: 'blur(8px)',
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {t('landing.heroSecondaryCta')}
            </Button>
          </Stack>

          {/* Trust indicators */}
          <Stack
            direction="row"
            alignItems="center"
            gap={{ xs: 2, sm: 4 }}
            sx={{ mt: { xs: 2, sm: 3 }, opacity: 0.7 }}
            flexWrap="wrap"
            justifyContent="center"
          >
            {(locale === 'tr'
              ? ['500+ Isletme', '1M+ Siparis', '7/24 Destek']
              : ['500+ Businesses', '1M+ Orders', '24/7 Support']
            ).map((item, index) => (
              <Stack key={index} direction="row" alignItems="center" gap={0.75}>
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                  }}
                />
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {item}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
