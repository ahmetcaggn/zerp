import { parseApiEnvelope } from '@/core/api/base-http-client'
import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'
import type { ApiErrorPayload } from '@/core/types/api'
import { ApiError } from '@/core/types/api'

import type {
  AddCommentRequest,
  AttachmentResponse,
  CreateTicketRequest,
  TicketResponse,
  UpdateTicketRequest,
} from '../types/ticket'

const base = createResourceClient<
  TicketResponse,
  TicketResponse,
  CreateTicketRequest,
  UpdateTicketRequest,
  string
>('/crm/tickets')

export const ticketClient = {
  ...base,

  addComment: (id: string, body: AddCommentRequest): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/crm/tickets/${id}/comments`, body),

  uploadAttachment: (id: string, file: File): Promise<AttachmentResponse> =>
    uploadTicketAttachment(id, file),

  getAttachmentUrl: (ticketId: string, attachmentId: string | number): string =>
    `/api/crm/tickets/${encodeURIComponent(ticketId)}/attachments/${encodeURIComponent(attachmentId)}`,
}

async function uploadTicketAttachment(id: string, file: File): Promise<AttachmentResponse> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`/api/crm/tickets/${encodeURIComponent(id)}/attachments`, {
    method: 'POST',
    body: formData,
  })
  const payload = await safeJson(response)

  if (!response.ok) {
    const apiPayload = payload as ApiErrorPayload | null
    const message = apiPayload?.message || apiPayload?.error || 'Request failed'
    throw new ApiError(message, response.status, apiPayload ?? undefined)
  }

  return parseApiEnvelope<AttachmentResponse>(payload)
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
