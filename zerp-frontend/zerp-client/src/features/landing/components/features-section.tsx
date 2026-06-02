'use client'

import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded'
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded'
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import { Box, Container, Paper, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { ReactElement } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'

interface FeatureItem {
  icon: ReactElement
  titleKey: 'landing.feature1Title' | 'landing.feature2Title' | 'landing.feature3Title' | 'landing.feature4Title'
  descKey: 'landing.feature1Desc' | 'landing.feature2Desc' | 'landing.feature3Desc' | 'landing.feature4Desc'
}

const FEATURES: FeatureItem[] = [
  {
    icon: <QrCode2RoundedIcon />,
    titleKey: 'landing.feature1Title',
    descKey: 'landing.feature1Desc',
  },
  {
    icon: <ReceiptLongRoundedIcon />,
    titleKey: 'landing.feature2Title',
    descKey: 'landing.feature2Desc',
  },
  {
    icon: <InventoryRoundedIcon />,
    titleKey: 'landing.feature3Title',
    descKey: 'landing.feature3Desc',
  },
  {
    icon: <AnalyticsRoundedIcon />,
    titleKey: 'landing.feature4Title',
    descKey: 'landing.feature4Desc',
  },
]

export function FeaturesSection() {
  const { t } = useI18n()
  const theme = useTheme()

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, sm: 10, md: 12 },
        bgcolor: alpha(theme.palette.background.paper, 0.4),
      }}
    >
      <Container maxWidth="lg" sx={{ px: responsiveLayout.containerPaddingX }}>
        <Stack gap={{ xs: 5, sm: 6, md: 8 }}>
          {/* Section Header */}
          <Stack alignItems="center" textAlign="center" gap={1.5}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontWeight: 700,
                letterSpacing: '-0.02em',
              }}
            >
              {t('landing.featuresTitle')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.125rem' },
                maxWidth: 520,
              }}
            >
              {t('landing.featuresSubtitle')}
            </Typography>
          </Stack>

          {/* Features Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: { xs: 2.5, sm: 3 },
            }}
          >
            {FEATURES.map((feature, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 3,
                  transition: 'transform 200ms ease, box-shadow 200ms ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                }}
              >
                <Stack gap={2}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'primary.main',
                      '& .MuiSvgIcon-root': {
                        fontSize: 26,
                      },
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Stack gap={1}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: '1.125rem', sm: '1.25rem' },
                        fontWeight: 600,
                      }}
                    >
                      {t(feature.titleKey)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                        lineHeight: 1.65,
                      }}
                    >
                      {t(feature.descKey)}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
