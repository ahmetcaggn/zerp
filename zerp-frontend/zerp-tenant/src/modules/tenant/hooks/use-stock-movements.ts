'use client'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import {
  getStockMovementDrillDown,
  getStockMovementTimeline,
  stockMovementClient,
} from '../api/stock-movement-client'
import type { StockMovementTimelineBucket } from '../types/stock'

const {
  useList: useStockMovements,
  useOne: useStockMovement,
  useCreate: useCreateStockMovement,
  useUpdate: useUpdateStockMovement,
  usePatch: usePatchStockMovement,
  useDelete: useDeleteStockMovement,
  useDeleteMany: useDeleteManyStockMovements,
} = createResourceHooks(queryKeys.tenant.stockMovements, stockMovementClient)

export {
  useStockMovements,
  useStockMovement,
  useCreateStockMovement,
  useUpdateStockMovement,
  usePatchStockMovement,
  useDeleteStockMovement,
  useDeleteManyStockMovements,
}

interface StockMovementTimelineParams {
  shopId?: string
  stockResourceId?: string
  from?: string
  to?: string
  bucket: StockMovementTimelineBucket
}

interface StockMovementDrillDownParams {
  shopId?: string
  stockResourceId?: string
  from?: string
  to?: string
  limit?: number
}

export function useStockMovementTimeline(params: StockMovementTimelineParams) {
  return useQuery({
    queryKey: [
      ...queryKeys.tenant.stockMovementTimeline,
      params.shopId,
      params.stockResourceId,
      params.from,
      params.to,
      params.bucket,
    ] as const,
    queryFn: () => getStockMovementTimeline({
      shopId: params.shopId as string,
      stockResourceId: params.stockResourceId,
      from: params.from as string,
      to: params.to as string,
      bucket: params.bucket,
    }),
    enabled: Boolean(params.shopId && params.from && params.to),
    staleTime: 15_000,
  })
}

export function useStockMovementDrillDown(params: StockMovementDrillDownParams) {
  return useQuery({
    queryKey: [
      ...queryKeys.tenant.stockMovementDrillDown,
      params.shopId,
      params.stockResourceId,
      params.from,
      params.to,
      params.limit,
    ] as const,
    queryFn: () => getStockMovementDrillDown({
      shopId: params.shopId as string,
      stockResourceId: params.stockResourceId,
      from: params.from as string,
      to: params.to as string,
      limit: params.limit,
    }),
    enabled: Boolean(params.shopId && params.from && params.to),
    staleTime: 10_000,
  })
}
