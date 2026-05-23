'use client'

import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LaunchIcon from '@mui/icons-material/Launch'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Switch,
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

import { mockCatalogByShopId } from '../../../api/mock-catalog-data'
import { useDeleteMenu, useMenus, usePatchMenu } from '../../../hooks/use-menus'
import { useDeleteProduct, useProducts } from '../../../hooks/use-products'
import { useUpdateShopDefaultMenuLanguage } from '../../../hooks/use-shops'
import type { MenuLanguage, MenuResponseDto } from '../../../types/sale'

export function CatalogOverviewPage() {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const { scope, shops, refreshShops } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined

  const [activationModalMenu, setActivationModalMenu] = useState<MenuResponseDto | null>(null)
  const [productPage, setProductPage] = useState(0)
  const [productRowsPerPage, setProductRowsPerPage] = useState(10)

  const selectedShop = useMemo(
    () => shops.find((shop) => shop.id === selectedShopId),
    [selectedShopId, shops],
  )

  const defaultLanguageValue: MenuLanguage = selectedShop?.defaultMenuLanguage ?? 'TR'

  const { data: menusResult, isLoading: isMenusLoading, refetch: refetchMenus } = useMenus({
    pagination: { page: 1, perPage: 200 },
    sort: { field: 'name', order: 'ASC' },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })

  const { data: productsResult, isLoading: isProductsLoading } = useProducts({
    pagination: { page: productPage + 1, perPage: productRowsPerPage },
    sort: { field: 'name', order: 'ASC' },
    ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
  })

  const { mutate: deleteMenu } = useDeleteMenu()
  const { mutate: patchMenu, isPending: isUpdatingMenu } = usePatchMenu()
  const { mutate: deleteProduct } = useDeleteProduct()
  const {
    mutateAsync: updateShopDefaultMenuLanguage,
    isPending: isUpdatingDefaultLanguage,
  } = useUpdateShopDefaultMenuLanguage()

  const mockCatalog = selectedShopId ? mockCatalogByShopId[selectedShopId] : undefined
  const fallbackMenus = mockCatalog?.menus ?? []
  const fallbackProducts = mockCatalog?.products ?? []
  const hasRealMenus = (menusResult?.data?.length ?? 0) > 0
  const hasRealProducts = (productsResult?.data?.length ?? 0) > 0

  const menus = hasRealMenus ? menusResult?.data ?? [] : fallbackMenus
  const products = hasRealProducts
    ? productsResult?.data ?? []
    : fallbackProducts.slice(
        productPage * productRowsPerPage,
        productPage * productRowsPerPage + productRowsPerPage,
      )
  const productTotal = hasRealProducts ? productsResult?.total ?? 0 : fallbackProducts.length

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  function handleDeleteMenu(id: string) {
    deleteMenu(id, {
      onSuccess: () => {
        showToast(t('sale.menu.deletedToast'))
        void refetchMenus()
      },
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  function handleDeleteProduct(id: string) {
    deleteProduct(id, {
      onSuccess: () => showToast(t('sale.product.deletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  function applyMenuActiveState(menu: MenuResponseDto, nextActive: boolean) {
    patchMenu(
      {
        id: menu.id,
        fields: { active: nextActive },
      },
      {
        onSuccess: () => {
          showToast(t('sale.menu.updatedToast'))
          void refetchMenus()
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleActiveToggle(menu: MenuResponseDto, nextActive: boolean) {
    if (!menu.active && nextActive) {
      setActivationModalMenu(menu)
      return
    }
    applyMenuActiveState(menu, nextActive)
  }

  async function handleChangeDefaultLanguage(language: MenuLanguage) {
    if (!selectedShopId) return

    try {
      await updateShopDefaultMenuLanguage({
        shopId: selectedShopId,
        data: { defaultMenuLanguage: language },
      })
      await refreshShops()
      showToast(t('sale.menu.defaultLanguage.updatedToast'))
    } catch (err) {
      showToast(getUserFriendlyError(err), { severity: 'error' })
    }
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.75 }}>
          {t('sale.catalog.overviewTitle')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('sale.catalog.overviewDescription')}
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t('sale.catalog.menusSectionTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('sale.catalog.menusSectionDescription')}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl
                size="small"
                sx={{ minWidth: 240 }}
                disabled={scope.mode !== 'SHOP' || isUpdatingDefaultLanguage}
              >
                <InputLabel>{t('sale.menu.defaultLanguage.label')}</InputLabel>
                <Select
                  value={defaultLanguageValue}
                  label={t('sale.menu.defaultLanguage.label')}
                  onChange={(event) => void handleChangeDefaultLanguage(event.target.value as MenuLanguage)}
                >
                  <MenuItem value="TR">{t('sale.menu.language.tr')}</MenuItem>
                  <MenuItem value="EN">{t('sale.menu.language.en')}</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => goTo(`${ROUTES.catalog}/menus/new`)}
              >
                {t('sale.menu.createButton')}
              </Button>
            </Box>
          </Box>

          {scope.mode !== 'SHOP' && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {t('sale.catalog.selectShopWarning')}
            </Alert>
          )}

          {isMenusLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : menus.length === 0 ? (
            <Typography color="text.secondary">{t('sale.menu.emptyState')}</Typography>
          ) : (
            <Grid container spacing={2}>
              {menus.map((menu) => (
                <Grid key={menu.id} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: '100%',
                      borderColor: menu.active ? 'primary.main' : 'divider',
                      transition: 'all .2s ease',
                      '&:hover': { boxShadow: 3, borderColor: 'primary.main' },
                    }}
                  >
                    <CardContent sx={{ display: 'grid', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700 }}>
                          {menu.name}
                        </Typography>
                        <Switch
                          checked={menu.active}
                          disabled={isUpdatingMenu}
                          onChange={(e) => handleActiveToggle(menu, e.target.checked)}
                          inputProps={{ 'aria-label': `toggle-menu-active-${menu.id}` }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>
                        {menu.description || '—'}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {menu.language === 'EN' ? t('sale.menu.language.en') : t('sale.menu.language.tr')}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, pt: 1 }}>
                        <Button
                          size="small"
                          endIcon={<LaunchIcon fontSize="small" />}
                          onClick={() => goTo(`${ROUTES.catalog}/menus/${menu.id}`)}
                        >
                          {t('sale.catalog.openCategoriesButton')}
                        </Button>

                        <Box>
                          <Tooltip title={t('common.edit')}>
                            <IconButton
                              size="small"
                              onClick={() => goTo(`${ROUTES.catalog}/menus/${menu.id}/edit`)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={t('common.delete')}>
                            <IconButton size="small" color="error" onClick={() => handleDeleteMenu(menu.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t('sale.catalog.productsSectionTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('sale.catalog.productsSectionDescription')}
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => goTo(`${ROUTES.catalog}/products/new`)}
            >
              {t('sale.product.createButton')}
            </Button>
          </Box>

          {isProductsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
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
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          {t('sale.product.emptyState')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product) => (
                        <TableRow
                          key={product.id}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => goTo(`${ROUTES.catalog}/products/${product.id}`)}
                        >
                          <TableCell>
                            <Typography fontWeight={600}>{product.name}</Typography>
                            {product.description && (
                              <Typography variant="caption" color="text.secondary">
                                {product.description}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{product.preparationTime != null ? `${product.preparationTime} dk` : '—'}</TableCell>
                          <TableCell>{product.isActive ? t('common.active') : t('common.passive')}</TableCell>
                          <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                            <Tooltip title={t('common.edit')}>
                              <IconButton
                                size="small"
                                onClick={() => goTo(`${ROUTES.catalog}/products/${product.id}`)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('common.delete')}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteProduct(product.id)}
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
              </Box>

              <TablePagination
                component="div"
                count={productTotal}
                page={productPage}
                onPageChange={(_, newPage) => setProductPage(newPage)}
                rowsPerPage={productRowsPerPage}
                onRowsPerPageChange={(e) => {
                  setProductRowsPerPage(parseInt(e.target.value, 10))
                  setProductPage(0)
                }}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!activationModalMenu} onClose={() => setActivationModalMenu(null)} fullWidth maxWidth="sm">
        <DialogTitle>{t('sale.menu.activationModal.title')}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {t('sale.menu.activationModal.description', {
              language:
                activationModalMenu?.language === 'EN'
                  ? t('sale.menu.language.en')
                  : t('sale.menu.language.tr'),
            })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActivationModalMenu(null)}>{t('common.cancel')}</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!activationModalMenu) return
              applyMenuActiveState(activationModalMenu, true)
              setActivationModalMenu(null)
            }}
          >
            {t('sale.menu.activationModal.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
