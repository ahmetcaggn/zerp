'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import type { RaListParams } from '@/core/api/resource-types'
import { shopClient } from '../api/shop-client'

export function useShops(params: RaListParams = {}, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.tenant.shops, 'list', params] as const,
    queryFn: () => shopClient.getList(params),
    enabled,
  })
}
