export type PermissionGroupScopeType = 'TENANT' | 'SHOP'
export type PermissionGroupSource = 'PREDEFINED' | 'CUSTOM'

export type PredefinedPermissionGroupCode =
  | 'CASHIER'
  | 'WAITER'
  | 'STOCK_MANAGER'
  | 'CATALOG_MANAGER'
  | 'TENANT_SUPERVISOR'

export interface PermissionGroupResponseDto {
  source: PermissionGroupSource
  id?: string
  code?: PredefinedPermissionGroupCode
  name: string
  description?: string
  scopeType: PermissionGroupScopeType
  actions: string[]
  createdAt?: string
  updatedAt?: string
}

export interface PermissionGroupCreateRequestDto {
  name: string
  description?: string
  scopeType: PermissionGroupScopeType
  actions: string[]
}

export interface PermissionGroupUpdateRequestDto {
  name: string
  description?: string
  scopeType: PermissionGroupScopeType
  actions: string[]
}

export interface PermissionGroupPatchRequestDto {
  name?: string
  description?: string
  scopeType?: PermissionGroupScopeType
  actions?: string[]
}

export interface PermissionGroupAssignRequestDto {
  userId: string
  groupId?: string
  predefinedCode?: PredefinedPermissionGroupCode
  scopeTargetId?: string
}

export interface PermissionGroupAssignResponseDto {
  requestedCount: number
  createdCount: number
  skippedCount: number
  scopeType: PermissionGroupScopeType
  targetType: string
  targetId: string
}
