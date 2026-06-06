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
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { useDeleteMenu, useMenus, usePatchMenu } from '../../../hooks/use-menus'
import { useDeleteProduct, useProducts } from '../../../hooks/use-products'
import { useUpdateShopDefaultMenuLanguage } from '../../../hooks/use-shops'
import { shopParents, targetWithParents } from '../../../permissions/permission-targets'
import type { MenuLanguage, MenuResponseDto, ProductResponseDto } from '../../../types/sale'

export function CatalogOverviewPage() {
  const { t, locale } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const { scope, shops, refreshShops } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const { currentTenantId, hasShopPermission, hasPermissionForTarget, getDisabledReason } =
    useCurrentUserPermissions()
  const unauthorizedReason = t('common.unauthorized')

  const canReadMenus = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.READ_MENU, selectedShopId),
  )
  const canCreateMenu = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.CREATE_MENU, selectedShopId),
  )
  const canReadProducts = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.READ_PRODUCT, selectedShopId),
  )
  const canCreateProduct = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.CREATE_PRODUCT, selectedShopId),
  )
  const canUpdateShop = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.UPDATE_SHOP, selectedShopId),
  )

  const [activationModalMenu, setActivationModalMenu] = useState<MenuResponseDto | null>(null)
  const [productPage, setProductPage] = useState(0)
  const [productRowsPerPage, setProductRowsPerPage] = useState(10)

  const selectedShop = useMemo(
    () => shops.find((shop) => shop.id === selectedShopId),
    [selectedShopId, shops],
  )

  const defaultLanguageValue: MenuLanguage = selectedShop?.defaultMenuLanguage ?? 'TR'

  const {
    data: menusResult,
    isLoading: isMenusLoading,
    refetch: refetchMenus,
  } = useMenus(
    {
      pagination: { page: 1, perPage: 200 },
      sort: { field: 'name', order: 'ASC' },
      ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
    },
    { enabled: canReadMenus },
  )

  const { data: productsResult, isLoading: isProductsLoading } = useProducts(
    {
      pagination: { page: productPage + 1, perPage: productRowsPerPage },
      sort: { field: 'name', order: 'ASC' },
      ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
    },
    { enabled: canReadProducts },
  )

  const { mutate: deleteMenu } = useDeleteMenu()
  const { mutate: patchMenu, isPending: isUpdatingMenu } = usePatchMenu()
  const { mutate: deleteProduct } = useDeleteProduct()
  const { mutateAsync: updateShopDefaultMenuLanguage, isPending: isUpdatingDefaultLanguage } =
    useUpdateShopDefaultMenuLanguage()

  const menus = menusResult?.data ?? []
  const products = productsResult?.data ?? []

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  function canUseMenuAction(
    menu: MenuResponseDto,
    action: keyof typeof PermissionActions,
  ): boolean {
    return hasPermissionForTarget(
      PermissionActions[action],
      targetWithParents(
        'MENU',
        menu.id,
        currentTenantId,
        shopParents(menu.shopId ?? selectedShopId, currentTenantId),
      ),
    )
  }

  function canUseProductAction(
    product: ProductResponseDto,
    action: keyof typeof PermissionActions,
  ): boolean {
    return hasPermissionForTarget(
      PermissionActions[action],
      targetWithParents(
        'PRODUCT',
        product.id,
        currentTenantId,
        shopParents(product.shopId ?? selectedShopId, currentTenantId),
      ),
    )
  }

  function handleDeleteMenu(menu: MenuResponseDto) {
    if (!canUseMenuAction(menu, 'DELETE_MENU')) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    deleteMenu(menu.id, {
      onSuccess: () => {
        showToast(t('sale.menu.deletedToast'))
        void refetchMenus()
      },
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  function handleDeleteProduct(product: ProductResponseDto) {
    if (!canUseProductAction(product, 'DELETE_PRODUCT')) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

    deleteProduct(product.id, {
      onSuccess: () => showToast(t('sale.product.deletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  function applyMenuActiveState(menu: MenuResponseDto, nextActive: boolean) {
    if (!canUseMenuAction(menu, 'UPDATE_MENU')) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

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
    if (!canUpdateShop) {
      showToast(unauthorizedReason, { severity: 'warning' })
      return
    }

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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
              mb: 2,
            }}
          >
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
                disabled={scope.mode !== 'SHOP' || isUpdatingDefaultLanguage || !canUpdateShop}
              >
                <InputLabel>{t('sale.menu.defaultLanguage.label')}</InputLabel>
                <Select
                  value={defaultLanguageValue}
                  label={t('sale.menu.defaultLanguage.label')}
                  onChange={(event) =>
                    void handleChangeDefaultLanguage(event.target.value as MenuLanguage)
                  }
                >
                  <MenuItem value="TR">{t('sale.menu.language.tr')}</MenuItem>
                  <MenuItem value="EN">{t('sale.menu.language.en')}</MenuItem>
                </Select>
              </FormControl>

              <Tooltip title={getDisabledReason(canCreateMenu, unauthorizedReason) ?? ''}>
                <span>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={!canCreateMenu}
                    onClick={() => goTo(`${ROUTES.catalog}/menus/new`)}
                  >
                    {t('sale.menu.createButton')}
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>

          {scope.mode !== 'SHOP' && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {t('sale.catalog.selectShopWarning')}
            </Alert>
          )}

          {scope.mode === 'SHOP' && !canReadMenus && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {unauthorizedReason}
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
                <Grid key={menu.id} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      border: menu.active ? '2px solid #16a34a' : '2px solid #dc2626',
                      bgcolor: menu.active ? 'rgba(22,163,74,0.09)' : 'rgba(220,38,38,0.09)',
                      borderRadius: 3,
                      transition:
                        'transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease, background-color 0.12s ease',
                      '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
                      '&:active': { transform: 'scale(0.98)' },
                    }}
                  >
                    <CardContent sx={{ display: 'grid', gap: 1, p: 2, '&:last-child': { pb: 2 } }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.2 }}
                        >
                          {menu.name}
                        </Typography>
                        <Switch
                          size="small"
                          checked={menu.active}
                          disabled={isUpdatingMenu || !canUseMenuAction(menu, 'UPDATE_MENU')}
                          onChange={(e) => handleActiveToggle(menu, e.target.checked)}
                          inputProps={{ 'aria-label': `toggle-menu-active-${menu.id}` }}
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          minHeight: 32,
                          fontSize: '0.8rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {menu.description || '—'}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: '0.7rem' }}
                      >
                        {menu.language === 'EN'
                          ? t('sale.menu.language.en')
                          : t('sale.menu.language.tr')}
                      </Typography>

                      <Box
                        sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, pt: 0.5 }}
                      >
                        <Button
                          size="small"
                          endIcon={<LaunchIcon sx={{ fontSize: '0.8rem !important' }} />}
                          disabled={
                            !hasPermissionForTarget(
                              PermissionActions.READ_MENU_CATEGORY,
                              targetWithParents(
                                'MENU',
                                menu.id,
                                currentTenantId,
                                shopParents(menu.shopId ?? selectedShopId, currentTenantId),
                              ),
                            )
                          }
                          onClick={() => goTo(`${ROUTES.catalog}/menus/${menu.id}`)}
                          sx={{ fontSize: '0.75rem', py: 0 }}
                        >
                          {t('sale.catalog.openCategoriesButton')}
                        </Button>

                        <Box sx={{ display: 'flex' }}>
                          <Tooltip
                            title={
                              canUseMenuAction(menu, 'UPDATE_MENU')
                                ? t('common.edit')
                                : unauthorizedReason
                            }
                          >
                            <span>
                              <IconButton
                                size="small"
                                disabled={!canUseMenuAction(menu, 'UPDATE_MENU')}
                                onClick={() => goTo(`${ROUTES.catalog}/menus/${menu.id}/edit`)}
                              >
                                <EditIcon sx={{ fontSize: '1.1rem' }} />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip
                            title={
                              canUseMenuAction(menu, 'DELETE_MENU')
                                ? t('common.delete')
                                : unauthorizedReason
                            }
                          >
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                disabled={!canUseMenuAction(menu, 'DELETE_MENU')}
                                onClick={() => handleDeleteMenu(menu)}
                              >
                                <DeleteIcon sx={{ fontSize: '1.1rem' }} />
                              </IconButton>
                            </span>
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              flexWrap: 'wrap',
              mb: 2,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {t('sale.catalog.productsSectionTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('sale.catalog.productsSectionDescription')}
              </Typography>
            </Box>

            <Tooltip title={getDisabledReason(canCreateProduct, unauthorizedReason) ?? ''}>
              <span>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={!canCreateProduct}
                  onClick={() => goTo(`${ROUTES.catalog}/products/new`)}
                >
                  {t('sale.product.createButton')}
                </Button>
              </span>
            </Tooltip>
          </Box>

          {scope.mode === 'SHOP' && !canReadProducts && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {unauthorizedReason}
            </Alert>
          )}

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
                          sx={{
                            cursor: canUseProductAction(product, 'READ_PRODUCT')
                              ? 'pointer'
                              : 'default',
                          }}
                          onClick={() => {
                            if (canUseProductAction(product, 'READ_PRODUCT')) {
                              goTo(`${ROUTES.catalog}/products/${product.id}`)
                            }
                          }}
                        >
                          <TableCell>
                            <Typography fontWeight={600}>{product.name}</Typography>
                            {product.description && (
                              <Typography variant="caption" color="text.secondary">
                                {product.description}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {product.preparationTime != null
                              ? `${product.preparationTime} dk`
                              : '—'}
                          </TableCell>
                          <TableCell>
                            {product.isActive ? t('common.active') : t('common.passive')}
                          </TableCell>
                          <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                            <Tooltip
                              title={
                                canUseProductAction(product, 'UPDATE_PRODUCT')
                                  ? t('common.edit')
                                  : unauthorizedReason
                              }
                            >
                              <span>
                                <IconButton
                                  size="small"
                                  disabled={!canUseProductAction(product, 'UPDATE_PRODUCT')}
                                  onClick={() => goTo(`${ROUTES.catalog}/products/${product.id}`)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip
                              title={
                                canUseProductAction(product, 'DELETE_PRODUCT')
                                  ? t('common.delete')
                                  : unauthorizedReason
                              }
                            >
                              <span>
                                <IconButton
                                  size="small"
                                  color="error"
                                  disabled={!canUseProductAction(product, 'DELETE_PRODUCT')}
                                  onClick={() => handleDeleteProduct(product)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </span>
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
                count={productsResult?.total ?? 0}
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

      <Dialog
        open={!!activationModalMenu}
        onClose={() => setActivationModalMenu(null)}
        fullWidth
        maxWidth="sm"
      >
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
