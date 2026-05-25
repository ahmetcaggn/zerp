import { httpClient } from '@/core/api/http-client'
import type {
  StockAdjustmentCreateRequestDto,
  StockEntryCreateRequestDto,
  StockOperationType,
  StockOperationResponseDto,
} from '../types/stock'

export function createStockEntry(data: StockEntryCreateRequestDto) {
  return httpClient.post<StockOperationResponseDto>('/resource/stock-operations/entries', data)
}

export function createStockAdjustment(data: StockAdjustmentCreateRequestDto) {
  return httpClient.post<StockOperationResponseDto>('/resource/stock-operations/adjustments', data)
}

interface StockOperationHistoryQuery {
  shopId: string
  limit?: number
  operationType?: StockOperationType
  from?: string
  to?: string
  referenceNo?: string
}

export function getStockOperationHistory(query: StockOperationHistoryQuery) {
  const params = new URLSearchParams({
    shopId: query.shopId,
    limit: String(query.limit ?? 100),
  })
  if (query.operationType) params.set('operationType', query.operationType)
  if (query.from) params.set('from', query.from)
  if (query.to) params.set('to', query.to)
  if (query.referenceNo) params.set('referenceNo', query.referenceNo)

  return httpClient.get<StockOperationResponseDto[]>(
    `/resource/stock-operations/history?${params.toString()}`,
  )
}
