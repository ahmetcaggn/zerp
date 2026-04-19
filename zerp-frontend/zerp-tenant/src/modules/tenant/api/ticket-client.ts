import { httpClient } from '@/core/api/http-client'
import type {
  AddCommentRequest,
  ChangePriorityRequest,
  ChangeStatusRequest,
  CreateTicketRequest,
  TicketResponse,
} from '../types/ticket'

export const ticketClient = {
  getById: (id: number): Promise<TicketResponse> =>
    httpClient.get<TicketResponse>(`/api/tickets/${id}`),

  create: (body: CreateTicketRequest): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>('/api/tickets', body),

  addComment: (id: number, body: AddCommentRequest): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/api/tickets/${id}/comments`, body),

  close: (id: number): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/api/tickets/${id}/close`, {}),

  changeStatus: (id: number, body: ChangeStatusRequest): Promise<TicketResponse> =>
    httpClient.patch<TicketResponse>(`/api/tickets/${id}/status`, body),

  changePriority: (id: number, body: ChangePriorityRequest): Promise<TicketResponse> =>
    httpClient.patch<TicketResponse>(`/api/tickets/${id}/priority`, body),
}
