'use client'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { ProductList } from './products/product-list'
import { MenuList } from './menus/menu-list'
import { MenuCategoryList } from './menus/menu-category-list'
import { MenuItemList } from './menus/menu-item-list'
import { ShopTableList } from './tables/shop-table-list'
import { CashierView } from './cashier/cashier-view'

export function SaleManagementView() {
  const { t } = useI18n()
  const [tab, setTab] = useState(0)

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        {t('sale.title')}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, newTab: number) => setTab(newTab)}>
          <Tab label={t('sale.tabs.products')} />
          <Tab label={t('sale.tabs.menus')} />
          <Tab label={t('sale.tabs.categories')} />
          <Tab label={t('sale.tabs.menuItems')} />
          <Tab label={t('sale.tabs.tables')} />
          <Tab label={t('sale.tabs.cashier')} />
        </Tabs>
      </Box>

      <Box sx={{ mt: 2 }}>
        {tab === 0 && <ProductList />}
        {tab === 1 && <MenuList />}
        {tab === 2 && <MenuCategoryList />}
        {tab === 3 && <MenuItemList />}
        {tab === 4 && <ShopTableList />}
        {tab === 5 && <CashierView />}
      </Box>
    </Box>
  )
}
