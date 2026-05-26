import { createResourceClient } from '@/core/api/resource-client'
import { httpClient } from '@/core/api/http-client'
import type {
  StockMovementResponseDto,
  StockMovementListResponseDto,
  CreateStockMovementRequestDto,
  UpdateStockMovementRequestDto,
  StockMovementTimelineResponseDto,
  StockMovementTimelineBucket,
} from '../types/stock'

export const stockMovementClient = createResourceClient<
  StockMovementResponseDto,
  StockMovementListResponseDto,
  CreateStockMovementRequestDto,
  UpdateStockMovementRequestDto,
  string
>('/resource/stock-movements')

interface StockMovementTimelineQuery {
  shopId: string
  from: string
  to: string
  bucket: StockMovementTimelineBucket
  stockResourceId?: string
}

interface StockMovementDrillDownQuery {
  shopId: string
  from: string
  to: string
  stockResourceId?: string
  limit?: number
}

export function getStockMovementTimeline(query: StockMovementTimelineQuery) {
  const params = new URLSearchParams({
    shopId: query.shopId,
    from: query.from,
    to: query.to,
    bucket: query.bucket,
  })
  if (query.stockResourceId) {
    params.set('stockResourceId', query.stockResourceId)
  }

  return httpClient.get<StockMovementTimelineResponseDto>(
    `/resource/stock-movements/timeline?${params.toString()}`,
  )
}

export function getStockMovementDrillDown(query: StockMovementDrillDownQuery) {
  const params = new URLSearchParams({
    shopId: query.shopId,
    from: query.from,
    to: query.to,
    limit: String(query.limit ?? 300),
  })
  if (query.stockResourceId) {
    params.set('stockResourceId', query.stockResourceId)
  }

  return httpClient.get<StockMovementResponseDto[]>(
    `/resource/stock-movements/drill-down?${params.toString()}`,
  )
}
