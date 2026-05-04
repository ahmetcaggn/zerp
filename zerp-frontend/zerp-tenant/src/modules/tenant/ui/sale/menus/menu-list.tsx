'use client'
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
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useMenus, useDeleteMenu } from '../../../hooks/use-menus'
import type { MenuResponseDto } from '../../../types/sale'
import { MenuFormDialog } from './menu-form-dialog'

export function MenuList() {
  const { t } = useI18n()
  const { showToast } = useToast()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [editMenu, setEditMenu] = useState<MenuResponseDto | null>(null)

  const { data, isLoading } = useMenus({
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'name', order: 'ASC' },
  })

  const { mutate: deleteMenu } = useDeleteMenu()

  function handleEdit(menu: MenuResponseDto) {
    setEditMenu(menu)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteMenu(id, {
      onSuccess: () => showToast(t('sale.menu.deletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{t('sale.tabs.menus')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditMenu(null)
            setFormOpen(true)
          }}
        >
          {t('sale.menu.createButton')}
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
                <TableCell>{t('sale.menu.form.name')}</TableCell>
                <TableCell>{t('sale.menu.form.description')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.data?.length ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    {t('sale.menu.emptyState')}
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((menu) => (
                  <TableRow key={menu.id}>
                    <TableCell>
                      <Typography fontWeight={500}>{menu.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {menu.description ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => handleEdit(menu)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(menu.id)}>
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
        <MenuFormDialog
          open={formOpen}
          mode={editMenu ? 'edit' : 'create'}
          menu={editMenu}
          onClose={() => setFormOpen(false)}
        />
      )}
    </Box>
  )
}
