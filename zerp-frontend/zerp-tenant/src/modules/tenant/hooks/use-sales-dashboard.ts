'use client'

import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'

import { salesDashboardClient } from '../api/sales-dashboard-client'

export function useSalesDashboard() {
  return useQuery({
    queryKey: [...queryKeys.tenant.salesDashboard, 'overview'] as const,
    queryFn: () => salesDashboardClient.getOverview(),
    staleTime: 5 * 60 * 1000,
  })
}
