'use client'
import { useMutation } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'

import { previewPublicCartOrder, tableOrderClient } from '../api/table-order-client'

const {
  useList: useTableOrders,
  useOne: useTableOrder,
  useCreate: useCreateTableOrder,
  useUpdate: useUpdateTableOrder,
  usePatch: usePatchTableOrder,
  useDelete: useDeleteTableOrder,
} = createResourceHooks(queryKeys.tenant.tableOrders, tableOrderClient)

function usePreviewPublicCartOrder() {
  return useMutation({
    mutationFn: ({ code, tableId }: { code: string; tableId: string }) =>
      previewPublicCartOrder(code, tableId),
  })
}

export {
  useCreateTableOrder,
  useDeleteTableOrder,
  usePatchTableOrder,
  usePreviewPublicCartOrder,
  useTableOrder,
  useTableOrders,
  useUpdateTableOrder,
}
