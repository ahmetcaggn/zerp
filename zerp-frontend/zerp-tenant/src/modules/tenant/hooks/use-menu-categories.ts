'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { menuCategoryClient } from '../api/menu-category-client'

const {
  useList: useMenuCategories,
  useOne: useMenuCategory,
  useCreate: useCreateMenuCategory,
  useUpdate: useUpdateMenuCategory,
  usePatch: usePatchMenuCategory,
  useDelete: useDeleteMenuCategory,
} = createResourceHooks(queryKeys.tenant.menuCategories, menuCategoryClient)

export {
  useMenuCategories,
  useMenuCategory,
  useCreateMenuCategory,
  useUpdateMenuCategory,
  usePatchMenuCategory,
  useDeleteMenuCategory,
}
