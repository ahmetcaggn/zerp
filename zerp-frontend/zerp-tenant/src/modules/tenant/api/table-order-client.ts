import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'

import type {
  CreateTableOrderRequestDto,
  PublicCartOrderPreviewDto,
  TableOrderListResponseDto,
  TableOrderResponseDto,
  UpdateTableOrderRequestDto,
} from '../types/sale'

export const tableOrderClient = createResourceClient<
  TableOrderResponseDto,
  TableOrderListResponseDto,
  CreateTableOrderRequestDto,
  UpdateTableOrderRequestDto,
  string
>('/sale/table-orders')

export function previewPublicCartOrder(
  code: string,
  tableId: string,
): Promise<PublicCartOrderPreviewDto> {
  return httpClient.get<PublicCartOrderPreviewDto>(
    `/sale/table-orders/public-cart-orders/preview?code=${encodeURIComponent(code)}&tableId=${encodeURIComponent(tableId)}`,
  )
}
