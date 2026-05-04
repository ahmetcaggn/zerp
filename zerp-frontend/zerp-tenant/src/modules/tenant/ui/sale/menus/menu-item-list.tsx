'use client'
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
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
import { useMenuItems, useDeleteMenuItem } from '../../../hooks/use-menu-items'
import { useMenuCategories } from '../../../hooks/use-menu-categories'
import type { MenuItemResponseDto } from '../../../types/sale'
import { MenuItemFormDialog } from './menu-item-form-dialog'

export function MenuItemList() {
  const { t } = useI18n()
  const { showToast } = useToast()

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filterCategoryId, setFilterCategoryId] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<MenuItemResponseDto | null>(null)

  const { data: categoriesResult } = useMenuCategories({ pagination: { page: 1, perPage: 200 } })
  const categories = categoriesResult?.data ?? []

  const { data, isLoading } = useMenuItems({
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'name', order: 'ASC' },
    filter: filterCategoryId ? { categoryId: filterCategoryId } : {},
  })

  const { mutate: deleteMenuItem } = useDeleteMenuItem()

  function handleEdit(item: MenuItemResponseDto) {
    setEditItem(item)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteMenuItem(id, {
      onSuccess: () => showToast(t('sale.menuItem.deletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6">{t('sale.tabs.menuItems')}</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>{t('sale.menuItem.filterLabel')}</InputLabel>
            <Select
              value={filterCategoryId}
              label={t('sale.menuItem.filterLabel')}
              onChange={(e) => { setFilterCategoryId(e.target.value); setPage(0) }}
            >
              <MenuItem value="">{t('sale.menuItem.allCategories')}</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name} {c.menuName ? `(${c.menuName})` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditItem(null)
              setFormOpen(true)
            }}
          >
            {t('sale.menuItem.createButton')}
          </Button>
        </Box>
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
                <TableCell>{t('sale.menuItem.form.name')}</TableCell>
                <TableCell>{t('sale.menuItem.form.price')}</TableCell>
                <TableCell>{t('sale.menuItem.form.categoryId')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.data?.length ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {t('sale.menuItem.emptyState')}
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Typography fontWeight={500}>{item.name}</Typography>
                      {item.description && (
                        <Typography variant="caption" color="text.secondary">
                          {item.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>₺{item.price}</TableCell>
                    <TableCell>
                      <Typography variant="body2">{item.categoryName ?? '—'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => handleEdit(item)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
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
        <MenuItemFormDialog
          open={formOpen}
          mode={editItem ? 'edit' : 'create'}
          menuItem={editItem}
          preselectedCategoryId={filterCategoryId || undefined}
          onClose={() => setFormOpen(false)}
        />
      )}
    </Box>
  )
}
