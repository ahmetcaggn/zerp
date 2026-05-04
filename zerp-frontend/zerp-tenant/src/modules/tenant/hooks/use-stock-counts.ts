'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { stockCountClient } from '../api/stock-count-client'

const {
  useList: useStockCounts,
  useOne: useStockCount,
  useCreate: useCreateStockCount,
  useUpdate: useUpdateStockCount,
  usePatch: usePatchStockCount,
  useDelete: useDeleteStockCount,
  useDeleteMany: useDeleteManyStockCounts,
} = createResourceHooks(queryKeys.tenant.stockCounts, stockCountClient)

export {
  useStockCounts,
  useStockCount,
  useCreateStockCount,
  useUpdateStockCount,
  usePatchStockCount,
  useDeleteStockCount,
  useDeleteManyStockCounts,
}
