import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'

import type {
  AddCommentRequest,
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
}
