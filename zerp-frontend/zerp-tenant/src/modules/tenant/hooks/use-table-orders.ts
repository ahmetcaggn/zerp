'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { tableOrderClient } from '../api/table-order-client'

const {
  useList: useTableOrders,
  useOne: useTableOrder,
  useCreate: useCreateTableOrder,
  useUpdate: useUpdateTableOrder,
  usePatch: usePatchTableOrder,
  useDelete: useDeleteTableOrder,
} = createResourceHooks(queryKeys.tenant.tableOrders, tableOrderClient)

export {
  useTableOrders,
  useTableOrder,
  useCreateTableOrder,
  useUpdateTableOrder,
  usePatchTableOrder,
  useDeleteTableOrder,
}
