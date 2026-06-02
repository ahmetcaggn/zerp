'use client'

import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

import { appConfig } from '@/core/config/app-config'
import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'

export function FooterSection() {
  const { t } = useI18n()
  const theme = useTheme()

  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 4, sm: 5 },
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg" sx={{ px: responsiveLayout.containerPaddingX }}>
        <Stack gap={3}>
          {/* Top Section */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            gap={3}
          >
            {/* Logo & Tagline */}
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <StorefrontRoundedIcon sx={{ fontSize: 22, color: 'primary.main' }} />
              </Box>
              <Stack gap={0}>
                <Typography fontWeight={700} fontSize="1rem">
                  {appConfig.app.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('landing.footerTagline')}
                </Typography>
              </Stack>
            </Stack>

            {/* Links */}
            <Stack direction="row" gap={{ xs: 2.5, sm: 4 }} flexWrap="wrap">
              <Link
                href="#"
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: '0.875rem', fontWeight: 500 }}
              >
                {t('landing.footerPrivacy')}
              </Link>
              <Link
                href="#"
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: '0.875rem', fontWeight: 500 }}
              >
                {t('landing.footerTerms')}
              </Link>
              <Link
                href="#"
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: '0.875rem', fontWeight: 500 }}
              >
                {t('landing.footerContact')}
              </Link>
            </Stack>
          </Stack>

          <Divider />

          {/* Copyright */}
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign={{ xs: 'center', sm: 'left' }}
          >
            {t('landing.footerCopyright')}
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
