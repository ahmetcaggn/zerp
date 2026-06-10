'use client'
import AddIcon from '@mui/icons-material/Add'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import type { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useDeleteEmployee, useEmployees, useEmployeeSearch } from '../hooks/use-employees'
import type { EmployeeListResponseDto } from '../types/employee'
import type { EmploymentStatusValue } from '../types/employee'
import { DeletedEmployees } from './deleted-employees'
import { EmployeePermissionsDialog } from './employee-permissions-dialog'

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
}
const EMPLOYEE_TAB_KEYS = ['active', 'deleted'] as const

export function EmployeeList() {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const {
    currentTenantId,
    hasPermission,
    hasPermissionForTarget,
    hasTenantPermission,
    getDisabledReason,
    isLoadingPermissions,
  } = useCurrentUserPermissions()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [permissionDialogEmployee, setPermissionDialogEmployee] = useState<
    EmployeeListResponseDto | undefined
  >(undefined)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    const id = setTimeout(() => setDebouncedKeyword(searchInput.trim()), 400)
    return () => clearTimeout(id)
  }, [searchInput])

  const tab = useMemo(() => {
    const activeTab = searchParams.get('tab')
    const tabIndex = EMPLOYEE_TAB_KEYS.indexOf(
      (activeTab ?? 'active') as (typeof EMPLOYEE_TAB_KEYS)[number],
    )
    return tabIndex >= 0 ? tabIndex : 0
  }, [searchParams])

  function handleTabChange(nextTab: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', EMPLOYEE_TAB_KEYS[nextTab] ?? EMPLOYEE_TAB_KEYS[0])
    const queryString = params.toString()
    router.replace((queryString ? `${pathname}?${queryString}` : pathname) as Route)
  }

  const params = {
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'id', order: 'ASC' as const },
    filter: { 'deleted.eq': 'false' },
  }

  const unauthorizedReason = t('common.unauthorized')
  const loadingReason = t('common.loading')
  const canReadEmployees =
    hasPermission(PermissionActions.READ_EMPLOYEE) ||
    hasTenantPermission(PermissionActions.READ_EMPLOYEE)
  const canCreateEmployee = hasTenantPermission(PermissionActions.CREATE_EMPLOYEE)
  const canManagePermissions = hasTenantPermission(PermissionActions.ADMIN)
  const createDisabledReason = isLoadingPermissions
    ? loadingReason
    : getDisabledReason(canCreateEmployee, unauthorizedReason)
  const permissionDialogDisabledReason = isLoadingPermissions
    ? loadingReason
    : getDisabledReason(canManagePermissions, unauthorizedReason)

  function hasEmployeePermission(action: keyof typeof PermissionActions, employeeId?: number) {
    return hasPermissionForTarget(PermissionActions[action], {
      targetType: 'EMPLOYEE',
      targetId: employeeId !== undefined ? String(employeeId) : undefined,
      tenantId: currentTenantId,
      parentTargets: currentTenantId
        ? [{ targetType: 'TENANT', targetId: currentTenantId }]
        : undefined,
    })
  }

  const isSearching = debouncedKeyword.length >= 2
  const listResult = useEmployees(isSearching ? undefined : params, {
    enabled: !isSearching && canReadEmployees,
  })
  const searchResult = useEmployeeSearch(debouncedKeyword, params, canReadEmployees)

  const { data, isLoading, error } = isSearching ? searchResult : listResult
  const { mutate: deleteEmployee } = useDeleteEmployee()

  if (error) showToast(getUserFriendlyError(error), { severity: 'error' })

  const rows = data?.data ?? []
  const total = data?.total ?? 0

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{t('employees.title')}</Typography>
        <Tooltip title={createDisabledReason ?? ''}>
          <span>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push(withLocale(locale, `${ROUTES.employees}/new`) as Route)}
              disabled={isLoadingPermissions || !canCreateEmployee}
            >
              {t('employees.createButton')}
            </Button>
          </span>
        </Tooltip>
      </Box>

      <Tabs value={tab} onChange={(_, v) => handleTabChange(v)} sx={{ mb: 2 }}>
        <Tab label={t('employees.title')} />
        <Tab label={t('employees.deletedTitle')} />
      </Tabs>

      {tab === 1 ? (
        <DeletedEmployees canRead={canReadEmployees} />
      ) : (
        <>
          {!canReadEmployees && !isLoadingPermissions ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {unauthorizedReason}
            </Alert>
          ) : null}
          <TextField
            size="small"
            placeholder={t('employees.searchPlaceholder')}
            value={searchInput}
            disabled={isLoadingPermissions || !canReadEmployees}
            onChange={(e) => {
              setSearchInput(e.target.value)
              setPage(0)
            }}
            sx={{ mb: 2, width: 320 }}
          />

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : rows.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              {t('employees.emptyState')}
            </Typography>
          ) : (
            <>
              {/* Desktop Table View */}
              <TableContainer sx={{ display: { xs: 'none', md: 'block' } }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('employees.fullNameColumnHeader')}</TableCell>
                      <TableCell>{t('employees.emailColumnHeader')}</TableCell>
                      <TableCell>{t('employees.phoneColumnHeader')}</TableCell>
                      <TableCell>{t('employees.statusColumnHeader')}</TableCell>
                      <TableCell align="right">{t('common.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((emp) => {
                      const canReadEmployee = hasEmployeePermission('READ_EMPLOYEE', emp.id)
                      const canDeleteEmployee = hasEmployeePermission('DELETE_EMPLOYEE', emp.id)
                      const detailDisabledReason = isLoadingPermissions
                        ? loadingReason
                        : getDisabledReason(canReadEmployee, unauthorizedReason)
                      const deleteDisabledReason = isLoadingPermissions
                        ? loadingReason
                        : getDisabledReason(canDeleteEmployee, unauthorizedReason)

                      return (
                        <TableRow key={emp.id} hover>
                          <TableCell>{`${emp.firstName ?? ''} ${emp.lastName ?? ''}`}</TableCell>
                          <TableCell>{emp.email}</TableCell>
                          <TableCell>{emp.phoneNumber ?? '—'}</TableCell>
                          <TableCell>
                            {emp.status && (
                              <Chip
                                label={emp.status}
                                color={STATUS_COLOR[emp.status] ?? 'default'}
                                size="small"
                              />
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title={detailDisabledReason ?? t('employees.editButton')}>
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={!canReadEmployee}
                                  onClick={() => {
                                    if (emp.id !== undefined) {
                                      router.push(
                                        withLocale(
                                          locale,
                                          `${ROUTES.employees}/${emp.id}`,
                                        ) as Route,
                                      )
                                    }
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip
                              title={
                                permissionDialogDisabledReason ??
                                t('employees.permissionsDialogTitle')
                              }
                            >
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={!canManagePermissions}
                                  onClick={() => setPermissionDialogEmployee(emp)}
                                >
                                  <AdminPanelSettingsIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title={deleteDisabledReason ?? t('employees.deleteButton')}>
                              <span>
                                <IconButton
                                  size="small"
                                  color="error"
                                  disabled={!canDeleteEmployee}
                                  onClick={() => {
                                    if (emp.id !== undefined) {
                                      setDeleteConfirmId(String(emp.id))
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
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
                {rows.map((emp) => {
                  const canReadEmployee = hasEmployeePermission('READ_EMPLOYEE', emp.id)
                  const canDeleteEmployee = hasEmployeePermission('DELETE_EMPLOYEE', emp.id)
                  const detailDisabledReason = isLoadingPermissions
                    ? loadingReason
                    : getDisabledReason(canReadEmployee, unauthorizedReason)
                  const deleteDisabledReason = isLoadingPermissions
                    ? loadingReason
                    : getDisabledReason(canDeleteEmployee, unauthorizedReason)

                  return (
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
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              fontWeight={700}
                              color="text.primary"
                              sx={{ lineHeight: 1.3 }}
                            >
                              {`${emp.firstName ?? ''} ${emp.lastName ?? ''}`}
                            </Typography>
                            {emp.status && (
                              <Chip
                                label={emp.status}
                                color={STATUS_COLOR[emp.status] ?? 'default'}
                                size="small"
                              />
                            )}
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
                            <Tooltip title={detailDisabledReason ?? t('employees.editButton')}>
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={!canReadEmployee}
                                  onClick={() => {
                                    if (emp.id !== undefined) {
                                      router.push(
                                        withLocale(
                                          locale,
                                          `${ROUTES.employees}/${emp.id}`,
                                        ) as Route,
                                      )
                                    }
                                  }}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip
                              title={
                                permissionDialogDisabledReason ??
                                t('employees.permissionsDialogTitle')
                              }
                            >
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={!canManagePermissions}
                                  onClick={() => setPermissionDialogEmployee(emp)}
                                >
                                  <AdminPanelSettingsIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title={deleteDisabledReason ?? t('employees.deleteButton')}>
                              <span>
                                <IconButton
                                  size="small"
                                  color="error"
                                  disabled={!canDeleteEmployee}
                                  onClick={() => {
                                    if (emp.id !== undefined) {
                                      setDeleteConfirmId(String(emp.id))
                                    }
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        </Stack>
                      </Box>
                    </Card>
                  )
                })}
              </Box>
            </>
          )}

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
            rowsPerPageOptions={[10, 25, 50]}
          />
        </>
      )}

      <EmployeePermissionsDialog
        open={Boolean(permissionDialogEmployee)}
        employee={permissionDialogEmployee}
        onClose={() => setPermissionDialogEmployee(undefined)}
      />

      <Dialog open={Boolean(deleteConfirmId)} onClose={() => setDeleteConfirmId(null)}>
        <DialogTitle>{t('employees.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">{t('employees.deleteConfirmText')}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>{t('common.cancel')}</Button>
          <Button
            onClick={() => {
              if (deleteConfirmId) {
                deleteEmployee(deleteConfirmId, {
                  onSuccess: () => {
                    showToast(t('employees.employeeDeletedToast'), { severity: 'success' })
                    setDeleteConfirmId(null)
                  },
                  onError: (err) => {
                    showToast(getUserFriendlyError(err), { severity: 'error' })
                    setDeleteConfirmId(null)
                  },
                })
              }
            }}
            variant="contained"
            color="error"
            autoFocus
          >
            {t('employees.deleteButton')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
