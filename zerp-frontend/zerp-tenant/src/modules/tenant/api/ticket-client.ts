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
>('/tickets')

export const ticketClient = {
  ...base,

  getById: (id: string): Promise<TicketResponse> =>
    httpClient.get<TicketResponse>(`/tickets/${id}`),

  addComment: (id: string, body: AddCommentRequest): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/tickets/${id}/comments`, body),

  close: (id: string): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/tickets/${id}/close`, {}),

  changeStatus: (id: string, body: ChangeStatusRequest): Promise<TicketResponse> =>
    httpClient.patch<TicketResponse>(`/tickets/${id}/status`, body),

  changePriority: (id: string, body: ChangePriorityRequest): Promise<TicketResponse> =>
    httpClient.patch<TicketResponse>(`/tickets/${id}/priority`, body),

  assign: (id: string, body: AssignTicketRequest): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/tickets/${id}/assign`, body),

  unassign: (id: string): Promise<TicketResponse> =>
    httpClient.del<TicketResponse>(`/tickets/${id}/assign`),
}
