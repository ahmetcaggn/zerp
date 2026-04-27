import { httpClient } from '@/core/api/http-client'
import type {
  AddCommentRequest,
  ChangePriorityRequest,
  ChangeStatusRequest,
  CreateTicketRequest,
  TicketResponse,
} from '../types/ticket'

export const ticketClient = {
  getById: (id: string): Promise<TicketResponse> =>
    httpClient.get<TicketResponse>(`/tickets/${id}`),

  create: (body: CreateTicketRequest): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>('/tickets', body),

  addComment: (id: string, body: AddCommentRequest): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/tickets/${id}/comments`, body),

  close: (id: string): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/tickets/${id}/close`, {}),

  changeStatus: (id: string, body: ChangeStatusRequest): Promise<TicketResponse> =>
    httpClient.patch<TicketResponse>(`/tickets/${id}/status`, body),

  changePriority: (id: string, body: ChangePriorityRequest): Promise<TicketResponse> =>
    httpClient.patch<TicketResponse>(`/tickets/${id}/priority`, body),
}
