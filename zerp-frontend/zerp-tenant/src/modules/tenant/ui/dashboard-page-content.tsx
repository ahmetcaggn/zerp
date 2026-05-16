'use client'

import { useShopScope } from '@/core/providers/shop-scope-provider'
import { ShopDashboard } from './shop-dashboard'
import { TenantDashboard } from './tenant-dashboard'

export function DashboardPageContent() {
  const { scope } = useShopScope()
  if (scope.mode === 'SHOP') {
    return <ShopDashboard />
  }

  return <TenantDashboard />
}
