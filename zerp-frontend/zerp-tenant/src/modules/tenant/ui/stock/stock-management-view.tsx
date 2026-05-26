'use client'
import { Box, Grid, Paper, Tab, Tabs, Typography } from '@mui/material'
import { useMemo, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { formatDate } from '@/core/utils/date-formatter'

import { useStockCounts } from '../../hooks/use-stock-counts'
import { useStockOverview } from '../../hooks/use-stock-resources'
import { StockCountList } from './stock-count-list'
import { StockMovementList } from './stock-movement-list'
import { StockResourceList } from './stock-resource-list'

export function StockManagementView() {
  const { t, locale } = useI18n()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const { data: overview } = useStockOverview(selectedShopId)
  const { data: stockCounts } = useStockCounts({
    pagination: { page: 1, perPage: 40 },
    sort: { field: 'countDate', order: 'DESC' },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })
  const [tab, setTab] = useState(0)
  const items = overview ?? []

  const totalVariance = useMemo(
    () => items.reduce((sum, item) => sum + Math.abs(Number(item.variance ?? 0)), 0),
    [items],
  )
  const negativeVarianceSku = useMemo(
    () => items.filter((item) => Number(item.variance ?? 0) < -0.0001).length,
    [items],
  )
  const riskyTop5 = useMemo(
    () => [...items]
      .sort((a, b) => Math.abs(Number(b.variance ?? 0)) - Math.abs(Number(a.variance ?? 0)))
      .filter((item) => Math.abs(Number(item.variance ?? 0)) > 0.0001)
      .slice(0, 5),
    [items],
  )
  const latestCompletedCount = useMemo(
    () => (stockCounts?.data ?? []).find((count) => count.status === 'COMPLETED'),
    [stockCounts?.data],
  )
  const lastCountVariance = useMemo(
    () => (latestCompletedCount?.items ?? [])
      .reduce((sum, item) => sum + Math.abs(Number(item.discrepancy ?? 0)), 0),
    [latestCompletedCount?.items],
  )

  const numberFmt = useMemo(
    () => new Intl.NumberFormat(locale === 'tr' ? 'tr-TR' : 'en-US', { maximumFractionDigits: 2 }),
    [locale],
  )

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        {t('stock.title')}
      </Typography>

      {scope.mode === 'SHOP' && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('stock.kpi.totalVariance')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {numberFmt.format(totalVariance)}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('stock.kpi.negativeVarianceSku')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: negativeVarianceSku > 0 ? 'error.main' : 'text.primary' }}>
                {negativeVarianceSku}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75 }}>
                {t('stock.kpi.topRisky5')}
              </Typography>
              {!riskyTop5.length ? (
                <Typography variant="body2" color="text.secondary">-</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                  {riskyTop5.map((item) => (
                    <Typography key={item.stockResourceId} variant="caption" sx={{ lineHeight: 1.35 }}>
                      {item.stockResourceName}: {numberFmt.format(Number(item.variance ?? 0))}
                    </Typography>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('stock.kpi.lastCountVariance')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {numberFmt.format(lastCountVariance)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {latestCompletedCount?.countDate ? formatDate(latestCompletedCount.countDate, locale) : '-'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, newTab) => setTab(newTab)}>
          <Tab label={t('stock.tabs.resources')} />
          <Tab label={t('stock.tabs.movements')} />
          <Tab label={t('stock.tabs.counts')} />
        </Tabs>
      </Box>

      <Box sx={{ mt: 2 }}>
        {tab === 0 && <StockResourceList />}
        {tab === 1 && <StockMovementList />}
        {tab === 2 && <StockCountList />}
      </Box>
    </Box>
  )
}
