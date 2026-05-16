import { createResourceClient } from '@/core/api/resource-client'
import type {
  TableOrderResponseDto,
  TableOrderListResponseDto,
  CreateTableOrderRequestDto,
  UpdateTableOrderRequestDto,
} from '../types/sale'

export const tableOrderClient = createResourceClient<
  TableOrderResponseDto,
  TableOrderListResponseDto,
  CreateTableOrderRequestDto,
  UpdateTableOrderRequestDto,
  string
>('/sale/table-orders')
