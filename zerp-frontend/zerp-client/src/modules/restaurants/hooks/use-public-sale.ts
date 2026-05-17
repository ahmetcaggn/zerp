'use client'

import { useMutation, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import {
  createPublicCartOrder,
  getPublicCategoryMenuItems,
  getPublicShopMenu,
  getPublicShops,
} from '../api/public-sale-client'
import type { CreatePublicCartOrderRequest, PublicCategoryMenuItemsParams } from '../types'

export function usePublicShops() {
  return useQuery({
    queryKey: queryKeys.client.restaurants.shops,
    queryFn: getPublicShops,
  })
}

export function usePublicShopMenu(shopId: string) {
  return useQuery({
    queryKey: [...queryKeys.client.restaurants.menu, shopId],
    queryFn: () => getPublicShopMenu(shopId),
    enabled: !!shopId,
  })
}

export function usePublicCategoryMenuItems(params: PublicCategoryMenuItemsParams | null) {
  return useQuery({
    queryKey: [
      ...queryKeys.client.restaurants.products,
      params?.shopId ?? null,
      params?.categoryId ?? null,
      params?.start ?? null,
      params?.end ?? null,
      params?.sort ?? null,
      params?.order ?? null,
    ],
    queryFn: () => getPublicCategoryMenuItems(params as PublicCategoryMenuItemsParams),
    enabled: !!params?.shopId && !!params?.categoryId,
  })
}

export const usePublicCategoryProducts = usePublicCategoryMenuItems

export function useCreatePublicCartOrder() {
  return useMutation({
    mutationFn: ({ shopId, payload }: { shopId: string; payload: CreatePublicCartOrderRequest }) =>
      createPublicCartOrder(shopId, payload),
  })
}
