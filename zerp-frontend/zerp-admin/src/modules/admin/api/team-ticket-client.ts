import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'

import type {
  AddCommentRequest,
  AssignTicketRequest,
  ChangePriorityRequest,
  ChangeStatusRequest,
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

export const teamTicketClient = {
  ...base,

  addComment: (id: string, body: AddCommentRequest): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/crm/tickets/${id}/comments`, body),

  close: (id: string): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/crm/tickets/${id}/close`, {}),

  changeStatus: (id: string, body: ChangeStatusRequest): Promise<TicketResponse> =>
    httpClient.patch<TicketResponse>(`/crm/tickets/${id}/status`, body),

  changePriority: (id: string, body: ChangePriorityRequest): Promise<TicketResponse> =>
    httpClient.patch<TicketResponse>(`/crm/tickets/${id}/priority`, body),

  assign: (id: string, body: AssignTicketRequest): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/crm/tickets/${id}/assign`, body),

  unassign: (id: string): Promise<TicketResponse> =>
    httpClient.del<TicketResponse>(`/crm/tickets/${id}/assign`),
}
