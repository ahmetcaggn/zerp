import { createResourceClient } from '@/core/api/resource-client'
import type {
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
