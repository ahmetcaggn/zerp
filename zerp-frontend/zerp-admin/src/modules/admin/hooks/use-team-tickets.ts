'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import type { RaListParams } from '@/core/api/resource-types'

import { teamTicketClient } from '../api/team-ticket-client'
import type {
  AddCommentRequest,
  AssignTicketRequest,
  AttachmentResponse,
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

export function useUploadTeamTicketAttachment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }): Promise<AttachmentResponse> =>
      teamTicketClient.uploadAttachment(id, file),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.teamTickets })
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) })
    },
  })
}

interface AssignmentTeamCandidateListParams extends RaListParams {
  query?: string
}

interface AssignmentTeamMemberCandidateListParams extends RaListParams {
  query?: string
  teamId: string
}

export function useAssignmentTeamCandidates(
  ticketId: string | undefined,
  params: AssignmentTeamCandidateListParams = {},
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: [...queryKeys.admin.ticketAssignmentTeams, ticketId ?? 'unknown', params] as const,
    queryFn: () => teamTicketClient.listAssignmentTeams(ticketId as string, params),
    enabled: Boolean(ticketId) && (options.enabled ?? true),
    staleTime: 30_000,
  })
}

export function useAssignmentTeamMemberCandidates(
  ticketId: string | undefined,
  params: AssignmentTeamMemberCandidateListParams | undefined,
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: [
      ...queryKeys.admin.ticketAssignmentTeamMembers,
      ticketId ?? 'unknown',
      params?.teamId ?? 'none',
      params ?? {},
    ] as const,
    queryFn: () => teamTicketClient.listAssignmentTeamMembers(ticketId as string, params as AssignmentTeamMemberCandidateListParams),
    enabled: Boolean(ticketId) && Boolean(params?.teamId) && (options.enabled ?? true),
    staleTime: 30_000,
  })
}
