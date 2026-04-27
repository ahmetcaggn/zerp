'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { ticketClient } from '../api/ticket-client'
import type {
  AddCommentRequest,
  ChangePriorityRequest,
  ChangeStatusRequest,
  CreateTicketRequest,
} from '../types/ticket'

const ticketDetailKey = (id: string) =>
  [...queryKeys.tenant.tickets, 'detail', id] as const

export function useTicket(id: string | undefined) {
  return useQuery({
    queryKey: ticketDetailKey(id!),
    queryFn: () => ticketClient.getById(id!),
    enabled: id !== undefined,
  })
}

export function useCreateTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateTicketRequest) => ticketClient.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.tenant.tickets }),
  })
}

export function useAddComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AddCommentRequest }) =>
      ticketClient.addComment(id, body),
    onSuccess: (_, { id }) =>
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) }),
  })
}

export function useCloseTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ticketClient.close(id),
    onSuccess: (_, id) => qc.invalidateQueries({ queryKey: ticketDetailKey(id) }),
  })
}

export function useChangeTicketStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ChangeStatusRequest }) =>
      ticketClient.changeStatus(id, body),
    onSuccess: (_, { id }) =>
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) }),
  })
}

export function useChangePriority() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ChangePriorityRequest }) =>
      ticketClient.changePriority(id, body),
    onSuccess: (_, { id }) =>
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) }),
  })
}
