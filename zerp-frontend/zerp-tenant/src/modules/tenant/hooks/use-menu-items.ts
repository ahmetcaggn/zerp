'use client'
import { useMutation } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { menuItemClient, uploadMenuItemImage } from '../api/menu-item-client'
import type { MenuItemImageUploadResponseDto } from '../types/sale'

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

export function useUploadMenuItemImage() {
  return useMutation({
    mutationFn: ({ file, categoryId }: { file: File; categoryId: string }): Promise<MenuItemImageUploadResponseDto> =>
      uploadMenuItemImage(file, categoryId),
  })
}
