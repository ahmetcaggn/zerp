import { createResourceClient } from '@/core/api/resource-client'
import { httpClient } from '@/core/api/http-client'
import type {
  StockOverviewResponseDto,
  StockResourceResponseDto,
  StockResourceListResponseDto,
  CreateStockResourceRequestDto,
  UpdateStockResourceRequestDto,
} from '../types/stock'

export const stockResourceClient = createResourceClient<
  StockResourceResponseDto,
  StockResourceListResponseDto,
  CreateStockResourceRequestDto,
  UpdateStockResourceRequestDto,
  string
>('/resource/stock-resources')

export function getStockOverview(shopId: string) {
  return httpClient.get<StockOverviewResponseDto[]>(
    `/resource/stock-resources/overview?shopId=${encodeURIComponent(shopId)}`,
  )
}
