'use client'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import TuneIcon from '@mui/icons-material/Tune'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useDeleteProduct,useProducts } from '../../../hooks/use-products'
import type { ProductResponseDto } from '../../../types/sale'
import { ProductExtraOptionDialog } from './product-extra-option-dialog'
import { ProductFormDialog } from './product-form-dialog'
import { ProductRecipeDialog } from './product-recipe-dialog'

export function ProductList() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductResponseDto | null>(null)
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState<ProductResponseDto | null>(null)

  const [recipeProduct, setRecipeProduct] = useState<ProductResponseDto | null>(null)
  const [extraOptionProduct, setExtraOptionProduct] = useState<ProductResponseDto | null>(null)

  const { data, isLoading } = useProducts({
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'name', order: 'ASC' },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })

  const { mutate: deleteProduct } = useDeleteProduct()

  function handleDelete(id: string) {
    deleteProduct(id, {
      onSuccess: () => {
        showToast(t('sale.product.deletedToast'))
        setDeleteConfirmProduct(null)
      },
      onError: (err) => {
        showToast(getUserFriendlyError(err), { severity: 'error' })
        setDeleteConfirmProduct(null)
      },
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
                <TableCell align="right">{t('common.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data?.data?.length ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
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
                      <Tooltip title={t('common.delete')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteConfirmProduct(product)}
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

      <Dialog
        open={Boolean(deleteConfirmProduct)}
        onClose={() => setDeleteConfirmProduct(null)}
      >
        <DialogTitle>{t('sale.product.deleteConfirmTitle')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {t('sale.product.deleteConfirmText')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmProduct(null)}>{t('common.cancel')}</Button>
          <Button
            onClick={() => {
              if (deleteConfirmProduct) {
                handleDelete(deleteConfirmProduct.id)
              }
            }}
            variant="contained"
            color="error"
            autoFocus
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
