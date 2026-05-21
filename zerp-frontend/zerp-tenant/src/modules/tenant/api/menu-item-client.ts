import { parseApiEnvelope } from '@/core/api/base-http-client'
import { createResourceClient } from '@/core/api/resource-client'
import type { ApiErrorPayload } from '@/core/types/api'
import { ApiError } from '@/core/types/api'
import type {
  MenuItemImageUploadResponseDto,
  MenuItemResponseDto,
  MenuItemListResponseDto,
  CreateMenuItemRequestDto,
  UpdateMenuItemRequestDto,
} from '../types/sale'

export const menuItemClient = createResourceClient<
  MenuItemResponseDto,
  MenuItemListResponseDto,
  CreateMenuItemRequestDto,
  UpdateMenuItemRequestDto,
  string
>('/sale/menu-items')

export async function uploadMenuItemImage(
  file: File,
  categoryId: string,
): Promise<MenuItemImageUploadResponseDto> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('categoryId', categoryId)

  const response = await fetch('/api/sale/menu-items/images', {
    method: 'POST',
    body: formData,
  })
  const payload = await safeJson(response)

  if (!response.ok) {
    const apiPayload = payload as ApiErrorPayload | null
    const message = apiPayload?.message || apiPayload?.error || 'Request failed'
    throw new ApiError(message, response.status, apiPayload ?? undefined)
  }

  return parseApiEnvelope<MenuItemImageUploadResponseDto>(payload)
}

async function safeJson(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
