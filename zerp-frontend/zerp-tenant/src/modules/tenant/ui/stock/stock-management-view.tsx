'use client'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'

import { StockCountList } from './stock-count-list'
import { StockMovementList } from './stock-movement-list'
import { StockResourceList } from './stock-resource-list'

export function StockManagementView() {
  const { t } = useI18n()
  const [tab, setTab] = useState(0)

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        {t('stock.title')}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={(_, newTab) => setTab(newTab)}
          sx={{
            '& .MuiTab-root': {
              width: 112,
              minWidth: 112,
            },
          }}
        >
          <Tab label={t('stock.tabs.resources')} />
          <Tab label={t('stock.tabs.movements')} />
          <Tab label={t('stock.tabs.counts')} />
        </Tabs>
      </Box>

      <Box sx={{ width: '100%' }}>
        {tab === 0 && <StockResourceList />}
        {tab === 1 && <StockMovementList />}
        {tab === 2 && <StockCountList />}
      </Box>
    </Box>
  )
}
