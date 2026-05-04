import { createResourceClient } from '@/core/api/resource-client'
import type {
  ProductRecipeResponseDto,
  ProductRecipeListResponseDto,
  CreateProductRecipeRequestDto,
  UpdateProductRecipeRequestDto,
} from '../types/sale'

export const productRecipeClient = createResourceClient<
  ProductRecipeResponseDto,
  ProductRecipeListResponseDto,
  CreateProductRecipeRequestDto,
  UpdateProductRecipeRequestDto,
  string
>('/sale/product-recipes')
