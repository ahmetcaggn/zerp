import { httpClient } from '@/core/api/http-client'
import type {
  PublicCategoryProductsParams,
  PublicProductDto,
  PublicShopDto,
  PublicShopMenuResponseDto,
} from '../types'

export async function getPublicShops(): Promise<PublicShopDto[]> {
  return httpClient.get<PublicShopDto[]>('/sale/public/shops')
}

export async function getPublicShopMenu(shopId: string): Promise<PublicShopMenuResponseDto> {
  return httpClient.get<PublicShopMenuResponseDto>(`/sale/public/shops/${shopId}/menu`)
}

export async function getPublicCategoryProducts(params: PublicCategoryProductsParams): Promise<{
  data: PublicProductDto[]
  total: number
}> {
  const { shopId, categoryId, start, end, sort = 'name', order = 'ASC' } = params
  const query = new URLSearchParams({
    _start: String(start),
    _end: String(end),
    _sort: sort,
    _order: order,
  })
  return httpClient.requestList<PublicProductDto>(
    `/sale/public/shops/${shopId}/categories/${categoryId}/products?${query.toString()}`,
  )
}
