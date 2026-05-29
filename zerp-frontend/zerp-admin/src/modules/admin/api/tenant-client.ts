import { parseApiEnvelope } from '@/core/api/base-http-client'
import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'
import type { ApiErrorPayload } from '@/core/types/api'
import { ApiError } from '@/core/types/api'

import type {
  CreateTenantRequest,
  TenantImageUploadResponse,
  TenantResponse,
  UpdateTenantRequest,
} from '../types/tenant'

const base = createResourceClient<
  TenantResponse,
  TenantResponse,
  CreateTenantRequest,
  UpdateTenantRequest,
  string
>('/user/tenants')

export const tenantClient = {
  ...base,
  checkName: (name: string): Promise<{ available: boolean }> =>
    httpClient.get<{ available: boolean }>(
      `/user/tenants/check-name?name=${encodeURIComponent(name)}`,
    ),
  getImageUrl: (tenantId: string): string =>
    `/api/user/tenants/${encodeURIComponent(tenantId)}/image`,
  uploadImage: (id: string, file: File): Promise<TenantImageUploadResponse> =>
    uploadTenantImage(id, file),
}

async function uploadTenantImage(id: string, file: File): Promise<TenantImageUploadResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`/api/user/tenants/${encodeURIComponent(id)}/image`, {
    method: 'POST',
    body: formData,
  })
  const payload = await safeJson(response)

  if (!response.ok) {
    const apiPayload = payload as ApiErrorPayload | null
    const message = apiPayload?.message || apiPayload?.error || 'Request failed'
    throw new ApiError(message, response.status, apiPayload ?? undefined)
  }

  return parseApiEnvelope<TenantImageUploadResponse>(payload)
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
