'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import { ticketClient } from '../api/ticket-client'
import type {
  AddCommentRequest,
  AssignTicketRequest,
  ChangePriorityRequest,
  ChangeStatusRequest,
  CreateTicketRequest,
} from '../types/ticket'

const {
  useList: useTickets,
  useOne: useTicket,
  useCreate: useCreateTicket,
  useUpdate: useUpdateTicket,
  usePatch: usePatchTicket,
  useDelete: useDeleteTicket,
} = createResourceHooks(queryKeys.tenant.tickets, ticketClient)

export { useTickets, useTicket, useCreateTicket, useUpdateTicket, usePatchTicket, useDeleteTicket }

const ticketDetailKey = (id: string) =>
  [...queryKeys.tenant.tickets, 'detail', id] as const

export function useAddComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AddCommentRequest }) =>
      ticketClient.addComment(id, body),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ticketDetailKey(id) }),
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
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ticketDetailKey(id) }),
  })
}

export function useChangePriority() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ChangePriorityRequest }) =>
      ticketClient.changePriority(id, body),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ticketDetailKey(id) }),
  })
}

export function useAssignTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AssignTicketRequest }) =>
      ticketClient.assign(id, body),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: ticketDetailKey(id) }),
  })
}

export function useUnassignTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ticketClient.unassign(id),
    onSuccess: (_, id) => qc.invalidateQueries({ queryKey: ticketDetailKey(id) }),
  })
}
