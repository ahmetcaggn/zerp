'use client'

import { Box, Container, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'

interface StatItem {
  valueKey: 'landing.stat1Value' | 'landing.stat2Value' | 'landing.stat3Value' | 'landing.stat4Value'
  labelKey: 'landing.stat1Label' | 'landing.stat2Label' | 'landing.stat3Label' | 'landing.stat4Label'
}

const STATS: StatItem[] = [
  { valueKey: 'landing.stat1Value', labelKey: 'landing.stat1Label' },
  { valueKey: 'landing.stat2Value', labelKey: 'landing.stat2Label' },
  { valueKey: 'landing.stat3Value', labelKey: 'landing.stat3Label' },
  { valueKey: 'landing.stat4Value', labelKey: 'landing.stat4Label' },
]

export function StatsSection() {
  const { t } = useI18n()
  const theme = useTheme()

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, sm: 8, md: 10 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: responsiveLayout.containerPaddingX }}>
        <Stack gap={{ xs: 4, sm: 5 }}>
          {/* Section Header */}
          <Typography
            variant="h2"
            textAlign="center"
            sx={{
              fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2.25rem' },
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            {t('landing.statsTitle')}
          </Typography>

          {/* Stats Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 3, sm: 4 },
            }}
          >
            {STATS.map((stat, index) => (
              <Stack
                key={index}
                alignItems="center"
                textAlign="center"
                gap={0.75}
                sx={{
                  p: { xs: 2, sm: 3 },
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    fontWeight: 800,
                    color: 'primary.main',
                    lineHeight: 1,
                  }}
                >
                  {t(stat.valueKey)}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    fontWeight: 500,
                  }}
                >
                  {t(stat.labelKey)}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
