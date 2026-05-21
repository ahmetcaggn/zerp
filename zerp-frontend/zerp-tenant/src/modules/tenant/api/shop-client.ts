import { createResourceClient } from '@/core/api/resource-client'
import { httpClient } from '@/core/api/http-client'
import type {
  ShopListResponseDto,
  ShopResponseDto,
  UpdateShopDefaultMenuLanguageRequestDto,
} from '../types/shop'

export const shopClient = createResourceClient<
  ShopResponseDto,
  ShopListResponseDto,
  void,
  void,
  string
>('/sale/shops')

export function updateShopDefaultMenuLanguage(
  shopId: string,
  payload: UpdateShopDefaultMenuLanguageRequestDto,
): Promise<ShopResponseDto> {
  return httpClient.patch<ShopResponseDto>(`/sale/shops/${shopId}`, payload)
}
