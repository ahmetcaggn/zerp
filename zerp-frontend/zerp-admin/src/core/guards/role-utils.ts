import type { AppRole } from '@/core/types/common'

export function hasAnyRole(userRoles: AppRole[] = [], requiredRoles: AppRole[] = []): boolean {
  if (requiredRoles.length === 0) {
    return true
  }

  return requiredRoles.some((role) => userRoles.includes(role))
}
