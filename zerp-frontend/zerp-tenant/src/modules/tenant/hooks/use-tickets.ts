'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'

import { ticketClient } from '../api/ticket-client'
import type { AddCommentRequest, AttachmentResponse } from '../types/ticket'

const {
  useList: useTickets,
  useOne: useTicket,
  useCreate: useCreateTicket,
  useUpdate: useUpdateTicket,
  usePatch: usePatchTicket,
} = createResourceHooks(queryKeys.tenant.tickets, ticketClient)

export { useCreateTicket, usePatchTicket, useTicket, useTickets, useUpdateTicket }

const ticketDetailKey = (id: string) =>
  [...queryKeys.tenant.tickets, 'detail', id] as const

export function useAddTicketComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AddCommentRequest }) =>
      ticketClient.addComment(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.tenant.tickets })
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) })
    },
  })
}

export function useUploadTicketAttachment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }): Promise<AttachmentResponse> =>
      ticketClient.uploadAttachment(id, file),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.tenant.tickets })
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) })
    },
  })
}
