'use client'
import { Box, Divider, Grid, Paper, Stack, Typography } from '@mui/material'
import { useI18n } from '@/core/i18n/i18n-provider'
import { responsiveLayout } from '@/core/theme/layout'
import { DashboardKpiCards } from './dashboard-kpi-cards'
import { DashboardQuickActions } from './dashboard-quick-actions'
import { DashboardRecentActivity } from './dashboard-recent-activity'

export function TenantDashboard() {
  const { t } = useI18n()

  return (
    <Stack spacing={responsiveLayout.sectionGap}>
      <Typography variant="h4" fontWeight={700}>
        {t('dashboard.title')}
      </Typography>

      {/* KPI Kartları */}
      <DashboardKpiCards />

      <Divider />

      {/* Alt bölüm: Son Çalışanlar + Hızlı İşlemler */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <DashboardRecentActivity />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
            <DashboardQuickActions />
          </Paper>
        </Grid>
      </Grid>

      {/* Boş alt boşluk için subtitle */}
      <Box>
        <Typography variant="caption" color="text.secondary">
          {t('dashboard.subtitle')}
        </Typography>
      </Box>
    </Stack>
  )
}
