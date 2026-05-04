'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { stockCountClient } from '../api/stock-count-client'

const {
  useList: useStockCounts,
  useMany: useStockCountsMany,
  useManyReference: useStockCountsManyReference,
  useOne: useStockCount,
  useCreate: useCreateStockCount,
  useUpdate: useUpdateStockCount,
  usePatch: usePatchStockCount,
  useDelete: useDeleteStockCount,
  usePatchMany: usePatchManyStockCounts,
  useDeleteMany: useDeleteManyStockCounts,
} = createResourceHooks(queryKeys.tenant.stockCounts, stockCountClient)

export {
  useStockCounts,
  useStockCountsMany,
  useStockCountsManyReference,
  useStockCount,
  useCreateStockCount,
  useUpdateStockCount,
  usePatchStockCount,
  useDeleteStockCount,
  usePatchManyStockCounts,
  useDeleteManyStockCounts,
}
