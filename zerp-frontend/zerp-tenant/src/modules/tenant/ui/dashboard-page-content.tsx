'use client'

import { Alert, Stack } from '@mui/material'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'

import { ShopDashboard } from './shop-dashboard'
import { TenantDashboard } from './tenant-dashboard'

export function DashboardPageContent() {
  const { t } = useI18n()
  const { scope } = useShopScope()
  const { hasAnyPermission, hasTenantPermission, hasShopPermission } = useCurrentUserPermissions()
  const canReadDashboard =
    scope.mode === 'SHOP'
      ? hasShopPermission(PermissionActions.READ_DASHBOARD, scope.shopId) ||
        hasAnyPermission([PermissionActions.READ_DASHBOARD])
      : hasTenantPermission(PermissionActions.READ_DASHBOARD) ||
        hasAnyPermission([PermissionActions.READ_DASHBOARD])

  if (!canReadDashboard) {
    return (
      <Stack spacing={3}>
        <Alert severity="warning">{t('common.unauthorized')}</Alert>
      </Stack>
    )
  }

  if (scope.mode === 'SHOP') {
    return <ShopDashboard />
  }

  return <TenantDashboard />
}
