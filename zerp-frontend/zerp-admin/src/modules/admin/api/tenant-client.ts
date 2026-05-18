import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'

import type { CreateTenantRequest, TenantResponse, UpdateTenantRequest } from '../types/tenant'

const base = createResourceClient<
  TenantResponse,
  TenantResponse,
  CreateTenantRequest,
  UpdateTenantRequest,
  string
>('/user/tenants')

export const tenantClient = {
  ...base,
  checkName: (name: string): Promise<{ available: boolean }> =>
    httpClient.get<{ available: boolean }>(
      `/user/tenants/check-name?name=${encodeURIComponent(name)}`,
    ),
}
