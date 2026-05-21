'use client'

import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'

import { stockDashboardClient } from '../api/stock-dashboard-client'

export function useStockDashboard(shopId?: string) {
  return useQuery({
    queryKey: [...queryKeys.tenant.stockDashboard, 'overview', shopId] as const,
    queryFn: () => stockDashboardClient.getOverview(shopId ?? ''),
    enabled: Boolean(shopId),
    staleTime: 5 * 60 * 1000,
  })
}
