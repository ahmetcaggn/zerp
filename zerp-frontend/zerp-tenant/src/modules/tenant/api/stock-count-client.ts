import { createResourceClient } from '@/core/api/resource-client'
import { httpClient } from '@/core/api/http-client'
import type {
  StockCountResponseDto,
  StockCountListResponseDto,
  CreateStockCountRequestDto,
  UpdateStockCountRequestDto,
} from '../types/stock'

export const stockCountClient = createResourceClient<
  StockCountResponseDto,
  StockCountListResponseDto,
  CreateStockCountRequestDto,
  UpdateStockCountRequestDto,
  string
>('/resource/stock-counts')

export function approveStockCount(id: string) {
  return httpClient.post<StockCountResponseDto>(`/resource/stock-counts/${id}/approve`, {})
}
