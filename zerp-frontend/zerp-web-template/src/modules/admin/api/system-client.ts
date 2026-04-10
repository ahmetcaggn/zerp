import { httpClient } from '@/core/api/http-client'

export interface SystemHealth {
  gateway: 'UP' | 'DOWN'
  employee: 'UP' | 'DOWN'
  crm: 'UP' | 'DOWN'
  notification: 'UP' | 'DOWN'
}

export const adminSystemClient = {
  getHealth: () => httpClient.request<SystemHealth>('/admin/system/health'),
}
