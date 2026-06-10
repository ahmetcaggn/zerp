'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import type { RaListParams } from '@/core/api/resource-types'
import { ApiError } from '@/core/types/api'

import { patchShop, shopClient, uploadShopImage } from '../api/shop-client'
import type { PatchShopRequestDto } from '../types/shop'

export function useShops(params: RaListParams = {}, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.tenant.shops, 'list', params] as const,
    queryFn: () => shopClient.getList(params),
    enabled,
    retry: (failureCount, error) => {
      if (error instanceof ApiError && (error.statusCode === 401 || error.statusCode === 403)) {
        return false
      }

      return failureCount < 2
    },
  })
}

export function useShop(shopId?: string, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.tenant.shops, 'detail', shopId] as const,
    queryFn: () => shopClient.getOne(shopId as string),
    enabled: enabled && Boolean(shopId),
  })
}

export function useUpdateShopDefaultMenuLanguage() {
  return useUpdateShop()
}

export function useUpdateShop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      shopId,
      data,
    }: {
      shopId: string
      data: PatchShopRequestDto
    }) => patchShop(shopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.shops })
    },
  })
}

export function useUploadShopImage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      shopId,
      file,
    }: {
      shopId: string
      file: File
    }) => uploadShopImage(shopId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.shops })
    },
  })
}
