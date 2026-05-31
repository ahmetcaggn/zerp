import type { PermissionGroupAssignmentRevokeResponseDto } from '../types/permission-group'

type TranslateFn = (key: string, params?: Record<string, string | number>) => string
type ToastSeverity = 'success' | 'info' | 'warning'

interface RevokeToastResult {
  message: string
  severity: ToastSeverity
}

export function buildRevokeGroupToast(
  t: TranslateFn,
  response: PermissionGroupAssignmentRevokeResponseDto,
): RevokeToastResult {
  const details: string[] = []

  if (response.missingPermissionCount > 0) {
    details.push(
      t('permissionGroups.revokeMissingDetail', {
        count: response.missingPermissionCount,
      }),
    )
  }

  if (response.retainedPermissionCount > 0) {
    details.push(
      t('permissionGroups.revokeRetainedDetail', {
        count: response.retainedPermissionCount,
      }),
    )
  }

  if (response.warnings.length > 0 && details.length === 0) {
    details.push(t('permissionGroups.revokeGenericWarningDetail'))
  }

  if (details.length === 0) {
    return {
      message: t('permissionGroups.revokedToast'),
      severity: 'success',
    }
  }

  const severity: ToastSeverity =
    response.missingPermissionCount > 0 || response.warnings.length > 0 ? 'warning' : 'info'

  return {
    message: t('permissionGroups.revokeDetailedToast', { details: details.join(' ') }),
    severity,
  }
}
