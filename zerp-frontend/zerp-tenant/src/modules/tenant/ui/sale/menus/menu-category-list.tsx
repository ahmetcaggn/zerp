'use client'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
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
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useDeleteMenuCategory,useMenuCategories } from '../../../hooks/use-menu-categories'
import { useMenus } from '../../../hooks/use-menus'
import type { MenuCategoryResponseDto } from '../../../types/sale'
import { MenuCategoryFormDialog } from './menu-category-form-dialog'

export function MenuCategoryList() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [filterMenuId, setFilterMenuId] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<MenuCategoryResponseDto | null>(null)

  const { data: menusResult } = useMenus({
    pagination: { page: 1, perPage: 200 },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })
  const menus = menusResult?.data ?? []

  const { data, isLoading } = useMenuCategories({
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'displayOrder', order: 'ASC' },
    filter: {
      ...(selectedShopId ? { 'menu.shop.id': selectedShopId } : {}),
      ...(filterMenuId ? { 'menu.id': filterMenuId } : {}),
    },
  })

  const { mutate: deleteCategory } = useDeleteMenuCategory()

  function handleEdit(category: MenuCategoryResponseDto) {
    setEditCategory(category)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteCategory(id, {
      onSuccess: () => showToast(t('sale.category.deletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6">{t('sale.tabs.categories')}</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>{t('sale.category.filterLabel')}</InputLabel>
            <Select
              value={filterMenuId}
              label={t('sale.category.filterLabel')}
              onChange={(e) => { setFilterMenuId(e.target.value); setPage(0) }}
            >
              <MenuItem value="">{t('sale.category.allMenus')}</MenuItem>
              {menus.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditCategory(null)
              setFormOpen(true)
            }}
          >
            {t('sale.category.createButton')}
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
                <TableCell>{t('sale.category.form.name')}</TableCell>
                <TableCell>{t('sale.category.form.description')}</TableCell>
                <TableCell>{t('sale.category.form.menuId')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.data?.length ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {t('sale.category.emptyState')}
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Typography fontWeight={500}>{category.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {category.description ?? '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{category.menuName ?? '—'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => handleEdit(category)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(category.id)}
                        >
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
        <MenuCategoryFormDialog
          open={formOpen}
          mode={editCategory ? 'edit' : 'create'}
          category={editCategory}
          preselectedMenuId={filterMenuId || undefined}
          onClose={() => setFormOpen(false)}
        />
      )}
    </Box>
  )
}
