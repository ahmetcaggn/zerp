import { createResourceClient } from '@/core/api/resource-client'
import type { ShopListResponseDto, ShopResponseDto } from '../types/shop'

export const shopClient = createResourceClient<
  ShopResponseDto,
  ShopListResponseDto,
  void,
  void,
  string
>('/sale/shops')
