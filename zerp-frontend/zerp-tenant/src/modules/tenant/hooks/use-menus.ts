'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { menuClient } from '../api/menu-client'

const {
  useList: useMenus,
  useOne: useMenu,
  useCreate: useCreateMenu,
  useUpdate: useUpdateMenu,
  usePatch: usePatchMenu,
  useDelete: useDeleteMenu,
} = createResourceHooks(queryKeys.tenant.menus, menuClient)

export {
  useMenus,
  useMenu,
  useCreateMenu,
  useUpdateMenu,
  usePatchMenu,
  useDeleteMenu,
}
