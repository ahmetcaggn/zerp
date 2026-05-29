'use client'

import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'

import {
  createPublicCartOrder,
  getPublicCategoryMenuItems,
  getPublicNearbyShops,
  getPublicShopMenu,
  getPublicShops,
  getPublicShopsFeed,
} from '../api/public-sale-client'
import type {
  CreatePublicCartOrderRequest,
  PublicCategoryMenuItemsParams,
  PublicShopsFeedParams,
} from '../types'

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

export function usePublicShopsFeedInfinite(params: Omit<PublicShopsFeedParams, 'page'>) {
  const isNearbyMode = params.mode === 'NEARBY'
  const enabled = isNearbyMode
    ? typeof params.lat === 'number' && typeof params.lng === 'number'
    : true

  return useInfiniteQuery({
    queryKey: [
      ...queryKeys.client.restaurants.feed,
      params.mode ?? 'ALL',
      params.pageSize ?? 12,
      params.q ?? '',
      params.city ?? '',
      params.state ?? '',
      params.sortBy ?? 'NAME',
      params.order ?? 'ASC',
      params.lat ?? null,
      params.lng ?? null,
    ],
    queryFn: ({ pageParam }) =>
      getPublicShopsFeed({
        ...params,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? (lastPage.nextPage ?? undefined) : undefined),
    enabled,
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
