'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import type { RaListParams } from '@/core/api/resource-types'
import { shopClient, updateShopDefaultMenuLanguage } from '../api/shop-client'
import type { UpdateShopDefaultMenuLanguageRequestDto } from '../types/shop'

export function useShops(params: RaListParams = {}, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.tenant.shops, 'list', params] as const,
    queryFn: () => shopClient.getList(params),
    enabled,
  })
}

export function useUpdateShopDefaultMenuLanguage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      shopId,
      data,
    }: {
      shopId: string
      data: UpdateShopDefaultMenuLanguageRequestDto
    }) => updateShopDefaultMenuLanguage(shopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.shops })
    },
  })
}
