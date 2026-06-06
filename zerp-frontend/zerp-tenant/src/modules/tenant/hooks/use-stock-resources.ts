'use client'
import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'

import { getStockOverview, stockResourceClient } from '../api/stock-resource-client'

const {
  useList: useStockResources,
  useOne: useStockResource,
  useCreate: useCreateStockResource,
  useUpdate: useUpdateStockResource,
  usePatch: usePatchStockResource,
  useDelete: useDeleteStockResource,
  useDeleteMany: useDeleteManyStockResources,
} = createResourceHooks(queryKeys.tenant.stockResources, stockResourceClient)

export {
  useCreateStockResource,
  useDeleteManyStockResources,
  useDeleteStockResource,
  usePatchStockResource,
  useStockResource,
  useStockResources,
  useUpdateStockResource,
}

export function useStockOverview(shopId?: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: [...queryKeys.tenant.stockOverview, shopId] as const,
    queryFn: () => getStockOverview(shopId as string),
    enabled: Boolean(shopId) && options?.enabled !== false,
    staleTime: 15_000,
  })
}
