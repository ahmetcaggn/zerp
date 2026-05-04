'use client'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { productRecipeClient } from '../api/product-recipe-client'

const {
  useList: useProductRecipes,
  useOne: useProductRecipe,
  useCreate: useCreateProductRecipe,
  useUpdate: useUpdateProductRecipe,
  usePatch: usePatchProductRecipe,
  useDelete: useDeleteProductRecipe,
} = createResourceHooks(queryKeys.tenant.productRecipes, productRecipeClient)

export {
  useProductRecipes,
  useProductRecipe,
  useCreateProductRecipe,
  useUpdateProductRecipe,
  usePatchProductRecipe,
  useDeleteProductRecipe,
}
