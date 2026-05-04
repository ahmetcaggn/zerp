'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { menuItemClient } from '../api/menu-item-client'

const {
  useList: useMenuItems,
  useOne: useMenuItem,
  useCreate: useCreateMenuItem,
  useUpdate: useUpdateMenuItem,
  usePatch: usePatchMenuItem,
  useDelete: useDeleteMenuItem,
} = createResourceHooks(queryKeys.tenant.menuItems, menuItemClient)

export {
  useMenuItems,
  useMenuItem,
  useCreateMenuItem,
  useUpdateMenuItem,
  usePatchMenuItem,
  useDeleteMenuItem,
}
