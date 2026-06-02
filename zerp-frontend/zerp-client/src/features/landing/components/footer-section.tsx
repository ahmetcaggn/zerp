'use client'

import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import { Box, Container, Link, Stack, Typography } from '@mui/material'
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
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      }}
    >
      <Container maxWidth="lg" sx={{ px: responsiveLayout.containerPaddingX }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', sm: 'center' }}
          gap={3}
        >
          {/* Logo & Tagline */}
          <Stack direction="row" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <StorefrontRoundedIcon sx={{ fontSize: 18, color: '#fff' }} />
            </Box>
            <Stack gap={0}>
              <Typography fontWeight={700} fontSize="0.9375rem" letterSpacing="-0.01em">
                {appConfig.app.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                {t('landing.footerTagline')}
              </Typography>
            </Stack>
          </Stack>

          {/* Links */}
          <Stack direction="row" gap={{ xs: 3, sm: 4 }} flexWrap="wrap" justifyContent="center">
            {[
              { label: t('landing.footerPrivacy'), href: '#' },
              { label: t('landing.footerTerms'), href: '#' },
              { label: t('landing.footerContact'), href: '#' },
            ].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                underline="none"
                color="text.secondary"
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>

          {/* Copyright */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: '0.75rem', opacity: 0.8 }}
          >
            {t('landing.footerCopyright')}
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
