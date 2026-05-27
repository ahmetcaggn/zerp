import { httpClient } from '@/core/api/http-client'

import type {
  CreatePublicCartOrderRequest,
  CreatePublicCartOrderResponse,
  PublicCategoryMenuItemsParams,
  PublicMenuItemDto,
  PublicNearbyShopsParams,
  PublicShopDto,
  PublicShopMenuResponseDto,
} from '../types'

export async function getPublicShops(): Promise<PublicShopDto[]> {
  return httpClient.get<PublicShopDto[]>('/sale/public/shops')
}

export async function getPublicNearbyShops(
  params: PublicNearbyShopsParams,
): Promise<{
  data: PublicShopDto[]
  total: number
}> {
  const { latitude, longitude, start, end } = params
  const query = new URLSearchParams({
    lat: String(latitude),
    lng: String(longitude),
    _start: String(start),
    _end: String(end),
  })
  return httpClient.requestList<PublicShopDto>(`/sale/public/shops/nearby?${query.toString()}`)
}

export async function getPublicShopMenu(
  shopId: string,
  language: 'TR' | 'EN',
): Promise<PublicShopMenuResponseDto> {
  return httpClient.get<PublicShopMenuResponseDto>(`/sale/public/shops/${shopId}/menu?language=${language}`)
}

export async function getPublicCategoryMenuItems(params: PublicCategoryMenuItemsParams): Promise<{
  data: PublicMenuItemDto[]
  total: number
}> {
  const { shopId, categoryId, language, start, end, sort = 'name', order = 'ASC' } = params
  const query = new URLSearchParams({
    language,
    _start: String(start),
    _end: String(end),
    _sort: sort,
    _order: order,
  })
  return httpClient.requestList<PublicMenuItemDto>(
    `/sale/public/shops/${shopId}/categories/${categoryId}/menu-items?${query.toString()}`,
  )
}

export const getPublicCategoryProducts = getPublicCategoryMenuItems

export async function createPublicCartOrder(
  shopId: string,
  payload: CreatePublicCartOrderRequest,
): Promise<CreatePublicCartOrderResponse> {
  return httpClient.post<CreatePublicCartOrderResponse>(
    `/sale/public/shops/${shopId}/cart-orders`,
    payload,
  )
}
