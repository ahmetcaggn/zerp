'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { stockMovementClient } from '../api/stock-movement-client'

const {
  useList: useStockMovements,
  useOne: useStockMovement,
  useCreate: useCreateStockMovement,
  useUpdate: useUpdateStockMovement,
  usePatch: usePatchStockMovement,
  useDelete: useDeleteStockMovement,
  useDeleteMany: useDeleteManyStockMovements,
} = createResourceHooks(queryKeys.tenant.stockMovements, stockMovementClient)

export {
  useStockMovements,
  useStockMovement,
  useCreateStockMovement,
  useUpdateStockMovement,
  usePatchStockMovement,
  useDeleteStockMovement,
  useDeleteManyStockMovements,
}
