import { describe, expect, it } from 'vitest'

import { canAccessProtectedRoute } from '@/core/permissions/route-permissions'
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
})
