import { parseApiEnvelope } from '@/core/api/base-http-client'
import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'
import type { RaListParams, RaListResult } from '@/core/api/resource-types'
import { toRaQueryString } from '@/core/api/resource-types'
import type { ApiErrorPayload } from '@/core/types/api'
import { ApiError } from '@/core/types/api'

import type {
  AddCommentRequest,
  AssignTicketRequest,
  AssignmentTeamCandidateResponse,
  AssignmentTeamMemberCandidateResponse,
  AttachmentResponse,
  ChangePriorityRequest,
  ChangeStatusRequest,
  CreateTicketRequest,
  TicketResponse,
  UpdateTicketRequest,
} from '../types/ticket'

interface AssignmentTeamCandidateListParams extends RaListParams {
  query?: string
}

interface AssignmentTeamMemberCandidateListParams extends RaListParams {
  query?: string
  teamId: string
}

const base = createResourceClient<
  TicketResponse,
  TicketResponse,
  CreateTicketRequest,
  UpdateTicketRequest,
  string
>('/crm/tickets')

export const teamTicketClient = {
  ...base,

  addComment: (id: string, body: AddCommentRequest): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/crm/tickets/${id}/comments`, body),

  changeStatus: (id: string, body: ChangeStatusRequest): Promise<TicketResponse> =>
    httpClient.patch<TicketResponse>(`/crm/tickets/${id}/status`, body),

  changePriority: (id: string, body: ChangePriorityRequest): Promise<TicketResponse> =>
    httpClient.patch<TicketResponse>(`/crm/tickets/${id}/priority`, body),

  assign: (id: string, body: AssignTicketRequest): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/crm/tickets/${id}/assign`, body),

  unassign: (id: string): Promise<TicketResponse> =>
    httpClient.del<TicketResponse>(`/crm/tickets/${id}/assign`),

  listAssignmentTeams: (
    id: string,
    params: AssignmentTeamCandidateListParams = {},
  ): Promise<RaListResult<AssignmentTeamCandidateResponse>> => {
    const { query: searchQuery, ...listParams } = params
    const query = new URLSearchParams(toRaQueryString(listParams))
    if (searchQuery && searchQuery.trim()) {
      query.set('query', searchQuery.trim())
    }
    return httpClient.requestList<AssignmentTeamCandidateResponse>(
      `/crm/tickets/${id}/assignment-candidates/teams?${query.toString()}`,
    )
  },

  listAssignmentTeamMembers: (
    id: string,
    params: AssignmentTeamMemberCandidateListParams,
  ): Promise<RaListResult<AssignmentTeamMemberCandidateResponse>> => {
    const { query: searchQuery, teamId, ...listParams } = params
    const query = new URLSearchParams(toRaQueryString(listParams))
    query.set('teamId', teamId)
    if (searchQuery && searchQuery.trim()) {
      query.set('query', searchQuery.trim())
    }
    return httpClient.requestList<AssignmentTeamMemberCandidateResponse>(
      `/crm/tickets/${id}/assignment-candidates/members?${query.toString()}`,
    )
  },

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
