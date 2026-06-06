import type {
  PermissionCheckTarget,
  PermissionTargetReference,
} from '@/core/permissions/permission-evaluator'

function optionalTarget(targetType: string, targetId?: string | null): PermissionTargetReference[] {
  return targetId ? [{ targetType, targetId }] : []
}

export function tenantParents(tenantId?: string | null): PermissionTargetReference[] {
  return optionalTarget('TENANT', tenantId)
}

export function shopParents(
  shopId?: string | null,
  tenantId?: string | null,
): PermissionTargetReference[] {
  return [...optionalTarget('SHOP', shopId), ...tenantParents(tenantId)]
}

export function productParents(
  productId?: string | null,
  shopId?: string | null,
  tenantId?: string | null,
): PermissionTargetReference[] {
  return [...optionalTarget('PRODUCT', productId), ...shopParents(shopId, tenantId)]
}

export function menuParents(
  menuId?: string | null,
  shopId?: string | null,
  tenantId?: string | null,
): PermissionTargetReference[] {
  return [...optionalTarget('MENU', menuId), ...shopParents(shopId, tenantId)]
}

export function menuCategoryParents(
  categoryId?: string | null,
  menuId?: string | null,
  shopId?: string | null,
  tenantId?: string | null,
): PermissionTargetReference[] {
  return [...optionalTarget('MENU_CATEGORY', categoryId), ...menuParents(menuId, shopId, tenantId)]
}

export function shopTableParents(
  tableId?: string | null,
  shopId?: string | null,
  tenantId?: string | null,
): PermissionTargetReference[] {
  return [...optionalTarget('SHOP_TABLE', tableId), ...shopParents(shopId, tenantId)]
}

export function stockResourceParents(
  stockResourceId?: string | null,
  shopId?: string | null,
  tenantId?: string | null,
): PermissionTargetReference[] {
  return [...optionalTarget('STOCK_RESOURCE', stockResourceId), ...shopParents(shopId, tenantId)]
}

export function targetWithParents(
  targetType: string,
  targetId: string | undefined | null,
  tenantId: string | undefined | null,
  parentTargets: PermissionTargetReference[] = [],
): PermissionCheckTarget {
  return {
    targetType,
    targetId,
    tenantId,
    parentTargets,
  }
}

export function shopTarget(
  shopId: string | undefined | null,
  tenantId: string | undefined | null,
): PermissionCheckTarget {
  return targetWithParents('SHOP', shopId, tenantId, tenantParents(tenantId))
}
