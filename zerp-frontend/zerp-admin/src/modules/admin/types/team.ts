export interface TeamMemberResponse {
  id?: string
  userId?: string
  role?: TeamMemberRoleValue
  joinedAt?: string
}

export interface TeamResponse {
  id?: string
  name?: string
  description?: string
  isActive?: boolean
  members?: TeamMemberResponse[]
}

export interface CreateTeamRequest {
  name: string
  description?: string
}

export interface UpdateTeamRequest {
  name?: string
  description?: string
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
