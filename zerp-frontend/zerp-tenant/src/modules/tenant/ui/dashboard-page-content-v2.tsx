'use client'

import { useShopScope } from '@/core/providers/shop-scope-provider'

import { ShopDashboardV2 } from './shop-dashboard-v2'
import { TenantDashboardV2 } from './tenant-dashboard-v2'

export function DashboardPageContentV2() {
  const { scope } = useShopScope()
  if (scope.mode === 'SHOP') {
    return <ShopDashboardV2 />
  }
  return <TenantDashboardV2 />
}
