import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'
import type { RaListParams, RaListResult } from '@/core/api/resource-types'
import { toRaQueryString } from '@/core/api/resource-types'

import type {
  AddMemberRequest,
  ChangeMemberRoleRequest,
  CreateTeamRequest,
  TeamMemberCandidateResponse,
  TeamResponse,
  UpdateTeamRequest,
} from '../types/team'

interface TeamMemberCandidateListParams extends RaListParams {
  query?: string
}

const base = createResourceClient<
  TeamResponse,
  TeamResponse,
  CreateTeamRequest,
  UpdateTeamRequest,
  string
>('/crm/teams')

export const teamClient = {
  ...base,

  activate: (id: string): Promise<TeamResponse> =>
    httpClient.post<TeamResponse>(`/crm/teams/${id}/activate`, {}),

  deactivate: (id: string): Promise<TeamResponse> =>
    httpClient.post<TeamResponse>(`/crm/teams/${id}/deactivate`, {}),

  addMember: (id: string, body: AddMemberRequest): Promise<TeamResponse> =>
    httpClient.post<TeamResponse>(`/crm/teams/${id}/members`, body),

  listMemberCandidates: (
    id: string,
    params: TeamMemberCandidateListParams = {},
  ): Promise<RaListResult<TeamMemberCandidateResponse>> => {
    const { query: searchQuery, ...listParams } = params
    const query = new URLSearchParams(toRaQueryString(listParams))
    if (searchQuery && searchQuery.trim()) {
      query.set('query', searchQuery.trim())
    }
    return httpClient.requestList<TeamMemberCandidateResponse>(
      `/crm/teams/${id}/member-candidates?${query.toString()}`,
    )
  },

  removeMember: (id: string, userId: string): Promise<TeamResponse> =>
    httpClient.del<TeamResponse>(`/crm/teams/${id}/members/${encodeURIComponent(userId)}`),

  changeMemberRole: (
    id: string,
    userId: string,
    body: ChangeMemberRoleRequest,
  ): Promise<TeamResponse> =>
    httpClient.patch<TeamResponse>(
      `/crm/teams/${id}/members/${encodeURIComponent(userId)}/role`,
      body,
    ),
}
