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
        bgcolor: alpha(theme.palette.primary.main, 0.04),
      }}
    >
      <Container maxWidth="lg" sx={{ px: responsiveLayout.containerPaddingX }}>
        <Box
          sx={{
            p: { xs: 4, sm: 6, md: 8 },
            borderRadius: 4,
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            textAlign: 'center',
          }}
        >
          <Stack alignItems="center" gap={{ xs: 2.5, sm: 3 }}>
            <Stack gap={1.5} maxWidth="lg">
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  textWrap: 'balance',
                }}
              >
                {t('landing.ctaTitle')}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.125rem' },
                  maxWidth: 560,
                  mx: 'auto',
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
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                mt: 1,
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
              {t('landing.ctaButton')}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
