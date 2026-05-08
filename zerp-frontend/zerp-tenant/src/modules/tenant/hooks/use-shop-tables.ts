'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { shopTableClient } from '../api/shop-table-client'

const {
  useList: useShopTables,
  useOne: useShopTable,
  useCreate: useCreateShopTable,
  useUpdate: useUpdateShopTable,
  usePatch: usePatchShopTable,
  useDelete: useDeleteShopTable,
  useDeleteMany: useDeleteManyShopTables,
} = createResourceHooks(queryKeys.tenant.shopTables, shopTableClient)

export {
  useShopTables,
  useShopTable,
  useCreateShopTable,
  useUpdateShopTable,
  usePatchShopTable,
  useDeleteShopTable,
  useDeleteManyShopTables,
}
