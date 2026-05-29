import { parseApiEnvelope } from '@/core/api/base-http-client'
import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'
import type { ApiErrorPayload } from '@/core/types/api'
import { ApiError } from '@/core/types/api'

import type {
  PatchShopRequestDto,
  ShopImageUploadResponseDto,
  ShopListResponseDto,
  ShopResponseDto,
  UpdateShopDefaultMenuLanguageRequestDto,
} from '../types/shop'

export const shopClient = createResourceClient<
  ShopResponseDto,
  ShopListResponseDto,
  void,
  void,
  string
>('/sale/shops')

export function updateShopDefaultMenuLanguage(
  shopId: string,
  payload: UpdateShopDefaultMenuLanguageRequestDto,
): Promise<ShopResponseDto> {
  return httpClient.patch<ShopResponseDto>(`/sale/shops/${shopId}`, payload)
}

export function patchShop(shopId: string, payload: PatchShopRequestDto): Promise<ShopResponseDto> {
  return httpClient.patch<ShopResponseDto>(`/sale/shops/${shopId}`, payload)
}

export async function uploadShopImage(
  shopId: string,
  file: File,
): Promise<ShopImageUploadResponseDto> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`/api/sale/shops/${encodeURIComponent(shopId)}/image`, {
    method: 'POST',
    body: formData,
  })
  const payload = await safeJson(response)

  if (!response.ok) {
    const apiPayload = payload as ApiErrorPayload | null
    const message = apiPayload?.message || apiPayload?.error || 'Request failed'
    throw new ApiError(message, response.status, apiPayload ?? undefined)
  }

  return parseApiEnvelope<ShopImageUploadResponseDto>(payload)
}

export function buildShopImageUrl(
  shopId: string,
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ORIGINAL' = 'MEDIUM',
): string {
  return `/api/sale/shops/${encodeURIComponent(shopId)}/image?size=${encodeURIComponent(size)}`
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
