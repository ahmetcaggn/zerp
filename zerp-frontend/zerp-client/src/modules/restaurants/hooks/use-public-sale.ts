'use client'

import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import {
  getPublicCategoryProducts,
  getPublicShopMenu,
  getPublicShops,
} from '../api/public-sale-client'
import type { PublicCategoryProductsParams } from '../types'

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

export function usePublicCategoryProducts(params: PublicCategoryProductsParams | null) {
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
    queryFn: () => getPublicCategoryProducts(params as PublicCategoryProductsParams),
    enabled: !!params?.shopId && !!params?.categoryId,
  })
}
