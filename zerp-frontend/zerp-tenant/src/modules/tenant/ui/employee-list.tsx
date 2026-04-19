'use client'
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
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useDeleteEmployee, useEmployeeSearch, useEmployees } from '../hooks/use-employees'
import type { EmploymentStatusValue } from '../types/employee'
import { DeletedEmployees } from './deleted-employees'
import { EmployeeFormDialog } from './employee-form-dialog'

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

export function EmployeeList() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()

  const [tab, setTab] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setDebouncedKeyword(searchInput.trim()), 400)
    return () => clearTimeout(id)
  }, [searchInput])

  useEffect(() => {
    setPage(0)
  }, [debouncedKeyword])

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

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
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
            onChange={(e) => setSearchInput(e.target.value)}
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
                  <TableCell>Ad Soyad</TableCell>
                  <TableCell>E-posta</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell align="right">İşlemler</TableCell>
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
                              router.push(`${ROUTES.employees}/${emp.id}` as Route)
                            }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('employees.deleteButton')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            if (emp.id !== undefined) {
                              deleteEmployee(emp.id, {
                                onSuccess: () =>
                                  showToast('Çalışan silindi.', { severity: 'success' }),
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
    </Box>
  )
}
