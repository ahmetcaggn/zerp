'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { approveStockCount, stockCountClient } from '../api/stock-count-client'

const {
  useList: useStockCounts,
  useOne: useStockCount,
  useCreate: useCreateStockCount,
  useUpdate: useUpdateStockCount,
  usePatch: usePatchStockCount,
  useDelete: useDeleteStockCount,
  useDeleteMany: useDeleteManyStockCounts,
} = createResourceHooks(queryKeys.tenant.stockCounts, stockCountClient)

export {
  useStockCounts,
  useStockCount,
  useCreateStockCount,
  useUpdateStockCount,
  usePatchStockCount,
  useDeleteStockCount,
  useDeleteManyStockCounts,
}

export function useApproveStockCount() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => approveStockCount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockCounts })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockResources })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockOverview })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockMovements })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockMovementTimeline })
      queryClient.invalidateQueries({ queryKey: queryKeys.tenant.stockMovementDrillDown })
    },
  })
}
