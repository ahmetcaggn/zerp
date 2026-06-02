'use client'

import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded'
import InventoryRoundedIcon from '@mui/icons-material/InventoryRounded'
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import { Box, Container, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import type { ReactElement } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'

interface FeatureItem {
  icon: ReactElement
  titleKey: 'landing.feature1Title' | 'landing.feature2Title' | 'landing.feature3Title' | 'landing.feature4Title'
  descKey: 'landing.feature1Desc' | 'landing.feature2Desc' | 'landing.feature3Desc' | 'landing.feature4Desc'
  gradient: string
}

export function FeaturesSection() {
  const { t } = useI18n()
  const theme = useTheme()

  const features: FeatureItem[] = [
    {
      icon: <QrCode2RoundedIcon />,
      titleKey: 'landing.feature1Title',
      descKey: 'landing.feature1Desc',
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
    },
    {
      icon: <ReceiptLongRoundedIcon />,
      titleKey: 'landing.feature2Title',
      descKey: 'landing.feature2Desc',
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
    },
    {
      icon: <InventoryRoundedIcon />,
      titleKey: 'landing.feature3Title',
      descKey: 'landing.feature3Desc',
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.light, 0.05)} 100%)`,
    },
    {
      icon: <AnalyticsRoundedIcon />,
      titleKey: 'landing.feature4Title',
      descKey: 'landing.feature4Desc',
      gradient: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.light, 0.05)} 100%)`,
    },
  ]

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, sm: 10, md: 14 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background accent */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          background: `radial-gradient(ellipse 70% 50% at 50% 50%, ${alpha(theme.palette.primary.main, 0.03)}, transparent)`,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ px: responsiveLayout.containerPaddingX, position: 'relative' }}>
        <Stack gap={{ xs: 6, sm: 8 }}>
          {/* Section Header */}
          <Stack alignItems="center" textAlign="center" gap={2}>
            <Typography
              variant="overline"
              sx={{
                color: 'primary.main',
                fontWeight: 700,
                letterSpacing: '0.1em',
                fontSize: '0.75rem',
              }}
            >
              Ozellikler
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontWeight: 800,
                letterSpacing: '-0.03em',
                textWrap: 'balance',
              }}
            >
              {t('landing.featuresTitle')}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.125rem' },
                maxWidth: 480,
                lineHeight: 1.7,
              }}
            >
              {t('landing.featuresSubtitle')}
            </Typography>
          </Stack>

          {/* Features Grid - Modern card layout */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: { xs: 2, sm: 2.5 },
            }}
          >
            {features.map((feature, index) => (
              <Box
                key={index}
                sx={{
                  p: { xs: 3, sm: 4 },
                  borderRadius: 4,
                  background: feature.gradient,
                  border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'default',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.08)}`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                  },
                }}
              >
                <Stack gap={2.5}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      bgcolor: alpha(theme.palette.background.paper, 0.8),
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'primary.main',
                      '& .MuiSvgIcon-root': {
                        fontSize: 24,
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
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {t(feature.titleKey)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                        lineHeight: 1.7,
                      }}
                    >
                      {t(feature.descKey)}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
