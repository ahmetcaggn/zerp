'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'

import { teamTicketClient } from '../api/team-ticket-client'
import type {
  AddCommentRequest,
  AssignTicketRequest,
  ChangePriorityRequest,
  ChangeStatusRequest,
  CreateTicketRequest,
  TicketResponse,
  UpdateTicketRequest,
} from '../types/ticket'

const {
  useList: useTeamTickets,
  useOne: useTeamTicket,
  useCreate: useCreateTeamTicket,
  useUpdate: useUpdateTeamTicket,
  usePatch: usePatchTeamTicket,
} = createResourceHooks<
  TicketResponse,
  TicketResponse,
  CreateTicketRequest,
  UpdateTicketRequest,
  string
>(queryKeys.admin.teamTickets, teamTicketClient)

export {
  useCreateTeamTicket,
  usePatchTeamTicket,
  useTeamTicket,
  useTeamTickets,
  useUpdateTeamTicket,
}

const ticketDetailKey = (id: string) =>
  [...queryKeys.admin.teamTickets, 'detail', id] as const

export function useAddTeamTicketComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AddCommentRequest }) =>
      teamTicketClient.addComment(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.teamTickets })
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) })
    },
  })
}

export function useCloseTeamTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => teamTicketClient.close(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.teamTickets })
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) })
    },
  })
}

export function useChangeTeamTicketStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ChangeStatusRequest }) =>
      teamTicketClient.changeStatus(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.teamTickets })
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) })
    },
  })
}

export function useChangeTeamTicketPriority() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ChangePriorityRequest }) =>
      teamTicketClient.changePriority(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.teamTickets })
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) })
    },
  })
}

export function useAssignTeamTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AssignTicketRequest }) =>
      teamTicketClient.assign(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.teamTickets })
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) })
    },
  })
}

export function useUnassignTeamTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => teamTicketClient.unassign(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.teamTickets })
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) })
    },
  })
}
