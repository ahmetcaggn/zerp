import { httpClient } from '@/core/api/http-client'
import type {
  PublicCategoryMenuItemsParams,
  PublicMenuItemDto,
  PublicShopDto,
  PublicShopMenuResponseDto,
} from '../types'

export async function getPublicShops(): Promise<PublicShopDto[]> {
  return httpClient.get<PublicShopDto[]>('/sale/public/shops')
}

export async function getPublicShopMenu(shopId: string): Promise<PublicShopMenuResponseDto> {
  return httpClient.get<PublicShopMenuResponseDto>(`/sale/public/shops/${shopId}/menu`)
}

export async function getPublicCategoryMenuItems(params: PublicCategoryMenuItemsParams): Promise<{
  data: PublicMenuItemDto[]
  total: number
}> {
  const { shopId, categoryId, start, end, sort = 'name', order = 'ASC' } = params
  const query = new URLSearchParams({
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
