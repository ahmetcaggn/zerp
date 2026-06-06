'use client'
import RestoreIcon from '@mui/icons-material/Restore'
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useDeletedEmployees, usePatchEmployee } from '../hooks/use-employees'

interface Props {
  canRead: boolean
}

export function DeletedEmployees({ canRead }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { currentTenantId, hasPermissionForTarget, getDisabledReason, isLoadingPermissions } =
    useCurrentUserPermissions()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const unauthorizedReason = t('common.unauthorized')
  const loadingReason = t('common.loading')


  const [restoreConfirmId, setRestoreConfirmId] = useState<string | null>(null)

  const { data, isLoading, error } = useDeletedEmployees(
    {
      pagination: { page: page + 1, perPage: rowsPerPage },
    },
    canRead,
  )
  const { mutate: patchEmployee } = usePatchEmployee()

  if (error) showToast(getUserFriendlyError(error), { severity: 'error' })

  const rows = data?.data ?? []
  const total = data?.total ?? 0

  function handleRestore(id: string) {
    const canRestore = hasPermissionForTarget(PermissionActions.UPDATE_EMPLOYEE, {
      targetType: 'EMPLOYEE',
      targetId: id,
      tenantId: currentTenantId,
      parentTargets: currentTenantId
        ? [{ targetType: 'TENANT', targetId: currentTenantId }]
        : undefined,
    })

    if (!canRestore) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    patchEmployee(
      { id, fields: { isDeleted: false } },
      {
        onSuccess: () => showToast(t('employees.employeeRestoredToast'), { severity: 'success' }),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function canRestoreEmployee(id?: number): boolean {
    return hasPermissionForTarget(PermissionActions.UPDATE_EMPLOYEE, {
      targetType: 'EMPLOYEE',
      targetId: id !== undefined ? String(id) : undefined,
      tenantId: currentTenantId,
      parentTargets: currentTenantId
        ? [{ targetType: 'TENANT', targetId: currentTenantId }]
        : undefined,
    })
  }

  if (!canRead && !isLoadingPermissions) {
    return <Alert severity="warning">{unauthorizedReason}</Alert>
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (rows.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
        {t('employees.emptyState')}
      </Typography>
    )
  }

  return (
    <>
      {/* Desktop Table View */}
      <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('employees.fullNameColumnHeader')}</TableCell>
              <TableCell>{t('employees.emailColumnHeader')}</TableCell>
              <TableCell>{t('employees.phoneColumnHeader')}</TableCell>
              <TableCell align="right">{t('employees.restoreButton')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((emp) => {
              const canRestore = canRestoreEmployee(emp.id)
              const restoreDisabledReason = isLoadingPermissions
                ? loadingReason
                : getDisabledReason(canRestore, unauthorizedReason)

              return (
                <TableRow key={emp.id}>
                  <TableCell>{`${emp.firstName ?? ''} ${emp.lastName ?? ''}`}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phoneNumber ?? '—'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={restoreDisabledReason ?? ''}>
                      <span>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<RestoreIcon />}
                          disabled={!canRestore}
                          onClick={() => emp.id !== undefined && setRestoreConfirmId(String(emp.id))}
                        >
                          {t('employees.restoreButton')}
                        </Button>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile Card View */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
        {rows.map((emp) => (
          <Card
            key={emp.id}
            variant="outlined"
            sx={{
              borderRadius: 2,
              borderColor: 'divider',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                borderColor: 'primary.light',
              },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ lineHeight: 1.3 }}
                  >
                    {`${emp.firstName ?? ''} ${emp.lastName ?? ''}`}
                  </Typography>
                </Box>

                <Stack spacing={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    {emp.email}
                  </Typography>
                  {emp.phoneNumber && (
                    <Typography variant="body2" color="text.secondary">
                      {emp.phoneNumber}
                    </Typography>
                  )}
                </Stack>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    pt: 1.5,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<RestoreIcon />}
                    onClick={() => emp.id !== undefined && setRestoreConfirmId(String(emp.id))}
                  >
                    {t('employees.restoreButton')}
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Card>
        ))}
      </Box>

      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(Number(e.target.value))
          setPage(0)
        }}
        rowsPerPageOptions={[10, 25]}
      />

      <Dialog open={Boolean(restoreConfirmId)} onClose={() => setRestoreConfirmId(null)}>
        <DialogTitle>{t('employees.restoreConfirmTitle')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{t('employees.restoreConfirmText')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreConfirmId(null)}>{t('common.cancel')}</Button>
          <Button
            onClick={() => {
              if (restoreConfirmId) {
                handleRestore(restoreConfirmId)
                setRestoreConfirmId(null)
              }
            }}
            variant="contained"
            color="primary"
            autoFocus
          >
            {t('employees.restoreButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
