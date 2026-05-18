export type PermissionAction = string
export type PermissionTargetType = string

export interface PermissionResponseDto {
  id?: number
  userId?: string
  targetType?: PermissionTargetType
  targetId?: string
  action?: PermissionAction
}

export interface PermissionCreateRequestDto {
  userId: string
  targetType: PermissionTargetType
  targetId: string
  action: PermissionAction
}

export interface PermissionActionHierarchyMap {
  [action: PermissionAction]: PermissionTargetType[]
}

export interface PermittableResponseDto {
  id?: string
  title?: string
  targetType?: PermissionTargetType
}

export interface PermissionDraftAssignment {
  action: PermissionAction
  targetType: PermissionTargetType
  targetId: string
  targetTitle: string
}

export interface PermissionAssignmentInput {
  action: PermissionAction
  targetType: PermissionTargetType
  targetId: string
  targetTitle: string
}

export const TARGET_TYPE_PARENT: Record<string, string | null> = {
  TENANT_ROOT: null,
  TENANT: 'TENANT_ROOT',
  USER: 'TENANT',
  EMPLOYEE: 'TENANT',
  TICKET: 'TENANT',
  TICKET_HISTORY: 'TICKET',
  TICKET_COMMENT: 'TICKET',
  TICKET_ASSIGNMENT: 'TICKET',
  TICKET_ATTACHMENT: 'TICKET',
  TICKET_SLA_TRACKING: 'TICKET',
  TICKET_WATCHER: 'TICKET',
  TEAM: 'TENANT',
  TEAM_MEMBER: 'TEAM',
  SHOP: 'TENANT',
  STOCK_COUNT: 'SHOP',
  STOCK_RESOURCE: 'SHOP',
  STOCK_MOVEMENT: 'STOCK_RESOURCE',
  PRODUCT: 'SHOP',
  PRODUCT_RECIPE: 'PRODUCT',
  PRODUCT_EXTRA_OPTION: 'PRODUCT',
  MENU: 'SHOP',
  MENU_CATEGORY: 'MENU',
  MENU_ITEM: 'MENU_CATEGORY',
  SHOP_TABLE: 'SHOP',
  TABLE_ORDER: 'SHOP_TABLE',
}

export const PERMITTABLE_TARGET_TYPES = new Set<string>([
  'TENANT',
  'USER',
  'EMPLOYEE',
  'TICKET',
  'TICKET_HISTORY',
  'TICKET_COMMENT',
  'TICKET_ASSIGNMENT',
  'TICKET_ATTACHMENT',
  'TICKET_SLA_TRACKING',
  'TICKET_WATCHER',
  'TEAM',
  'TEAM_MEMBER',
  'SHOP',
  'STOCK_COUNT',
  'STOCK_RESOURCE',
  'PRODUCT',
  'PRODUCT_RECIPE',
  'PRODUCT_EXTRA_OPTION',
  'MENU',
  'MENU_CATEGORY',
  'MENU_ITEM',
  'SHOP_TABLE',
  'TABLE_ORDER',
])

export function toPermissionKey(input: {
  action: PermissionAction
  targetType: PermissionTargetType
  targetId: string
}): string {
  return `${input.action}|${input.targetType}|${input.targetId}`
}

export function getTargetTypeChain(targetType: PermissionTargetType): PermissionTargetType[] {
  const chain: PermissionTargetType[] = []
  let current: string | null | undefined = targetType
  let depth = 0

  while (current && depth < 32) {
    chain.unshift(current)
    current = TARGET_TYPE_PARENT[current] ?? null
    depth += 1
  }

  return chain
}

export function getSelectableTargetChain(targetType: PermissionTargetType): PermissionTargetType[] {
  if (!PERMITTABLE_TARGET_TYPES.has(targetType)) {
    return []
  }
  return getTargetTypeChain(targetType).filter((type) => PERMITTABLE_TARGET_TYPES.has(type))
}

export function prettifyPermissionEnumName(value: string): string {
  return value
    .split('_')
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(' ')
}
