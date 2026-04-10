import type { AppRole, AppVariant } from '@/core/types/common'

export const VARIANT_ALLOWED_ROLES: Record<AppVariant, AppRole[]> = {
  tenant: ['tenant_owner', 'tenant_employee'],
  client: ['client_user'],
  admin: ['admin_super', 'admin_operator'],
}
