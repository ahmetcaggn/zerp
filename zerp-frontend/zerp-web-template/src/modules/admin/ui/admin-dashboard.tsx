'use client'

import { Stack, Typography } from '@mui/material'

import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'

export function AdminDashboard() {
  const { t } = useI18n()

  return (
    <Stack spacing={responsiveLayout.sectionGap}>
      <Typography variant="h2">{t('dashboard.title')}</Typography>
      <Typography color="text.secondary">{t('dashboard.subtitle')}</Typography>
    </Stack>
  )
}
