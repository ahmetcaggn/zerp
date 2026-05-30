'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'

import { previewPublicCartOrder, tableOrderClient } from '../api/table-order-client'
import type { CreateTableOrderRequestDto, UpdateTableOrderRequestDto } from '../types/sale'

const baseHooks = createResourceHooks(queryKeys.tenant.tableOrders, tableOrderClient)

export const useTableOrders = baseHooks.useList
export const useTableOrder = baseHooks.useOne

export function useCreateTableOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTableOrderRequestDto) => tableOrderClient.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tenant.tableOrders })
      qc.invalidateQueries({ queryKey: queryKeys.tenant.shopTables })
    },
  })
}

export function useUpdateTableOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTableOrderRequestDto }) =>
      tableOrderClient.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.tenant.tableOrders })
      qc.invalidateQueries({ queryKey: [...queryKeys.tenant.tableOrders, 'detail', id] })
      qc.invalidateQueries({ queryKey: queryKeys.tenant.shopTables })
    },
  })
}

export function usePatchTableOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: Record<string, unknown> }) =>
      tableOrderClient.patch(id, fields),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.tenant.tableOrders })
      qc.invalidateQueries({ queryKey: [...queryKeys.tenant.tableOrders, 'detail', id] })
      qc.invalidateQueries({ queryKey: queryKeys.tenant.shopTables })
    },
  })
}

export function useDeleteTableOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tableOrderClient.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tenant.tableOrders })
      qc.invalidateQueries({ queryKey: queryKeys.tenant.shopTables })
    },
  })
}

export function usePreviewPublicCartOrder() {
  return useMutation({
    mutationFn: ({ code, tableId }: { code: string; tableId: string }) =>
      previewPublicCartOrder(code, tableId),
  })
}
