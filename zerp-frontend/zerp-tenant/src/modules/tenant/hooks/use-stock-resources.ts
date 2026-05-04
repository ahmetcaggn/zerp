'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { stockResourceClient } from '../api/stock-resource-client'

const {
  useList: useStockResources,
  useMany: useStockResourcesMany,
  useManyReference: useStockResourcesManyReference,
  useOne: useStockResource,
  useCreate: useCreateStockResource,
  useUpdate: useUpdateStockResource,
  usePatch: usePatchStockResource,
  useDelete: useDeleteStockResource,
  usePatchMany: usePatchManyStockResources,
  useDeleteMany: useDeleteManyStockResources,
} = createResourceHooks(queryKeys.tenant.stockResources, stockResourceClient)

export {
  useStockResources,
  useStockResourcesMany,
  useStockResourcesManyReference,
  useStockResource,
  useCreateStockResource,
  useUpdateStockResource,
  usePatchStockResource,
  useDeleteStockResource,
  usePatchManyStockResources,
  useDeleteManyStockResources,
}
