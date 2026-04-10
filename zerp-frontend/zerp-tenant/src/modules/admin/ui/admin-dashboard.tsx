'use client'

import { Chip, Grid, Paper, Stack, Typography } from '@mui/material'

import { RoleGuard } from '@/core/guards/role-guard'
import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'
import { useSystemHealth } from '@/modules/admin/hooks/use-system-health'
import { useTenants } from '@/modules/admin/hooks/use-tenants'

const compactChipSx = {
  maxWidth: '100%',
  '& .MuiChip-label': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
} as const

export function AdminDashboard() {
  const { t } = useI18n()
  const tenantsQuery = useTenants()
  const healthQuery = useSystemHealth()

  return (
    <RoleGuard requiredRoles={['admin_super', 'admin_operator']}>
      <Stack spacing={responsiveLayout.sectionGap}>
        <Typography variant="h2" sx={{ wordBreak: 'break-word' }}>
          {t('dashboard.title')} · Admin
        </Typography>
        <Typography color="text.secondary">{t('dashboard.subtitle')}</Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper sx={{ p: responsiveLayout.cardPadding }}>
              <Typography variant="h6">Tenants</Typography>
              <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
                {(tenantsQuery.data ?? []).map((tenant) => (
                  <Chip
                    key={tenant.id}
                    label={`${tenant.companyName} · ${tenant.status}`}
                    sx={compactChipSx}
                  />
                ))}
                {!tenantsQuery.data?.length && (
                  <Chip label="No tenant data" variant="outlined" sx={compactChipSx} />
                )}
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper sx={{ p: responsiveLayout.cardPadding }}>
              <Typography variant="h6">System Health</Typography>
              <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
                {healthQuery.data
                  ? Object.entries(healthQuery.data).map(([service, status]) => (
                      <Chip
                        key={service}
                        label={`${service}: ${status}`}
                        color={status === 'UP' ? 'success' : 'error'}
                        sx={compactChipSx}
                      />
                    ))
                  : null}
                {!healthQuery.data && (
                  <Chip label="No health data" variant="outlined" sx={compactChipSx} />
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Stack>
    </RoleGuard>
  )
}
