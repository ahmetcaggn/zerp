'use client'

import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'

import { shopClient } from '../api/shop-client'

const {
  useList: useShops,
  useOne: useShop,
  useCreate: useCreateShop,
  useUpdate: useUpdateShop,
  usePatch: usePatchShop,
  useDelete: useDeleteShop,
  useDeleteMany: useDeleteManyShops,
} = createResourceHooks(queryKeys.admin.shops, shopClient)

export {
  useCreateShop,
  useDeleteManyShops,
  useDeleteShop,
  usePatchShop,
  useShop,
  useShops,
  useUpdateShop,
}
