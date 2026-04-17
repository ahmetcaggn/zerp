'use client'

import { Stack, Typography } from '@mui/material'

import { RoleGuard } from '@/core/guards/role-guard'
import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'

export function AdminDashboard() {
  const { t } = useI18n()

  return (
    <RoleGuard requiredRoles={['admin_super', 'admin_operator']}>
      <Stack spacing={responsiveLayout.sectionGap}>
        <Typography variant="h2">{t('dashboard.title')}</Typography>
        <Typography color="text.secondary">{t('dashboard.subtitle')}</Typography>
      </Stack>
    </RoleGuard>
  )
}
