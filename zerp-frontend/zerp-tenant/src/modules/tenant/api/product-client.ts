import { createResourceClient } from '@/core/api/resource-client'
import type {
  ProductResponseDto,
  ProductListResponseDto,
  CreateProductRequestDto,
  UpdateProductRequestDto,
} from '../types/sale'

export const productClient = createResourceClient<
  ProductResponseDto,
  ProductListResponseDto,
  CreateProductRequestDto,
  UpdateProductRequestDto,
  string
>('/sale/products')
