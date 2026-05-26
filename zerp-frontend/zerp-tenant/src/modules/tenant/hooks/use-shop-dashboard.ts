'use client'

import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'

import { shopDashboardClient } from '../api/shop-dashboard-client'

export function useShopDashboard(shopId?: string) {
  return useQuery({
    queryKey: [...queryKeys.tenant.shopDashboard, 'overview', shopId] as const,
    queryFn: () => shopDashboardClient.getOverview(shopId ?? ''),
    enabled: Boolean(shopId),
    staleTime: 5 * 60 * 1000,
  })
}
