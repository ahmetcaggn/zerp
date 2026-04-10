import { httpClient } from '@/core/api/http-client'

export interface AdminTenant {
  id: string
  companyName: string
  status: 'ACTIVE' | 'PASSIVE'
  createdAt: string
}

export const adminTenantClient = {
  listTenants: () => httpClient.request<AdminTenant[]>('/admin/tenants'),
}
