'use client'
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
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import TuneIcon from '@mui/icons-material/Tune'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useProducts, useDeleteProduct } from '../../../hooks/use-products'
import type { ProductResponseDto } from '../../../types/sale'
import { ProductFormDialog } from './product-form-dialog'
import { ProductRecipeDialog } from './product-recipe-dialog'
import { ProductExtraOptionDialog } from './product-extra-option-dialog'

export function ProductList() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductResponseDto | null>(null)

  const [recipeProduct, setRecipeProduct] = useState<ProductResponseDto | null>(null)
  const [extraOptionProduct, setExtraOptionProduct] = useState<ProductResponseDto | null>(null)

  const { data, isLoading } = useProducts({
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'name', order: 'ASC' },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })

  const { mutate: deleteProduct } = useDeleteProduct()

  function handleEdit(product: ProductResponseDto) {
    setEditProduct(product)
    setFormOpen(true)
  }

  function handleDelete(id: string) {
    deleteProduct(id, {
      onSuccess: () => showToast(t('sale.product.deletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{t('sale.tabs.products')}</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditProduct(null)
            setFormOpen(true)
          }}
        >
          {t('sale.product.createButton')}
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
                <TableCell>{t('sale.product.form.name')}</TableCell>
                <TableCell>{t('sale.product.form.preparationTime')}</TableCell>
                <TableCell>{t('sale.product.form.isActive')}</TableCell>
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.data?.length ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {t('sale.product.emptyState')}
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Typography fontWeight={500}>{product.name}</Typography>
                      {product.description && (
                        <Typography variant="caption" color="text.secondary">
                          {product.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {product.preparationTime != null ? `${product.preparationTime} dk` : '—'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.isActive ? 'Aktif' : 'Pasif'}
                        size="small"
                        color={product.isActive ? 'success' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('sale.product.recipeButton')}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => setRecipeProduct(product)}
                        >
                          <MenuBookIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('sale.product.extraOptionButton')}>
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => setExtraOptionProduct(product)}
                        >
                          <TuneIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.edit')}>
                        <IconButton size="small" onClick={() => handleEdit(product)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('common.delete')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(product.id)}
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
        <ProductFormDialog
          open={formOpen}
          mode={editProduct ? 'edit' : 'create'}
          product={editProduct}
          onClose={() => setFormOpen(false)}
        />
      )}

      {recipeProduct && (
        <ProductRecipeDialog
          open={!!recipeProduct}
          product={recipeProduct}
          onClose={() => setRecipeProduct(null)}
        />
      )}

      {extraOptionProduct && (
        <ProductExtraOptionDialog
          open={!!extraOptionProduct}
          product={extraOptionProduct}
          onClose={() => setExtraOptionProduct(null)}
        />
      )}
    </Box>
  )
}
