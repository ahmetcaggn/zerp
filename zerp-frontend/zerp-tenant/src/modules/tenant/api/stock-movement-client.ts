import { createResourceClient } from '@/core/api/resource-client'
import type {
  StockMovementResponseDto,
  StockMovementListResponseDto,
  CreateStockMovementRequestDto,
  UpdateStockMovementRequestDto,
} from '../types/stock'

export const stockMovementClient = createResourceClient<
  StockMovementResponseDto,
  StockMovementListResponseDto,
  CreateStockMovementRequestDto,
  UpdateStockMovementRequestDto,
  string
>('/resource/stock-movements')
