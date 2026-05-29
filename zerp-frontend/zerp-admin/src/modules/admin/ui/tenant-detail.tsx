'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { Box, Button, CircularProgress, Divider, Paper, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { tenantClient } from '../api/tenant-client'
import { useTenant } from '../hooks/use-tenants'
import { ShopList } from './shop-list'
import { TenantEmployeeList } from './tenant-employee-list'
import { TenantFormDialog } from './tenant-form-dialog'

interface Props {
  id: string
}

export function TenantDetail({ id }: Props) {
  const { t } = useI18n()
  const router = useRouter()
  const { showToast } = useToast()
  const [editOpen, setEditOpen] = useState(false)

  const { hasAnyPermission, isLoadingPermissions } = useCurrentUserPermissions()
  const canReadTenant = hasAnyPermission([
    PermissionActions.READ_TENANT,
    PermissionActions.UPDATE_TENANT,
    PermissionActions.ADMIN,
  ])
  const canUpdateTenant = hasAnyPermission([
    PermissionActions.UPDATE_TENANT,
    PermissionActions.ADMIN,
  ])

  const { data: tenant, isLoading, error } = useTenant(id, {
    enabled: canReadTenant && !isLoadingPermissions,
  })

  useEffect(() => {
    if (!error || !canReadTenant) {
      return
    }
    showToast(getUserFriendlyError(error), { severity: 'error' })
  }, [canReadTenant, error, showToast])

  if (isLoadingPermissions) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!canReadTenant) {
    return <Typography color="text.secondary">{t('tenants.unauthorized')}</Typography>
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!tenant) {
    return <Typography color="text.secondary">{t('tenants.notFound')}</Typography>
  }

  const detailItems: Array<{ label: string; value?: string }> = [
    { label: t('tenants.emailLabel'), value: tenant.email },
    { label: t('tenants.phoneLabel'), value: tenant.phone },
    { label: t('tenants.cityLabel'), value: tenant.city },
    { label: t('tenants.stateLabel'), value: tenant.state },
    { label: t('tenants.countryLabel'), value: tenant.country },
    { label: t('tenants.postalCodeLabel'), value: tenant.postalCode },
    { label: t('tenants.websiteLabel'), value: tenant.website },
    { label: t('tenants.addressLabel'), value: tenant.address },
  ]
  const tenantImageUrl = tenant.id && tenant.imageId ? tenantClient.getImageUrl(tenant.id) : null

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ color: 'text.secondary' }}>
          {t('tenants.backButton')}
        </Button>
        {canUpdateTenant && (
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
            {t('tenants.editButton')}
          </Button>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
        {tenantImageUrl && (
          <Box
            component="img"
            src={tenantImageUrl}
            alt={tenant.name ?? 'Tenant image'}
            sx={{
              width: 88,
              height: 88,
              borderRadius: 1,
              objectFit: 'cover',
              border: '1px solid',
              borderColor: 'divider',
              flexShrink: 0,
            }}
          />
        )}
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            {tenant.name}
          </Typography>
          {tenant.description && (
            <Typography variant="body2" color="text.secondary">
              {tenant.description}
            </Typography>
          )}
        </Box>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2,
          }}
        >
          {detailItems.map((item) => (
            <Box key={item.label}>
              <Typography variant="caption" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="body2">{item.value ?? '—'}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Divider sx={{ mb: 2 }} />

      <TenantEmployeeList tenantId={id} tenantName={tenant.name} />

      <Divider sx={{ my: 2 }} />

      <ShopList fixedTenantId={id} fixedTenantName={tenant.name} />

      <TenantFormDialog
        open={editOpen}
        mode="edit"
        tenant={tenant}
        onClose={() => setEditOpen(false)}
      />
    </Box>
  )
}
