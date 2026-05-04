'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { stockMovementClient } from '../api/stock-movement-client'

const {
  useList: useStockMovements,
  useMany: useStockMovementsMany,
  useManyReference: useStockMovementsManyReference,
  useOne: useStockMovement,
  useCreate: useCreateStockMovement,
  useUpdate: useUpdateStockMovement,
  usePatch: usePatchStockMovement,
  useDelete: useDeleteStockMovement,
  usePatchMany: usePatchManyStockMovements,
  useDeleteMany: useDeleteManyStockMovements,
} = createResourceHooks(queryKeys.tenant.stockMovements, stockMovementClient)

export {
  useStockMovements,
  useStockMovementsMany,
  useStockMovementsManyReference,
  useStockMovement,
  useCreateStockMovement,
  useUpdateStockMovement,
  usePatchStockMovement,
  useDeleteStockMovement,
  usePatchManyStockMovements,
  useDeleteManyStockMovements,
}
