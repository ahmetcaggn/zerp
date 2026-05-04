'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { productClient } from '../api/product-client'

const {
  useList: useProducts,
  useOne: useProduct,
  useCreate: useCreateProduct,
  useUpdate: useUpdateProduct,
  usePatch: usePatchProduct,
  useDelete: useDeleteProduct,
  useDeleteMany: useDeleteManyProducts,
} = createResourceHooks(queryKeys.tenant.products, productClient)

export {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  usePatchProduct,
  useDeleteProduct,
  useDeleteManyProducts,
}
