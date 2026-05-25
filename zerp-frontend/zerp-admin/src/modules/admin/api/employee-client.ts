import { httpClient } from '@/core/api/http-client'
import type { RaListParams, RaListResult } from '@/core/api/resource-types'
import { toRaQueryString } from '@/core/api/resource-types'

import type {
  AdminCreateEmployeeRequest,
  CreateEmployeeRequest,
  EmployeeListResponse,
  EmployeeResponse,
  UpdateEmployeeRequest,
} from '../types/employee'

const EMPLOYEE_PATH = '/employee'
const TENANT_HEADER_KEY = 'X-Tenant-Id'

function getTenantRequestOptions(tenantId?: string) {
  const normalizedTenantId = tenantId?.trim()
  if (!normalizedTenantId) {
    return undefined
  }

  return {
    headers: {
      [TENANT_HEADER_KEY]: normalizedTenantId,
    },
  }
}

function mergeTenantFilter(tenantId: string, params: RaListParams = {}): RaListParams {
  return {
    ...params,
    filter: {
      ...(params.filter ?? {}),
      'tenantId.eq': tenantId,
    },
  }
}

export const employeeClient = {
  getList: (
    tenantId: string,
    params: RaListParams = {},
  ): Promise<RaListResult<EmployeeListResponse>> =>
    httpClient.requestList<EmployeeListResponse>(
      `${EMPLOYEE_PATH}?${toRaQueryString(mergeTenantFilter(tenantId, params))}`,
      getTenantRequestOptions(tenantId),
    ),

  getOne: (id: string, tenantId: string): Promise<EmployeeResponse> =>
    httpClient.get<EmployeeResponse>(`${EMPLOYEE_PATH}/${id}`, getTenantRequestOptions(tenantId)),

  create: (data: CreateEmployeeRequest, tenantId: string): Promise<EmployeeResponse> =>
    httpClient.post<EmployeeResponse>(EMPLOYEE_PATH, data, getTenantRequestOptions(tenantId)),

  createForTenant: (data: CreateEmployeeRequest, tenantId: string): Promise<EmployeeResponse> => {
    const normalizedTenantId = tenantId.trim()
    const requestData: AdminCreateEmployeeRequest = {
      ...data,
      tenantId: normalizedTenantId,
    }
    return httpClient.post<EmployeeResponse>(
      `${EMPLOYEE_PATH}/admin`,
      requestData,
      getTenantRequestOptions(normalizedTenantId),
    )
  },

  update: (id: string, data: UpdateEmployeeRequest, tenantId: string): Promise<EmployeeResponse> =>
    httpClient.put<EmployeeResponse>(`${EMPLOYEE_PATH}/${id}`, data, getTenantRequestOptions(tenantId)),

  delete: (id: string, tenantId: string): Promise<void> =>
    httpClient.del<void>(`${EMPLOYEE_PATH}/${id}`, getTenantRequestOptions(tenantId)),

  checkUsername: (username: string): Promise<{ available: boolean }> =>
    httpClient.get<{ available: boolean }>(
      `/user/usernames/check?username=${encodeURIComponent(username)}`,
    ),
}
