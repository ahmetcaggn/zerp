import type { IssueTypeValue } from './ticket'

export interface TeamMemberResponse {
  id?: string
  userId?: string
  displayName?: string
  username?: string
  email?: string
  role?: TeamMemberRoleValue
  joinedAt?: string
}

export interface TeamMemberCandidateResponse {
  id: string
  displayName: string
  displayLabel: string
  username: string
  email: string
}

export interface TeamResponse {
  id?: string
  name?: string
  description?: string
  type?: IssueTypeValue
  isActive?: boolean
  members?: TeamMemberResponse[]
}

export interface CreateTeamRequest {
  name: string
  description?: string
  type: IssueTypeValue
}

export interface UpdateTeamRequest {
  name?: string
  description?: string
  type?: IssueTypeValue
}

export const TeamMemberRole = {
  Leader: 'LEADER',
  Member: 'MEMBER',
} as const

export type TeamMemberRoleValue = (typeof TeamMemberRole)[keyof typeof TeamMemberRole]

export interface AddMemberRequest {
  userId: string
  role: TeamMemberRoleValue
}

export interface ChangeMemberRoleRequest {
  role: TeamMemberRoleValue
}
