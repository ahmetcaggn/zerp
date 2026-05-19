'use client'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import type { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { StockResourceList } from './stock-resource-list'
import { StockMovementList } from './stock-movement-list'
import { StockCountList } from './stock-count-list'

const STOCK_TAB_KEYS = ['resources', 'movements', 'counts'] as const

export function StockManagementView() {
  const { t } = useI18n()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState(0)

  useEffect(() => {
    const activeTab = searchParams.get('tab')
    const tabIndex = STOCK_TAB_KEYS.indexOf((activeTab ?? 'resources') as (typeof STOCK_TAB_KEYS)[number])
    setTab(tabIndex >= 0 ? tabIndex : 0)
  }, [searchParams])

  function handleTabChange(nextTab: number) {
    setTab(nextTab)
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', STOCK_TAB_KEYS[nextTab] ?? STOCK_TAB_KEYS[0])
    const queryString = params.toString()
    router.replace((queryString ? `${pathname}?${queryString}` : pathname) as Route)
  }

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        {t('stock.title')}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, newTab) => handleTabChange(newTab)}>
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
