import { createResourceClient } from '@/core/api/resource-client'
import type {
  ProductExtraOptionResponseDto,
  ProductExtraOptionListResponseDto,
  CreateProductExtraOptionRequestDto,
  UpdateProductExtraOptionRequestDto,
} from '../types/sale'

export const productExtraOptionClient = createResourceClient<
  ProductExtraOptionResponseDto,
  ProductExtraOptionListResponseDto,
  CreateProductExtraOptionRequestDto,
  UpdateProductExtraOptionRequestDto,
  string
>('/sale/product-extra-options')
