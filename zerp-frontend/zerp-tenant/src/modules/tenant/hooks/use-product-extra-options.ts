'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { productExtraOptionClient } from '../api/product-extra-option-client'

const {
  useList: useProductExtraOptions,
  useOne: useProductExtraOption,
  useCreate: useCreateProductExtraOption,
  useUpdate: useUpdateProductExtraOption,
  usePatch: usePatchProductExtraOption,
  useDelete: useDeleteProductExtraOption,
} = createResourceHooks(queryKeys.tenant.productExtraOptions, productExtraOptionClient)

export {
  useProductExtraOptions,
  useProductExtraOption,
  useCreateProductExtraOption,
  useUpdateProductExtraOption,
  usePatchProductExtraOption,
  useDeleteProductExtraOption,
}
