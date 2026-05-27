import { httpClient } from '@/core/api/http-client'

import type {
  PermissionGroupAssignRequest,
  PermissionGroupAssignResponse,
  PermissionGroupCreateRequest,
  PermissionGroupPatchRequest,
  PermissionGroupResponse,
  PermissionGroupUpdateRequest,
  PredefinedPermissionGroupCode,
} from '../types/permission-group'

const TENANT_HEADER_KEY = 'X-Tenant-Id'

function withTenantHeaders(tenantId: string) {
  return {
    headers: {
      [TENANT_HEADER_KEY]: tenantId,
    },
  }
}

export const permissionGroupClient = {
  listPredefined: (tenantId: string): Promise<PermissionGroupResponse[]> =>
    httpClient.get<PermissionGroupResponse[]>(
      '/user/permission-groups/predefined',
      withTenantHeaders(tenantId),
    ),

  getPredefined: (tenantId: string, code: PredefinedPermissionGroupCode): Promise<PermissionGroupResponse> =>
    httpClient.get<PermissionGroupResponse>(
      `/user/permission-groups/predefined/${code}`,
      withTenantHeaders(tenantId),
    ),

  listCustom: (tenantId: string): Promise<PermissionGroupResponse[]> =>
    httpClient.get<PermissionGroupResponse[]>(
      '/user/permission-groups',
      withTenantHeaders(tenantId),
    ),

  getCustom: (tenantId: string, id: string): Promise<PermissionGroupResponse> =>
    httpClient.get<PermissionGroupResponse>(
      `/user/permission-groups/${id}`,
      withTenantHeaders(tenantId),
    ),

  create: (tenantId: string, payload: PermissionGroupCreateRequest): Promise<PermissionGroupResponse> =>
    httpClient.post<PermissionGroupResponse>(
      '/user/permission-groups',
      payload,
      withTenantHeaders(tenantId),
    ),

  update: (tenantId: string, id: string, payload: PermissionGroupUpdateRequest): Promise<PermissionGroupResponse> =>
    httpClient.put<PermissionGroupResponse>(
      `/user/permission-groups/${id}`,
      payload,
      withTenantHeaders(tenantId),
    ),

  patch: (tenantId: string, id: string, payload: PermissionGroupPatchRequest): Promise<PermissionGroupResponse> =>
    httpClient.patch<PermissionGroupResponse>(
      `/user/permission-groups/${id}`,
      payload,
      withTenantHeaders(tenantId),
    ),

  delete: (tenantId: string, id: string): Promise<void> =>
    httpClient.del<void>(
      `/user/permission-groups/${id}`,
      withTenantHeaders(tenantId),
    ),

  assign: (tenantId: string, payload: PermissionGroupAssignRequest): Promise<PermissionGroupAssignResponse> =>
    httpClient.post<PermissionGroupAssignResponse>(
      '/user/permission-groups/assign',
      payload,
      withTenantHeaders(tenantId),
    ),
}
