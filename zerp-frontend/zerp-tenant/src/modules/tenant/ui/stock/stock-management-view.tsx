'use client'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { StockResourceList } from './stock-resource-list'
import { StockMovementList } from './stock-movement-list'
import { StockCountList } from './stock-count-list'

export function StockManagementView() {
  const { t } = useI18n()
  const [tab, setTab] = useState(0)

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        {t('stock.title')}
      </Typography>

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
