import { createResourceClient } from '@/core/api/resource-client'
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
