import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'
import type {
  AddMemberRequest,
  ChangeMemberRoleRequest,
  CreateTeamRequest,
  TeamResponse,
  UpdateTeamRequest,
} from '../types/team'

const base = createResourceClient<
  TeamResponse,
  TeamResponse,
  CreateTeamRequest,
  UpdateTeamRequest,
  string
>('/teams')

export const teamClient = {
  ...base,

  activate: (id: string): Promise<TeamResponse> =>
    httpClient.post<TeamResponse>(`/teams/${id}/activate`, {}),

  deactivate: (id: string): Promise<TeamResponse> =>
    httpClient.post<TeamResponse>(`/teams/${id}/deactivate`, {}),

  addMember: (id: string, body: AddMemberRequest): Promise<TeamResponse> =>
    httpClient.post<TeamResponse>(`/teams/${id}/members`, body),

  removeMember: (id: string, userId: string): Promise<TeamResponse> =>
    httpClient.del<TeamResponse>(`/teams/${id}/members/${encodeURIComponent(userId)}`),

  changeMemberRole: (
    id: string,
    userId: string,
    body: ChangeMemberRoleRequest,
  ): Promise<TeamResponse> =>
    httpClient.put<TeamResponse>(
      `/teams/${id}/members/${encodeURIComponent(userId)}/role`,
      body,
    ),
}
