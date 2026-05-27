'use client'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useDeleteTenant, useTenants } from '../hooks/use-tenants'
import type { TenantResponse } from '../types/tenant'
import { TenantFormDialog } from './tenant-form-dialog'

export function TenantList() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedTenant, setSelectedTenant] = useState<TenantResponse | undefined>(undefined)

  const { hasPermission, hasAnyPermission, isLoadingPermissions } = useCurrentUserPermissions()
  const canReadTenant = hasAnyPermission([
    PermissionActions.READ_TENANT,
    PermissionActions.UPDATE_TENANT,
    PermissionActions.ADMIN,
  ])
  const canCreateTenant = hasPermission(PermissionActions.ADMIN)
  const canUpdateTenant = hasAnyPermission([
    PermissionActions.UPDATE_TENANT,
    PermissionActions.ADMIN,
  ])
  const canDeleteTenant = hasPermission(PermissionActions.ADMIN)

  const params = {
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'name', order: 'ASC' as const },
  }

  const { data, isLoading, error } = useTenants(params, {
    enabled: canReadTenant && !isLoadingPermissions,
  })
  const { mutate: deleteTenant } = useDeleteTenant()

  useEffect(() => {
    if (!error || !canReadTenant) {
      return
    }
    showToast(getUserFriendlyError(error), { severity: 'error' })
  }, [canReadTenant, error, showToast])

  const rows = data?.data ?? []
  const total = data?.total ?? 0

  function openCreateDialog() {
    setDialogMode('create')
    setSelectedTenant(undefined)
    setDialogOpen(true)
  }

  function openEditDialog(tenant: TenantResponse) {
    setDialogMode('edit')
    setSelectedTenant(tenant)
    setDialogOpen(true)
  }

  function closeDialog() {
    setDialogOpen(false)
    setSelectedTenant(undefined)
  }

  function goTenantDetail(tenantId: string) {
    router.push(`${ROUTES.tenants}/${tenantId}` as Route)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{t('tenants.title')}</Typography>
        {canCreateTenant && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateDialog}>
            {t('tenants.createButton')}
          </Button>
        )}
      </Box>

      {isLoadingPermissions ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : !canReadTenant ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          {t('tenants.unauthorized')}
        </Typography>
      ) : isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          {t('tenants.emptyState')}
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('tenants.nameLabel')}</TableCell>
              <TableCell>{t('tenants.emailLabel')}</TableCell>
              <TableCell>{t('tenants.phoneLabel')}</TableCell>
              <TableCell>{t('tenants.cityLabel')}</TableCell>
              <TableCell>{t('tenants.countryLabel')}</TableCell>
              <TableCell>{t('tenants.websiteLabel')}</TableCell>
              <TableCell align="right">Islemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((tenant, index) => (
              <TableRow
                key={tenant.id ?? `tenant-${index}`}
                hover
                sx={tenant.id ? { cursor: 'pointer' } : undefined}
                onClick={() => {
                  if (tenant.id) {
                    goTenantDetail(tenant.id)
                  }
                }}
              >
                <TableCell>{tenant.name ?? '—'}</TableCell>
                <TableCell>{tenant.email ?? '—'}</TableCell>
                <TableCell>{tenant.phone ?? '—'}</TableCell>
                <TableCell>{tenant.city ?? '—'}</TableCell>
                <TableCell>{tenant.country ?? '—'}</TableCell>
                <TableCell>{tenant.website ?? '—'}</TableCell>
                <TableCell align="right">
                  {tenant.id && (
                    <Tooltip title={t('tenants.detailButton')}>
                      <IconButton
                        size="small"
                        onClick={(event) => {
                          event.stopPropagation()
                          goTenantDetail(tenant.id as string)
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {canUpdateTenant && (
                    <Tooltip title={t('tenants.editButton')}>
                      <IconButton
                        size="small"
                        onClick={(event) => {
                          event.stopPropagation()
                          openEditDialog(tenant)
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {canDeleteTenant && tenant.id && (
                    <Tooltip title={t('tenants.deleteButton')}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={(event) => {
                          event.stopPropagation()
                          deleteTenant(tenant.id as string, {
                            onSuccess: () =>
                              showToast(t('tenants.deletedToast'), { severity: 'success' }),
                            onError: (err) =>
                              showToast(getUserFriendlyError(err), { severity: 'error' }),
                          })
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {canReadTenant && (
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value))
            setPage(0)
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      )}

      <TenantFormDialog
        open={dialogOpen}
        mode={dialogMode}
        tenant={selectedTenant}
        onClose={closeDialog}
      />
    </Box>
  )
}
