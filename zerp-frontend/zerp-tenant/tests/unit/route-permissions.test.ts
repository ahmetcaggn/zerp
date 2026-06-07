import { describe, expect, it } from 'vitest'

import {
  canAccessProtectedRoute,
  getFirstAccessibleProtectedRoute,
} from '@/core/permissions/route-permissions'
import { type PermissionAction, PermissionActions } from '@/core/permissions/use-permissions'

function createChecks(
  grantedActions: readonly PermissionAction[],
  shopActions: readonly PermissionAction[] = [],
) {
  const grantedActionSet = new Set(grantedActions)
  const shopActionSet = new Set(shopActions)

  return {
    currentShopId: 'shop-1',
    hasAnyPermission: (actions: readonly PermissionAction[]) =>
      actions.some((action) => grantedActionSet.has(action)),
    hasTenantPermission: (action: PermissionAction) => shopActionSet.has(action),
    hasShopPermission: (action: PermissionAction) => shopActionSet.has(action),
    hasAnyShopPermission: (actions: readonly PermissionAction[]) =>
      actions.some((action) => shopActionSet.has(action)),
  }
}

describe('route permissions', () => {
  it('allows the dashboard route with only shop read permission', () => {
    expect(
      canAccessProtectedRoute('/dashboard', createChecks([PermissionActions.READ_SHOP])),
    ).toBe(true)
  })

  it('allows the shops route with only shop read permission', () => {
    expect(canAccessProtectedRoute('/shops', createChecks([PermissionActions.READ_SHOP]))).toBe(
      true,
    )
  })

  it('falls back from dashboard to shops for shop read users', () => {
    expect(
      getFirstAccessibleProtectedRoute(
        {
          ...createChecks([PermissionActions.READ_SHOP]),
          currentShopId: undefined,
        },
        '/dashboard',
      ),
    ).toBe('/shops')
  })

  it('allows the tenant dashboard route with tenant dashboard permission', () => {
    expect(
      canAccessProtectedRoute('/dashboard', {
        ...createChecks([], [PermissionActions.READ_DASHBOARD]),
        currentShopId: undefined,
      }),
    ).toBe(true)
  })

  it('allows the tenant dashboard route with a shop-scoped dashboard permission', () => {
    expect(
      canAccessProtectedRoute('/dashboard', {
        ...createChecks([PermissionActions.READ_DASHBOARD]),
        currentShopId: undefined,
      }),
    ).toBe(true)
  })

  it('allows the shop dashboard route with shop dashboard permission', () => {
    expect(
      canAccessProtectedRoute('/dashboard', createChecks([], [PermissionActions.READ_DASHBOARD])),
    ).toBe(true)
  })

  it('does not allow the cashier route with only catalog read permissions', () => {
    expect(
      canAccessProtectedRoute(
        '/sale',
        createChecks([PermissionActions.READ_MENU_ITEM, PermissionActions.READ_PRODUCT]),
      ),
    ).toBe(false)
  })

  it('allows the cashier route when the user can read tables and table orders', () => {
    expect(
      canAccessProtectedRoute(
        '/sale',
        createChecks([PermissionActions.READ_SHOP_TABLE, PermissionActions.READ_TABLE_ORDER]),
      ),
    ).toBe(true)
  })

  it('allows the table route with a child table read grant', () => {
    expect(
      canAccessProtectedRoute('/tables', createChecks([PermissionActions.READ_SHOP_TABLE])),
    ).toBe(true)
  })

  it('allows the stock route with a stock resource operation grant', () => {
    expect(
      canAccessProtectedRoute('/stock', createChecks([PermissionActions.CREATE_STOCK_ENTRY])),
    ).toBe(true)
  })

  it('allows the permission groups route with read permission access', () => {
    expect(
      canAccessProtectedRoute(
        '/permission-groups',
        createChecks([], [PermissionActions.READ_PERMISSION]),
      ),
    ).toBe(true)
  })

  it('allows the announcements route with read/create announcement grants', () => {
    expect(
      canAccessProtectedRoute(
        '/announcements',
        createChecks([PermissionActions.READ_ANNOUNCEMENT]),
      ),
    ).toBe(true)
    expect(
      canAccessProtectedRoute(
        '/announcements/new',
        createChecks([PermissionActions.CREATE_ANNOUNCEMENT]),
      ),
    ).toBe(true)
  })
})
