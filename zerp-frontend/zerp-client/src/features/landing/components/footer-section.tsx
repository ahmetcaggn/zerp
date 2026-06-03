'use client'

import { Box, Container, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'

import { appConfig } from '@/core/config/app-config'
import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'

export function FooterSection() {
  const { t } = useI18n()
  const theme = useTheme()
  const currentYear = new Date().getFullYear()

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
              component="img"
              src="/zerp_icon_rounded.svg"
              alt="ZERP"
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: 'block',
              }}
            />
            <Stack gap={0}>
              <Typography fontWeight={700} fontSize="0.9375rem" letterSpacing={0}>
                {appConfig.app.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                {t('landing.footerTagline')}
              </Typography>
            </Stack>
          </Stack>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: '0.75rem', opacity: 0.8 }}
          >
            {t('landing.footerCopyright', { year: currentYear })}
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}
