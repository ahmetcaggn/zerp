'use client'

import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded'
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
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '200%', md: '120%' },
          height: { xs: '200%', md: '120%' },
          background: `radial-gradient(ellipse at center, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ px: responsiveLayout.containerPaddingX, position: 'relative' }}>
        <Stack
          alignItems="center"
          textAlign="center"
          gap={{ xs: 4, sm: 5 }}
          sx={{ py: { xs: 6, sm: 8, md: 10 } }}
        >
          {/* Logo/Icon */}
          <Box
            sx={{
              width: { xs: 72, sm: 88 },
              height: { xs: 72, sm: 88 },
              borderRadius: '24px',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <RestaurantMenuRoundedIcon
              sx={{ fontSize: { xs: 36, sm: 44 }, color: 'primary.main' }}
            />
          </Box>

          {/* Headlines */}
          <Stack gap={{ xs: 2, sm: 2.5 }} maxWidth="md">
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                textWrap: 'balance',
              }}
            >
              {t('landing.heroTitle')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                lineHeight: 1.6,
                maxWidth: 600,
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
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              href={`/${locale}/dashboard`}
              variant="contained"
              size="large"
              sx={{
                px: { xs: 4, sm: 5 },
                py: { xs: 1.5, sm: 1.75 },
                fontSize: { xs: '0.9375rem', sm: '1rem' },
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: `0 4px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                '&:hover': {
                  boxShadow: `0 6px 32px ${alpha(theme.palette.primary.main, 0.35)}`,
                },
              }}
            >
              {t('landing.heroCta')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: { xs: 4, sm: 5 },
                py: { xs: 1.5, sm: 1.75 },
                fontSize: { xs: '0.9375rem', sm: '1rem' },
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              {t('landing.heroSecondaryCta')}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
