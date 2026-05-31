export type PermissionGroupScopeType = 'TENANT' | 'SHOP'
export type PermissionGroupSource = 'PREDEFINED' | 'CUSTOM'

export type PredefinedPermissionGroupCode =
  | 'CASHIER'
  | 'WAITER'
  | 'STOCK_MANAGER'
  | 'CATALOG_MANAGER'
  | 'TENANT_SUPERVISOR'

export interface PermissionGroupResponse {
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

export interface PermissionGroupCreateRequest {
  name: string
  description?: string
  scopeType: PermissionGroupScopeType
  actions: string[]
}

export interface PermissionGroupUpdateRequest {
  name: string
  description?: string
  scopeType: PermissionGroupScopeType
  actions: string[]
}

export interface PermissionGroupPatchRequest {
  name?: string
  description?: string
  scopeType?: PermissionGroupScopeType
  actions?: string[]
}

export interface PermissionGroupAssignRequest {
  userId: string
  groupId?: string
  predefinedCode?: PredefinedPermissionGroupCode
  scopeTargetId?: string
}

export interface PermissionGroupAssignResponse {
  requestedCount: number
  createdCount: number
  skippedCount: number
  scopeType: PermissionGroupScopeType
  targetType: string
  targetId: string
}

export interface PermissionGroupAssignmentResponse {
  id: string
  groupId: string
  groupName: string
  groupSource: PermissionGroupSource | 'UNKNOWN'
  groupCode?: PredefinedPermissionGroupCode
  groupScopeType?: PermissionGroupScopeType
  userId: string
  targetType: string
  targetId: string
  assignedAt?: string
}

export interface PermissionGroupAssignmentRevokeResponse {
  assignmentId: string
  groupId: string
  userId: string
  targetType: string
  targetId: string
  requestedCount: number
  removedLinkCount: number
  deletedPermissionCount: number
  retainedPermissionCount: number
  missingPermissionCount: number
  warnings: string[]
}
