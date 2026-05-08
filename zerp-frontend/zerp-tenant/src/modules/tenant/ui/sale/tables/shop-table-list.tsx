'use client'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useShopTables, useDeleteShopTable } from '../../../hooks/use-shop-tables'
import type { ShopTableResponseDto, ShopTableStatus } from '../../../types/sale'
import { ShopTableFormDialog } from './shop-table-form-dialog'

const statusColorMap: Record<ShopTableStatus, 'success' | 'warning' | 'error' | 'default'> = {
  AVAILABLE: 'success',
  RESERVED: 'warning',
  OCCUPIED: 'error',
  OUT_OF_ORDER: 'default',
}

export function ShopTableList() {
  const { t, locale } = useI18n()
  const { showToast } = useToast()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [editTable, setEditTable] = useState<ShopTableResponseDto | null>(null)

  const { data, isLoading } = useShopTables({
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'name', order: 'ASC' },
  })

  const { mutate: deleteTable } = useDeleteShopTable()

  function handleEdit(table: ShopTableResponseDto) {
    setEditTable(table)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteTable(id, {
      onSuccess: () => showToast(t('sale.table.deletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Masalara sipariş girmek için{' '}
        <Link href={`/${locale}/cashier`} underline="hover" fontWeight={600}>
          Kasa
        </Link>{' '}
        sayfasını kullanın.
      </Alert>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{t('sale.tabs.tables')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditTable(null)
            setFormOpen(true)
          }}
        >
          {t('sale.table.createButton')}
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('sale.table.form.name')}</TableCell>
                <TableCell>{t('sale.table.form.floor')}</TableCell>
                <TableCell>{t('sale.table.form.capacity')}</TableCell>
                <TableCell>{t('sale.table.form.status')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.data?.length ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t('sale.table.emptyState')}
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((table) => (
                  <TableRow key={table.id}>
                    <TableCell>
                      <Typography fontWeight={500}>{table.name}</Typography>
                      {table.description && (
                        <Typography variant="body2" color="text.secondary">
                          {table.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{table.floor}</TableCell>
                    <TableCell>{table.capacity}</TableCell>
                    <TableCell>
                      <Chip
                        label={t(`sale.table.status.${table.status}`)}
                        color={statusColorMap[table.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => handleEdit(table)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(table.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={data?.total ?? 0}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
          />
        </Box>
      )}

      {formOpen && (
        <ShopTableFormDialog
          open={formOpen}
          mode={editTable ? 'edit' : 'create'}
          table={editTable}
          onClose={() => setFormOpen(false)}
        />
      )}
    </Box>
  )
}
