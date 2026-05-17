'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import type { RaListParams } from '@/core/api/resource-types'

import { teamClient } from '../api/team-client'
import type { AddMemberRequest, ChangeMemberRoleRequest } from '../types/team'

const {
  useList: useTeams,
  useOne: useTeam,
  useCreate: useCreateTeam,
  useUpdate: useUpdateTeam,
  usePatch: usePatchTeam,
  useDelete: useDeleteTeam,
  useDeleteMany: useDeleteManyTeams,
} = createResourceHooks(queryKeys.admin.teams, teamClient)

export {
  useCreateTeam,
  useDeleteManyTeams,
  useDeleteTeam,
  usePatchTeam,
  useTeam,
  useTeams,
  useUpdateTeam,
}

export function useActivateTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => teamClient.activate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.admin.teams }),
  })
}

export function useDeactivateTeam() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => teamClient.deactivate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.admin.teams }),
  })
}

export function useAddTeamMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AddMemberRequest }) =>
      teamClient.addMember(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.teams })
      qc.invalidateQueries({ queryKey: queryKeys.admin.teamMemberCandidates })
    },
  })
}

interface TeamMemberCandidateListParams extends RaListParams {
  query?: string
}

export function useTeamMemberCandidates(
  id: string | undefined,
  params: TeamMemberCandidateListParams = {},
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: [...queryKeys.admin.teamMemberCandidates, id ?? 'unknown', params] as const,
    queryFn: () => teamClient.listMemberCandidates(id as string, params),
    enabled: Boolean(id) && (options.enabled ?? true),
    staleTime: 30_000,
  })
}

export function useRemoveTeamMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      teamClient.removeMember(id, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.teams })
      qc.invalidateQueries({ queryKey: queryKeys.admin.teamMemberCandidates })
    },
  })
}

export function useChangeTeamMemberRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      userId,
      body,
    }: {
      id: string
      userId: string
      body: ChangeMemberRoleRequest
    }) => teamClient.changeMemberRole(id, userId, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.admin.teams }),
  })
}
