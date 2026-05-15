import { createResourceClient } from '@/core/api/resource-client'
import type {
  ShopTableResponseDto,
  ShopTableListResponseDto,
  CreateShopTableRequestDto,
  UpdateShopTableRequestDto,
} from '../types/sale'

export const shopTableClient = createResourceClient<
  ShopTableResponseDto,
  ShopTableListResponseDto,
  CreateShopTableRequestDto,
  UpdateShopTableRequestDto,
  string
>('/sale/tables')
