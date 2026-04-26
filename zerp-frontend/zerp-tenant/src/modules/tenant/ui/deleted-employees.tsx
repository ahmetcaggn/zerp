'use client'
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import RestoreIcon from '@mui/icons-material/Restore'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useDeletedEmployees, usePatchEmployee } from '../hooks/use-employees'

export function DeletedEmployees() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data, isLoading, error } = useDeletedEmployees({
    pagination: { page: page + 1, perPage: rowsPerPage },
  })
  const { mutate: patchEmployee } = usePatchEmployee()

  if (error) showToast(getUserFriendlyError(error), { severity: 'error' })

  const rows = data?.data ?? []
  const total = data?.total ?? 0

  function handleRestore(id: string) {
    patchEmployee(
      { id, fields: { isActive: true } },
      {
        onSuccess: () => showToast('Çalışan geri yüklendi.', { severity: 'success' }),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
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
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Ad Soyad</TableCell>
            <TableCell>E-posta</TableCell>
            <TableCell>Telefon</TableCell>
            <TableCell align="right">{t('employees.restoreButton')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>{`${emp.firstName ?? ''} ${emp.lastName ?? ''}`}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.phoneNumber ?? '—'}</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<RestoreIcon />}
                  onClick={() => emp.id !== undefined && handleRestore(String(emp.id))}
                >
                  {t('employees.restoreButton')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
    </>
  )
}
