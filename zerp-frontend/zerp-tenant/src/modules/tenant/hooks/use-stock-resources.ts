'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { stockResourceClient } from '../api/stock-resource-client'

const {
  useList: useStockResources,
  useOne: useStockResource,
  useCreate: useCreateStockResource,
  useUpdate: useUpdateStockResource,
  usePatch: usePatchStockResource,
  useDelete: useDeleteStockResource,
  useDeleteMany: useDeleteManyStockResources,
} = createResourceHooks(queryKeys.tenant.stockResources, stockResourceClient)

export {
  useStockResources,
  useStockResource,
  useCreateStockResource,
  useUpdateStockResource,
  usePatchStockResource,
  useDeleteStockResource,
  useDeleteManyStockResources,
}
