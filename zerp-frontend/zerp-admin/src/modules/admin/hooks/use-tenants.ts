'use client'

import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'

import { tenantClient } from '../api/tenant-client'

const {
  useList: useTenants,
  useOne: useTenant,
  useCreate: useCreateTenant,
  useUpdate: useUpdateTenant,
  usePatch: usePatchTenant,
  useDelete: useDeleteTenant,
  useDeleteMany: useDeleteManyTenants,
} = createResourceHooks(queryKeys.admin.tenants, tenantClient)

export {
  useCreateTenant,
  useDeleteManyTenants,
  useDeleteTenant,
  usePatchTenant,
  useTenant,
  useTenants,
  useUpdateTenant,
}
