'use client'

import AddIcon from '@mui/icons-material/Add'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import DeleteIcon from '@mui/icons-material/Delete'
import RuleFolderRoundedIcon from '@mui/icons-material/RuleFolderRounded'
import {
  Box,
  Button,
  Chip,
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

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useDeleteTenantEmployee, useTenantEmployees } from '../hooks/use-employees'
import type { EmployeeListResponse, EmploymentStatusValue } from '../types/employee'
import { TenantEmployeePermissionsDialog } from './tenant-employee-permissions-dialog'

interface Props {
  tenantId: string
  tenantName?: string
}

const STATUS_COLOR: Record<
  EmploymentStatusValue,
  'success' | 'info' | 'warning' | 'error' | 'default'
> = {
  ACTIVE: 'success',
  PROBATION: 'info',
  ON_LEAVE: 'warning',
  SUSPENDED: 'error',
  TERMINATED: 'default',
  RETIRED: 'default',
  DELETED: 'default',
}

export function TenantEmployeeList({ tenantId, tenantName }: Props) {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [permissionDialogEmployee, setPermissionDialogEmployee] =
    useState<EmployeeListResponse | undefined>(undefined)

  const { hasAnyPermission, isLoadingPermissions } = useCurrentUserPermissions()
  const canReadEmployees = hasAnyPermission([
    PermissionActions.READ_EMPLOYEE,
    PermissionActions.UPDATE_EMPLOYEE,
    PermissionActions.DELETE_EMPLOYEE,
    PermissionActions.READ_TENANT,
    PermissionActions.UPDATE_TENANT,
    PermissionActions.ADMIN,
    PermissionActions.CREATE_EMPLOYEE_ANY_TENANT,
  ])
  const canCreateEmployeeForTenant = hasAnyPermission([PermissionActions.CREATE_EMPLOYEE_ANY_TENANT])
  const canDeleteEmployee = hasAnyPermission([PermissionActions.DELETE_EMPLOYEE])

  const params = {
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'id', order: 'ASC' as const },
  }

  const { data, isLoading, error } = useTenantEmployees(tenantId, params, {
    enabled: canReadEmployees && !isLoadingPermissions,
  })
  const { mutate: deleteEmployee } = useDeleteTenantEmployee(tenantId)

  useEffect(() => {
    if (!error || !canReadEmployees) {
      return
    }
    showToast(getUserFriendlyError(error), { severity: 'error' })
  }, [canReadEmployees, error, showToast])

  const rows = data?.data ?? []
  const total = data?.total ?? 0

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{t('employees.title')}</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {canReadEmployees && (
            <Button
              variant="outlined"
              startIcon={<RuleFolderRoundedIcon />}
              onClick={() =>
                router.push(
                  withLocale(locale, `${ROUTES.tenants}/${tenantId}/permission-groups`) as Route,
                )
              }
            >
              {t('permissionGroups.title')}
            </Button>
          )}
          {canCreateEmployeeForTenant && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                router.push(withLocale(locale, `${ROUTES.tenants}/${tenantId}/employees/new`) as Route)
              }
            >
              {t('employees.createButton')}
            </Button>
          )}
        </Box>
      </Box>

      {isLoadingPermissions ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : !canReadEmployees ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          {t('employees.unauthorized')}
        </Typography>
      ) : isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : rows.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          {t('employees.emptyState')}
        </Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('employees.fullNameColumnHeader')}</TableCell>
              <TableCell>{t('employees.emailColumnHeader')}</TableCell>
              <TableCell>{t('employees.phoneColumnHeader')}</TableCell>
              <TableCell>{t('employees.statusColumnHeader')}</TableCell>
              <TableCell align="right">{t('employees.actionsColumnLabel')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((employee) => {
              const employeeId = employee.id

              return (
                <TableRow key={employeeId} hover>
                  <TableCell>{`${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim() || '—'}</TableCell>
                  <TableCell>{employee.email ?? '—'}</TableCell>
                  <TableCell>{employee.phoneNumber ?? '—'}</TableCell>
                  <TableCell>
                    {employee.status ? (
                      <Chip
                        label={employee.status}
                        color={STATUS_COLOR[employee.status] ?? 'default'}
                        size="small"
                      />
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('employees.permissionsDialogTitle')}>
                      <span>
                        <IconButton
                          size="small"
                          onClick={() => setPermissionDialogEmployee(employee)}
                          disabled={!employeeId}
                        >
                          <AdminPanelSettingsIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                    {canDeleteEmployee && employeeId && (
                      <Tooltip title={t('employees.deleteButton')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            deleteEmployee(employeeId, {
                              onSuccess: () =>
                                showToast(t('employees.employeeDeletedToast'), { severity: 'success' }),
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
              )
            })}
          </TableBody>
        </Table>
      )}

      {canReadEmployees && (
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

      <TenantEmployeePermissionsDialog
        open={Boolean(permissionDialogEmployee)}
        employee={permissionDialogEmployee}
        tenantId={tenantId}
        tenantName={tenantName}
        onClose={() => setPermissionDialogEmployee(undefined)}
      />
    </Box>
  )
}
