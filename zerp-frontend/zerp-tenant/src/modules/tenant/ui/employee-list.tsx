'use client'
import AddIcon from '@mui/icons-material/Add'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableCell,
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
import { useEffect, useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useDeleteEmployee, useEmployees,useEmployeeSearch } from '../hooks/use-employees'
import type { EmployeeListResponseDto } from '../types/employee'
import type { EmploymentStatusValue } from '../types/employee'
import { DeletedEmployees } from './deleted-employees'
import { EmployeeFormDialog } from './employee-form-dialog'
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

  const [tab, setTab] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [permissionDialogEmployee, setPermissionDialogEmployee] =
    useState<EmployeeListResponseDto | undefined>(undefined)

  useEffect(() => {
    const id = setTimeout(() => setDebouncedKeyword(searchInput.trim()), 400)
    return () => clearTimeout(id)
  }, [searchInput])

  useEffect(() => {
    const activeTab = searchParams.get('tab')
    const tabIndex = EMPLOYEE_TAB_KEYS.indexOf((activeTab ?? 'active') as (typeof EMPLOYEE_TAB_KEYS)[number])
    setTab(tabIndex >= 0 ? tabIndex : 0)
  }, [searchParams])

  function handleTabChange(nextTab: number) {
    setTab(nextTab)
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', EMPLOYEE_TAB_KEYS[nextTab] ?? EMPLOYEE_TAB_KEYS[0])
    const queryString = params.toString()
    router.replace((queryString ? `${pathname}?${queryString}` : pathname) as Route)
  }

  const params = {
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'id', order: 'ASC' as const },
  }

  const isSearching = debouncedKeyword.length >= 2
  const listResult = useEmployees(isSearching ? undefined : params)
  const searchResult = useEmployeeSearch(debouncedKeyword, params)

  const { data, isLoading, error } = isSearching ? searchResult : listResult
  const { mutate: deleteEmployee } = useDeleteEmployee()

  if (error) showToast(getUserFriendlyError(error), { severity: 'error' })

  const rows = data?.data ?? []
  const total = data?.total ?? 0

  return (
    <Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
      >
        <Typography variant="h5">{t('employees.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          {t('employees.createButton')}
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => handleTabChange(v)} sx={{ mb: 2 }}>
        <Tab label={t('employees.title')} />
        <Tab label={t('employees.deletedTitle')} />
      </Tabs>

      {tab === 1 ? (
        <DeletedEmployees />
      ) : (
        <>
          <TextField
            size="small"
            placeholder={t('employees.searchPlaceholder')}
            value={searchInput}
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
                {rows.map((emp) => (
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
                      <Tooltip title={t('employees.editButton')}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            if (emp.id !== undefined) {
                              router.push(withLocale(locale, `${ROUTES.employees}/${emp.id}`) as Route)
                            }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('employees.permissionsDialogTitle')}>
                        <IconButton
                          size="small"
                          onClick={() => setPermissionDialogEmployee(emp)}
                        >
                          <AdminPanelSettingsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('employees.deleteButton')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            if (emp.id !== undefined) {
                              deleteEmployee(String(emp.id), {
                                onSuccess: () =>
                                  showToast(
                                    t('employees.employeeDeletedToast'),
                                    { severity: 'success' },
                                  ),
                                onError: (err) =>
                                  showToast(getUserFriendlyError(err), { severity: 'error' }),
                              })
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

      <EmployeeFormDialog
        open={formOpen}
        mode="create"
        onClose={() => setFormOpen(false)}
      />
      <EmployeePermissionsDialog
        open={Boolean(permissionDialogEmployee)}
        employee={permissionDialogEmployee}
        onClose={() => setPermissionDialogEmployee(undefined)}
      />
    </Box>
  )
}
