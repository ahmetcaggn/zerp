'use client'

import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import {
  Box,
  Button,
  Card,
  CardContent,
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
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import {
  findMockCategoryById,
  findMockMenuItemsByCategoryId,
  findMockProductsByShopId,
} from '../../../api/mock-catalog-data'
import { useMenuCategory } from '../../../hooks/use-menu-categories'
import { useDeleteMenuItem, useMenuItems } from '../../../hooks/use-menu-items'
import { useProducts } from '../../../hooks/use-products'

interface Props {
  categoryId: string
}

export function CategoryMenuItemsPage({ categoryId }: Props) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { showToast } = useToast()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data: category, isLoading: isLoadingCategory } = useMenuCategory(categoryId)

  const { data: menuItemsResult, isLoading: isLoadingItems } = useMenuItems({
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'name', order: 'ASC' },
    filter: {
      ...(selectedShopId ? { 'category.menu.shop.id': selectedShopId } : {}),
      'category.id': categoryId,
    },
  })

  const { data: productsResult } = useProducts({
    pagination: { page: 1, perPage: 1000 },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })

  const fallbackCategory = findMockCategoryById(categoryId)
  const fallbackItems = findMockMenuItemsByCategoryId(categoryId)
  const fallbackProducts = selectedShopId ? findMockProductsByShopId(selectedShopId) : []
  const resolvedCategory = category ?? fallbackCategory
  const resolvedProducts = (productsResult?.data?.length ?? 0) > 0 ? productsResult?.data ?? [] : fallbackProducts
  const items = (menuItemsResult?.data?.length ?? 0) > 0 ? menuItemsResult?.data ?? [] : fallbackItems
  const itemsTotal = menuItemsResult?.total ?? fallbackItems.length

  const productNameMap = useMemo(
    () => new Map(resolvedProducts.map((product) => [product.id, product.name])),
    [resolvedProducts],
  )

  const { mutate: deleteMenuItem } = useDeleteMenuItem()

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  function handleDelete(id: string) {
    deleteMenuItem(id, {
      onSuccess: () => showToast(t('sale.menuItem.deletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  if (isLoadingCategory || isLoadingItems) {
    return (
      <Box sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!resolvedCategory) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="text.secondary">{t('sale.category.emptyState')}</Typography>
      </Box>
    )
  }
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => goTo(`${ROUTES.catalog}/menus/${resolvedCategory.menuId}`)}
        >
          {t('sale.catalog.backToMenu')}
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => goTo(`${ROUTES.catalog}/categories/${resolvedCategory.id}/edit`)}>
            {t('sale.category.editButton')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => goTo(`${ROUTES.catalog}/menu-items/new?categoryId=${resolvedCategory.id}`)}
          >
            {t('sale.menuItem.createButton')}
          </Button>
        </Box>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {resolvedCategory.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {resolvedCategory.description || t('sale.catalog.noDescription')}
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            {t('sale.catalog.menuItemsSectionTitle')}
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('sale.menuItem.form.name')}</TableCell>
                  <TableCell>{t('sale.menuItem.form.price')}</TableCell>
                  <TableCell>{t('sale.menuItem.form.productIds')}</TableCell>
                  <TableCell align="right">{t('common.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      {t('sale.menuItem.emptyState')}
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => {
                    const productLabel =
                      item.productItems && item.productItems.length > 0
                        ? item.productItems
                            .map((entry) => `${productNameMap.get(entry.productId) ?? entry.productId} x${entry.quantity}`)
                            .join(', ')
                        : '—'

                    return (
                      <TableRow
                        key={item.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => goTo(`${ROUTES.catalog}/menu-items/${item.id}`)}
                      >
                        <TableCell>
                          <Typography fontWeight={600}>{item.name}</Typography>
                          {item.description && (
                            <Typography variant="caption" color="text.secondary">
                              {item.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>₺{item.price}</TableCell>
                        <TableCell>{productLabel}</TableCell>
                        <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                          <Tooltip title={t('common.edit')}>
                            <IconButton
                              size="small"
                              onClick={() => goTo(`${ROUTES.catalog}/menu-items/${item.id}`)}
                            >
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
                    )
                  })
                )}
              </TableBody>
            </Table>
          </Box>

          <TablePagination
            component="div"
            count={itemsTotal}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
          />
        </CardContent>
      </Card>
    </Box>
  )
}
