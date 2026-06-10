export const TENANT_ROOT_ID = '00000000-0000-0000-0000-000000000000'

export type PermissionAction = string
export type PermissionTargetType = string

export interface PermissionGrant {
  id?: number
  userId?: string
  targetType?: PermissionTargetType
  targetId?: string
  action?: PermissionAction
}

export interface PermissionTargetReference {
  targetType: PermissionTargetType
  targetId?: string | null
}

export interface PermissionCheckTarget extends PermissionTargetReference {
  tenantId?: string | null
  parentTargets?: PermissionTargetReference[]
}

export interface TicketPermissionTarget {
  ticketId?: string | null
  tenantId?: string | null
  assignedTeamId?: string | null
  assignedAgentId?: string | null
  childTargetType?: PermissionTargetType | null
  childId?: string | null
  commentId?: string | null
  attachmentId?: string | null
}

export interface PermissionEvaluator {
  permissionActions: ReadonlySet<string>
  permissionGrants: readonly PermissionGrant[]
  hasAction: (action: PermissionAction) => boolean
  hasAnyAction: (actions: readonly PermissionAction[]) => boolean
  hasAllActions: (actions: readonly PermissionAction[]) => boolean
  hasGrant: (
    action: PermissionAction,
    targetType: PermissionTargetType,
    targetId?: string | null,
  ) => boolean
  hasPermissionForTarget: (action: PermissionAction, target: PermissionCheckTarget) => boolean
  hasAnyPermissionForTarget: (
    actions: readonly PermissionAction[],
    target: PermissionCheckTarget,
  ) => boolean
  hasTicketPermission: (action: PermissionAction, target: TicketPermissionTarget) => boolean
}

const ADMIN_ACTION = 'ADMIN'
const TENANT_ROOT_TARGET_TYPE = 'TENANT_ROOT'
const TENANT_TARGET_TYPE = 'TENANT'

function normalizeId(value?: string | null): string | undefined {
  const normalized = value?.trim().toLowerCase()
  return normalized || undefined
}

function normalizeType(value?: string | null): string | undefined {
  const normalized = value?.trim().toUpperCase()
  return normalized || undefined
}

function permissionKey(
  action: PermissionAction,
  targetType: PermissionTargetType,
  targetId?: string | null,
): string | undefined {
  const normalizedAction = normalizeType(action)
  const normalizedTargetType = normalizeType(targetType)
  const normalizedTargetId =
    normalizedTargetType === TENANT_ROOT_TARGET_TYPE
      ? (normalizeId(targetId) ?? TENANT_ROOT_ID)
      : normalizeId(targetId)

  if (!normalizedAction || !normalizedTargetType || !normalizedTargetId) {
    return undefined
  }

  return `${normalizedAction}|${normalizedTargetType}|${normalizedTargetId}`
}

function uniqueTargets(targets: PermissionTargetReference[]): PermissionTargetReference[] {
  const seen = new Set<string>()
  const result: PermissionTargetReference[] = []

  for (const target of targets) {
    const key = permissionKey('__TARGET__', target.targetType, target.targetId)
    if (!key || seen.has(key)) {
      continue
    }
    seen.add(key)
    result.push(target)
  }

  return result
}

export function createPermissionEvaluator(grants: readonly PermissionGrant[]): PermissionEvaluator {
  const permissionActions = new Set<string>()
  const permissionKeys = new Set<string>()
  const normalizedGrants: PermissionGrant[] = []

  for (const grant of grants) {
    const action = normalizeType(grant.action)
    const targetType = normalizeType(grant.targetType)
    const targetId =
      targetType === TENANT_ROOT_TARGET_TYPE
        ? (normalizeId(grant.targetId) ?? TENANT_ROOT_ID)
        : normalizeId(grant.targetId)

    if (!action || !targetType || !targetId) {
      continue
    }

    permissionActions.add(action)
    permissionKeys.add(`${action}|${targetType}|${targetId}`)
    normalizedGrants.push({
      ...grant,
      action,
      targetType,
      targetId,
    })
  }

  function hasGrant(
    action: PermissionAction,
    targetType: PermissionTargetType,
    targetId?: string | null,
  ): boolean {
    const key = permissionKey(action, targetType, targetId)
    return Boolean(key && permissionKeys.has(key))
  }

  function hasTenantRootAdmin(): boolean {
    return hasGrant(ADMIN_ACTION, TENANT_ROOT_TARGET_TYPE, TENANT_ROOT_ID)
  }

  function hasTenantAdmin(tenantId?: string | null): boolean {
    return Boolean(tenantId && hasGrant(ADMIN_ACTION, TENANT_TARGET_TYPE, tenantId))
  }

  function hasAdminForTenant(tenantId?: string | null): boolean {
    return hasTenantRootAdmin() || hasTenantAdmin(tenantId)
  }

  function hasPermissionForTarget(
    action: PermissionAction,
    target: PermissionCheckTarget,
  ): boolean {
    if (hasAdminForTenant(target.tenantId)) {
      return true
    }

    const targets = uniqueTargets([
      { targetType: target.targetType, targetId: target.targetId },
      ...(target.parentTargets ?? []),
      ...(target.tenantId ? [{ targetType: TENANT_TARGET_TYPE, targetId: target.tenantId }] : []),
      { targetType: TENANT_ROOT_TARGET_TYPE, targetId: TENANT_ROOT_ID },
    ])

    return targets.some((candidate) => hasGrant(action, candidate.targetType, candidate.targetId))
  }

  function hasTicketPermission(action: PermissionAction, target: TicketPermissionTarget): boolean {
    const parentTargets: PermissionTargetReference[] = []

    if (target.attachmentId) {
      parentTargets.push({ targetType: 'TICKET_ATTACHMENT', targetId: target.attachmentId })
    }
    if (target.commentId) {
      parentTargets.push({ targetType: 'TICKET_COMMENT', targetId: target.commentId })
    }
    if (target.childTargetType && target.childId) {
      parentTargets.push({ targetType: target.childTargetType, targetId: target.childId })
    }
    if (target.ticketId) {
      parentTargets.push({ targetType: 'TICKET', targetId: target.ticketId })
    }
    if (target.assignedTeamId) {
      parentTargets.push({ targetType: 'TEAM', targetId: target.assignedTeamId })
    }
    if (target.assignedAgentId) {
      parentTargets.push({ targetType: 'USER', targetId: target.assignedAgentId })
    }

    return hasPermissionForTarget(action, {
      targetType: target.childTargetType ?? 'TICKET',
      targetId: target.childId ?? target.ticketId,
      tenantId: target.tenantId,
      parentTargets,
    })
  }

  function hasAction(action: PermissionAction): boolean {
    return hasTenantRootAdmin() || permissionActions.has(normalizeType(action) ?? '')
  }

  function hasAnyAction(actions: readonly PermissionAction[]): boolean {
    return actions.some((action) => hasAction(action))
  }

  function hasAllActions(actions: readonly PermissionAction[]): boolean {
    return actions.every((action) => hasAction(action))
  }

  function hasAnyPermissionForTarget(
    actions: readonly PermissionAction[],
    target: PermissionCheckTarget,
  ): boolean {
    return actions.some((action) => hasPermissionForTarget(action, target))
  }

  return {
    permissionActions,
    permissionGrants: normalizedGrants,
    hasAction,
    hasAnyAction,
    hasAllActions,
    hasGrant,
    hasPermissionForTarget,
    hasAnyPermissionForTarget,
    hasTicketPermission,
  }
}
