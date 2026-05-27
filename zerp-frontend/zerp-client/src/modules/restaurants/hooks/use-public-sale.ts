'use client'

import { useMutation, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'

import {
  createPublicCartOrder,
  getPublicCategoryMenuItems,
  getPublicNearbyShops,
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

export function usePublicNearbyShops(
  latitude: number | null,
  longitude: number | null,
  range: { start: number; end: number } = { start: 0, end: 10 },
) {
  return useQuery({
    queryKey: [...queryKeys.client.restaurants.nearbyShops, latitude, longitude, range.start, range.end],
    queryFn: () =>
      getPublicNearbyShops({
        latitude: latitude as number,
        longitude: longitude as number,
        start: range.start,
        end: range.end,
      }),
    enabled: typeof latitude === 'number' && typeof longitude === 'number',
  })
}

export function usePublicShopMenu(shopId: string, language: 'TR' | 'EN') {
  return useQuery({
    queryKey: [...queryKeys.client.restaurants.menu, shopId, language],
    queryFn: () => getPublicShopMenu(shopId, language),
    enabled: !!shopId,
  })
}

export function usePublicCategoryMenuItems(params: PublicCategoryMenuItemsParams | null) {
  return useQuery({
    queryKey: [
      ...queryKeys.client.restaurants.products,
      params?.shopId ?? null,
      params?.categoryId ?? null,
      params?.language ?? null,
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
