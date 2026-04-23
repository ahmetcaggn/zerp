export type {
  TeamResponse,
  TeamMemberResponse,
  CreateTeamRequest,
  UpdateTeamRequest,
  AddMemberRequest,
  ChangeMemberRoleRequest,
} from '@/modules/generated/openapi_crm/api'

export { AddMemberRequestRoleEnum as TeamMemberRole } from '@/modules/generated/openapi_crm/api'

export type TeamMemberRoleValue = 'LEADER' | 'MEMBER'
