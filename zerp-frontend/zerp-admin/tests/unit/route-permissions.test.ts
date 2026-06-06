import { describe, expect, it, vi } from 'vitest'

import { canAccessProtectedRoute, removeLocalePrefix } from '@/core/permissions/route-permissions'
import { PermissionActions } from '@/core/permissions/use-permissions'

describe('route permissions', () => {
  it('removes the locale prefix before route matching', () => {
    expect(removeLocalePrefix('/tr/tenants/tenant-1', 'tr')).toBe('/tenants/tenant-1')
    expect(removeLocalePrefix('/en', 'en')).toBe('/')
  })

  it('allows routes without permission requirements', () => {
    const checks = {
      hasAnyPermission: vi.fn(() => false),
      hasAnyPermissionForTarget: vi.fn(() => false),
    }

    expect(canAccessProtectedRoute('/dashboard', checks)).toBe(true)
    expect(canAccessProtectedRoute('/profile', checks)).toBe(true)
  })

  it('checks list routes by action', () => {
    const checks = {
      hasAnyPermission: vi.fn((actions: readonly string[]) =>
        actions.includes(PermissionActions.READ_TICKET),
      ),
      hasAnyPermissionForTarget: vi.fn(() => false),
    }

    expect(canAccessProtectedRoute('/team-tickets', checks)).toBe(true)
    expect(checks.hasAnyPermission).toHaveBeenCalledWith([
      PermissionActions.READ_TICKET,
      PermissionActions.ADMIN,
    ])
  })

  it('checks tenant nested routes by target', () => {
    const checks = {
      hasAnyPermission: vi.fn(() => false),
      hasAnyPermissionForTarget: vi.fn(() => true),
    }

    expect(canAccessProtectedRoute('/tenants/tenant-1/permission-groups', checks)).toBe(true)
    expect(checks.hasAnyPermissionForTarget).toHaveBeenCalledWith([PermissionActions.ADMIN], {
      targetType: 'TENANT',
      targetId: 'tenant-1',
      tenantId: 'tenant-1',
      parentTargets: [],
    })
  })

  it('requires root employee create permission for the current employee create route', () => {
    const checks = {
      hasAnyPermission: vi.fn((actions: readonly string[]) =>
        actions.includes(PermissionActions.CREATE_EMPLOYEE_ANY_TENANT),
      ),
      hasAnyPermissionForTarget: vi.fn(() => false),
    }

    expect(canAccessProtectedRoute('/tenants/tenant-1/employees/new', checks)).toBe(true)
    expect(checks.hasAnyPermissionForTarget).not.toHaveBeenCalled()
  })

  it('denies protected routes that are not in the central route permission config', () => {
    const checks = {
      hasAnyPermission: vi.fn(() => true),
      hasAnyPermissionForTarget: vi.fn(() => true),
    }

    expect(canAccessProtectedRoute('/unregistered-protected-route', checks)).toBe(false)
    expect(checks.hasAnyPermission).not.toHaveBeenCalled()
    expect(checks.hasAnyPermissionForTarget).not.toHaveBeenCalled()
  })
})
