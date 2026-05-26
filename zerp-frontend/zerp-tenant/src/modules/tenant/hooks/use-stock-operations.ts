'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import {
  createStockAdjustment,
  createStockEntry,
  getStockOperationHistory,
} from '../api/stock-operation-client'
import type {
  StockAdjustmentCreateRequestDto,
  StockEntryCreateRequestDto,
  StockOperationType,
} from '../types/stock'

interface StockOperationHistoryParams {
  shopId?: string
  limit?: number
  operationType?: StockOperationType
  from?: string
  to?: string
  referenceNo?: string
}

export function useStockOperationHistory(params: StockOperationHistoryParams) {
  return useQuery({
    queryKey: [
      ...queryKeys.tenant.stockOperations,
      params.shopId,
      params.limit ?? 100,
      params.operationType ?? '',
      params.from ?? '',
      params.to ?? '',
      params.referenceNo ?? '',
    ] as const,
    queryFn: () => getStockOperationHistory({
      shopId: params.shopId as string,
      limit: params.limit ?? 100,
      operationType: params.operationType,
      from: params.from,
      to: params.to,
      referenceNo: params.referenceNo,
    }),
    enabled: Boolean(params.shopId),
    staleTime: 10_000,
  })
}

export function useCreateStockEntry() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: StockEntryCreateRequestDto) => createStockEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockOperations })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockResources })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockOverview })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockMovements })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockMovementTimeline })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockMovementDrillDown })
    },
  })
}

export function useCreateStockAdjustment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: StockAdjustmentCreateRequestDto) => createStockAdjustment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockOperations })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockResources })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockOverview })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockMovements })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockMovementTimeline })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockMovementDrillDown })
    },
  })
}
