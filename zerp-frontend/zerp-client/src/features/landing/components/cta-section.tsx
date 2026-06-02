'use client'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'
import type { Locale } from '@/core/types/common'

interface CtaSectionProps {
  locale: Locale
}

export function CtaSection({ locale }: CtaSectionProps) {
  const { t } = useI18n()
  const theme = useTheme()

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, sm: 10, md: 12 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ px: responsiveLayout.containerPaddingX }}>
        <Box
          sx={{
            position: 'relative',
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: 5,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            overflow: 'hidden',
          }}
        >
          {/* Background pattern */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle at 20% 80%, ${alpha('#fff', 0.1)} 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, ${alpha('#fff', 0.08)} 0%, transparent 40%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Grid overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `linear-gradient(${alpha('#fff', 0.03)} 1px, transparent 1px),
                               linear-gradient(90deg, ${alpha('#fff', 0.03)} 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
              pointerEvents: 'none',
            }}
          />

          <Stack
            alignItems="center"
            gap={{ xs: 3, sm: 4 }}
            sx={{ position: 'relative', textAlign: 'center' }}
          >
            <Stack gap={2} maxWidth="md">
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  fontWeight: 800,
                  letterSpacing: 0,
                  color: '#fff',
                  textWrap: 'balance',
                }}
              >
                {t('landing.ctaTitle')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.125rem' },
                  color: alpha('#fff', 0.85),
                  maxWidth: 520,
                  mx: 'auto',
                  lineHeight: 1.7,
                  textWrap: 'balance',
                }}
              >
                {t('landing.ctaSubtitle')}
              </Typography>
            </Stack>

            <Button
              href={`/${locale}/dashboard`}
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                px: { xs: 4, sm: 5 },
                py: { xs: 1.5, sm: 1.75 },
                fontSize: { xs: '0.9375rem', sm: '1rem' },
                fontWeight: 700,
                borderRadius: 2.5,
                textTransform: 'none',
                bgcolor: '#fff',
                color: 'primary.main',
                boxShadow: `0 8px 32px ${alpha('#000', 0.2)}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#fff',
                  transform: 'translateY(-2px)',
                  boxShadow: `0 12px 40px ${alpha('#000', 0.25)}`,
                },
              }}
            >
              {t('landing.ctaButton')}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
