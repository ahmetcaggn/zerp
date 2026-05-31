import { httpClient } from '@/core/api/http-client'

import type {
  PermissionGroupAssignRequestDto,
  PermissionGroupAssignResponseDto,
  PermissionGroupAssignmentResponseDto,
  PermissionGroupAssignmentRevokeResponseDto,
  PermissionGroupCreateRequestDto,
  PermissionGroupPatchRequestDto,
  PermissionGroupResponseDto,
  PermissionGroupUpdateRequestDto,
  PredefinedPermissionGroupCode,
} from '../types/permission-group'

export const permissionGroupClient = {
  listPredefined: (): Promise<PermissionGroupResponseDto[]> =>
    httpClient.get<PermissionGroupResponseDto[]>('/user/permission-groups/predefined'),

  getPredefined: (code: PredefinedPermissionGroupCode): Promise<PermissionGroupResponseDto> =>
    httpClient.get<PermissionGroupResponseDto>(`/user/permission-groups/predefined/${code}`),

  listCustom: (): Promise<PermissionGroupResponseDto[]> =>
    httpClient.get<PermissionGroupResponseDto[]>('/user/permission-groups'),

  getCustom: (id: string): Promise<PermissionGroupResponseDto> =>
    httpClient.get<PermissionGroupResponseDto>(`/user/permission-groups/${id}`),

  create: (payload: PermissionGroupCreateRequestDto): Promise<PermissionGroupResponseDto> =>
    httpClient.post<PermissionGroupResponseDto>('/user/permission-groups', payload),

  update: (id: string, payload: PermissionGroupUpdateRequestDto): Promise<PermissionGroupResponseDto> =>
    httpClient.put<PermissionGroupResponseDto>(`/user/permission-groups/${id}`, payload),

  patch: (id: string, payload: PermissionGroupPatchRequestDto): Promise<PermissionGroupResponseDto> =>
    httpClient.patch<PermissionGroupResponseDto>(`/user/permission-groups/${id}`, payload),

  delete: (id: string): Promise<void> =>
    httpClient.del<void>(`/user/permission-groups/${id}`),

  assign: (payload: PermissionGroupAssignRequestDto): Promise<PermissionGroupAssignResponseDto> =>
    httpClient.post<PermissionGroupAssignResponseDto>('/user/permission-groups/assign', payload),

  listAssignmentsByUser: (userId: string): Promise<PermissionGroupAssignmentResponseDto[]> =>
    httpClient.get<PermissionGroupAssignmentResponseDto[]>(
      `/user/permission-groups/assignments?userId=${encodeURIComponent(userId)}`,
    ),

  revokeAssignment: (assignmentId: string): Promise<PermissionGroupAssignmentRevokeResponseDto> =>
    httpClient.del<PermissionGroupAssignmentRevokeResponseDto>(
      `/user/permission-groups/assignments/${assignmentId}`,
    ),
}
