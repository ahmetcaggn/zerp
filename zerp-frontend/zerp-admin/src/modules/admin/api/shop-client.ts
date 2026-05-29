import { parseApiEnvelope } from '@/core/api/base-http-client'
import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'
import type { ApiErrorPayload } from '@/core/types/api'
import { ApiError } from '@/core/types/api'

import type {
  CreateShopRequest,
  ShopImageUploadResponse,
  ShopResponse,
  UpdateShopRequest,
} from '../types/shop'

const base = createResourceClient<ShopResponse, ShopResponse, CreateShopRequest, UpdateShopRequest, string>(
  '/sale/admin/shops',
)

export const shopClient = {
  ...base,
  checkName: (
    tenantId: string,
    name: string,
    shopId?: string,
  ): Promise<{ available: boolean }> => {
    const query = new URLSearchParams({
      tenantId,
      name,
    })

    if (shopId) {
      query.set('shopId', shopId)
    }

    return httpClient.get<{ available: boolean }>(`/sale/admin/shops/check-name?${query.toString()}`)
  },
  uploadImage: (id: string, file: File): Promise<ShopImageUploadResponse> =>
    uploadShopImage(id, file),
}

async function uploadShopImage(id: string, file: File): Promise<ShopImageUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`/api/sale/shops/${encodeURIComponent(id)}/image`, {
    method: 'POST',
    body: formData,
  })
  const payload = await safeJson(response)

  if (!response.ok) {
    const apiPayload = payload as ApiErrorPayload | null
    const message = apiPayload?.message || apiPayload?.error || 'Request failed'
    throw new ApiError(message, response.status, apiPayload ?? undefined)
  }

  return parseApiEnvelope<ShopImageUploadResponse>(payload)
}

async function safeJson(response: Response): Promise<unknown> {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}
