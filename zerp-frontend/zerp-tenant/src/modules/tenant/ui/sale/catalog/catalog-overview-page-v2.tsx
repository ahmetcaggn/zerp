'use client'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded'
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded'
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import {
  Alert,
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
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
import type { MenuLanguage, MenuResponseDto, ProductResponseDto } from '../../../types/sale'

function metricTone(id: string) {
  if (id === 'menus') return { color: '#163c8f', bg: 'rgba(37,99,235,0.12)', icon: <RestaurantMenuRoundedIcon /> }
  if (id === 'products') return { color: '#1d4ed8', bg: 'rgba(59,130,246,0.12)', icon: <Inventory2RoundedIcon /> }
  if (id === 'active') return { color: '#4338ca', bg: 'rgba(99,102,241,0.13)', icon: <AutoAwesomeRoundedIcon /> }
  return { color: '#3158b8', bg: 'rgba(96,165,250,0.14)', icon: <ScheduleRoundedIcon /> }
}

function formatProductStatus(isActive: boolean, t: ReturnType<typeof useI18n>['t']) {
  return isActive ? t('common.active') : t('common.passive')
}

export function CatalogOverviewPageV2() {
  const theme = useTheme()
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
      { id: menu.id, fields: { active: nextActive } },
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

  const metrics = useMemo(
    () => [
      { id: 'menus', label: 'Toplam Menü', value: menus.length, helper: 'Kart görünümü' },
      { id: 'products', label: 'Toplam Ürün', value: productTotal, helper: 'Tablo görünümü' },
      { id: 'active', label: 'Aktif Menü', value: menus.filter((menu) => menu.active).length, helper: 'Serviste olanlar' },
      {
        id: 'avgTime',
        label: 'Ort. Hazırlık',
        value:
          products.length > 0
            ? Math.round(
                products.reduce((sum, item) => sum + (item.preparationTime ?? 0), 0) / Math.max(products.length, 1),
              )
            : 0,
        helper: 'Dakika',
      },
    ],
    [menus, productTotal, products],
  )

  const accentMain = '#2563eb'
  const accentDeep = '#163c8f'
  const accentIndigo = '#4338ca'
  const cardBorder = alpha(accentMain, theme.palette.mode === 'dark' ? 0.22 : 0.16)
  const softSurface = theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, rgba(15,23,42,0.96), rgba(17,24,39,0.9))'
    : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(247,250,252,0.94))'

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'grid', gap: 3 }}>
      <Card
        variant="outlined"
        sx={{
          overflow: 'hidden',
          borderRadius: 6,
          borderColor: cardBorder,
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at top left, rgba(37,99,235,0.18), transparent 28%), linear-gradient(145deg, rgba(15,23,42,0.98), rgba(17,24,39,0.92))'
            : 'radial-gradient(circle at top left, rgba(37,99,235,0.14), transparent 26%), linear-gradient(145deg, rgba(255,255,255,0.98), rgba(243,248,252,0.92))',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 24px 60px rgba(2, 6, 23, 0.38)'
            : '0 26px 60px rgba(15, 23, 42, 0.10)',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              justifyContent="space-between"
              spacing={2.5}
              alignItems={{ lg: 'center' }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: alpha(accentMain, 0.12),
                    color: accentDeep,
                    boxShadow: `0 0 0 10px ${alpha(accentMain, 0.06)}`,
                  }}
                >
                  <RestaurantMenuRoundedIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 0.5 }}>
                    Katalog Yönetimi
                  </Typography>
                  
                </Box>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ sm: 'center' }}>
                <Paper
                  variant="outlined"
                  sx={{
                    px: 1.6,
                    py: 1.1,
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderColor: alpha(theme.palette.text.primary, 0.12),
                    backgroundColor: alpha(theme.palette.background.paper, 0.72),
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <StorefrontRoundedIcon sx={{ color: accentDeep, fontSize: 18 }} />
                  <Typography variant="body2" fontWeight={700}>
                    {selectedShop?.name ?? 'Sube secili degil'}
                  </Typography>
                </Paper>
                <Paper
                  variant="outlined"
                  sx={{
                    px: 1.6,
                    py: 1.1,
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderColor: alpha(theme.palette.text.primary, 0.12),
                    backgroundColor: alpha(theme.palette.background.paper, 0.72),
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <LanguageRoundedIcon sx={{ color: accentDeep, fontSize: 18 }} />
                  <Typography variant="body2" fontWeight={700}>
                    {defaultLanguageValue === 'EN' ? t('sale.menu.language.en') : t('sale.menu.language.tr')}
                  </Typography>
                </Paper>
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              {metrics.map((metric) => {
                const tone = metricTone(metric.id)
                return (
                  <Card
                    key={metric.id}
                    variant="outlined"
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      borderRadius: 4,
                      borderColor: alpha(theme.palette.text.primary, 0.08),
                      background: softSurface,
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 16px 32px rgba(2, 6, 23, 0.26)'
                        : '0 16px 30px rgba(15, 23, 42, 0.05)',
                      transition: 'transform .2s ease, border-color .2s ease, box-shadow .2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: alpha(tone.color, 0.34),
                        boxShadow: theme.palette.mode === 'dark'
                          ? `0 20px 36px ${alpha('#020617', 0.32)}`
                          : `0 20px 36px ${alpha('#0f172a', 0.08)}`,
                      },
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.75, p: 2.2 }}>
                      <Avatar sx={{ bgcolor: tone.bg, color: tone.color, width: 46, height: 46 }}>
                        {tone.icon}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '.08em' }}>
                          {metric.label}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                          {metric.id === 'avgTime' ? `${metric.value} dk` : metric.value}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {metric.helper}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )
              })}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 5,
          borderColor: alpha(theme.palette.text.primary, 0.08),
          background: softSurface,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 18px 44px rgba(2, 6, 23, 0.26)'
            : '0 18px 44px rgba(15, 23, 42, 0.06)',
        }}
      >
        <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
          <Stack spacing={2.5}>
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              justifyContent="space-between"
              spacing={2}
              alignItems={{ lg: 'center' }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
                  Menüler
                </Typography>
               
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ sm: 'center' }}>
                <FormControl
                  size="small"
                  sx={{
                    minWidth: 250,
                    '& .MuiOutlinedInput-root': { borderRadius: 3 },
                  }}
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
                  startIcon={<AddRoundedIcon />}
                  onClick={() => goTo(`${ROUTES.catalog}/menus/new`)}
                  sx={{
                    borderRadius: 999,
                    px: 2.4,
                    py: 1.2,
                    boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.28)}`,
                  }}
                >
                  {t('sale.menu.createButton')}
                </Button>
              </Stack>
            </Stack>

            {scope.mode !== 'SHOP' && (
              <Alert severity="warning" sx={{ borderRadius: 3 }}>
                {t('sale.catalog.selectShopWarning')}
              </Alert>
            )}

            {isMenusLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : menus.length === 0 ? (
              <Box
                sx={{
                  borderRadius: 4,
                  border: `1px dashed ${alpha(theme.palette.text.primary, 0.16)}`,
                  p: 4,
                  textAlign: 'center',
                  backgroundColor: alpha(accentMain, 0.04),
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.75 }}>
                  Menü listesi şu an boş
                </Typography>
                <Typography color="text.secondary">
                  {t('sale.menu.emptyState')}
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                {menus.map((menu) => (
                  <Card
                    key={menu.id}
                    variant="outlined"
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 4,
                      borderColor: menu.active ? alpha(accentMain, 0.34) : alpha(theme.palette.text.primary, 0.08),
                      background: theme.palette.mode === 'dark'
                        ? `linear-gradient(160deg, ${alpha('#0f172a', 0.98)}, ${alpha('#111827', 0.92)})`
                        : 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92))',
                      boxShadow: menu.active
                        ? `0 16px 38px ${alpha(accentMain, 0.16)}`
                        : '0 14px 34px rgba(15, 23, 42, 0.06)',
                      transition: 'transform .22s ease, box-shadow .22s ease, border-color .22s ease',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: `radial-gradient(circle at top right, ${alpha(accentMain, 0.12)}, transparent 34%)`,
                        pointerEvents: 'none',
                      },
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        borderColor: alpha(accentDeep, 0.42),
                        boxShadow: `0 20px 44px ${alpha(accentMain, 0.2)}`,
                      },
                    }}
                  >
                    <CardContent sx={{ position: 'relative', display: 'grid', gap: 1.6, minHeight: 250, p: 2.3 }}>
                      <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="flex-start">
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.75 }}>
                            {menu.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 42 }}>
                            {menu.description || t('sale.catalog.noDescription')}
                          </Typography>
                        </Box>
                        <Switch
                          checked={menu.active}
                          disabled={isUpdatingMenu}
                          onChange={(e) => handleActiveToggle(menu, e.target.checked)}
                          inputProps={{ 'aria-label': `toggle-menu-active-${menu.id}` }}
                        />
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          size="small"
                          label={menu.language === 'EN' ? t('sale.menu.language.en') : t('sale.menu.language.tr')}
                          sx={{
                            borderRadius: 999,
                            bgcolor: alpha(accentMain, 0.1),
                            color: accentDeep,
                            fontWeight: 700,
                          }}
                        />
                        <Chip
                          size="small"
                          label={menu.active ? 'Aktif' : 'Pasif'}
                          sx={{
                            borderRadius: 999,
                            bgcolor: menu.active ? alpha(accentIndigo, 0.11) : alpha(theme.palette.text.primary, 0.08),
                            color: menu.active ? accentIndigo : 'text.secondary',
                            fontWeight: 700,
                          }}
                        />
                      </Stack>

                      <Box sx={{ mt: 'auto' }}>
                        <Divider sx={{ mb: 1.25, opacity: 0.7 }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                          <Button
                            size="small"
                            onClick={() => goTo(`${ROUTES.catalog}/menus/${menu.id}`)}
                            sx={{
                              borderRadius: 999,
                              px: 1.5,
                              py: 0.75,
                              fontWeight: 800,
                              color: accentDeep,
                              backgroundColor: alpha(accentMain, 0.08),
                              boxShadow: `0 10px 24px ${alpha(accentMain, 0.16)}`,
                              '&:hover': {
                                backgroundColor: alpha(accentMain, 0.14),
                                boxShadow: `0 14px 30px ${alpha(accentMain, 0.22)}`,
                              },
                            }}
                          >
                            {t('sale.catalog.openCategoriesButton')}
                          </Button>
                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title={t('common.edit')}>
                              <IconButton
                                size="small"
                                onClick={() => goTo(`${ROUTES.catalog}/menus/${menu.id}/edit`)}
                                sx={{
                                  borderRadius: 2.5,
                                  bgcolor: alpha(theme.palette.text.primary, 0.05),
                                  '&:hover': { bgcolor: alpha(accentMain, 0.1) },
                                }}
                              >
                                <EditRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('common.delete')}>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteMenu(menu.id)}
                                sx={{
                                  borderRadius: 2.5,
                                  bgcolor: alpha(theme.palette.error.main, 0.08),
                                }}
                              >
                                <DeleteOutlineRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 5,
          borderColor: alpha(theme.palette.text.primary, 0.08),
          background: softSurface,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 18px 44px rgba(2, 6, 23, 0.26)'
            : '0 18px 44px rgba(15, 23, 42, 0.06)',
        }}
      >
        <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
          <Stack spacing={2.25}>
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              justifyContent="space-between"
              spacing={2}
              alignItems={{ lg: 'center' }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
                  Ürünler
                </Typography>
               
              </Box>

              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => goTo(`${ROUTES.catalog}/products/new`)}
                sx={{
                  borderRadius: 999,
                  px: 2.4,
                  py: 1.2,
                  boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, 0.28)}`,
                }}
              >
                {t('sale.product.createButton')}
              </Button>
            </Stack>

            {isProductsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box
                sx={{
                  overflowX: 'auto',
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                  backgroundColor: alpha(theme.palette.background.paper, 0.74),
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        '& th': {
                          borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                          bgcolor: alpha(accentMain, 0.04),
                          py: 1.5,
                        },
                      }}
                    >
                      <TableCell>{t('sale.product.form.name')}</TableCell>
                      <TableCell>{t('sale.product.form.preparationTime')}</TableCell>
                      <TableCell>{t('sale.product.form.isActive')}</TableCell>
                      <TableCell align="right">{t('common.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {products.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                          <Stack spacing={1} alignItems="center">
                            <Avatar sx={{ bgcolor: alpha(accentMain, 0.1), color: accentDeep }}>
                              <Inventory2RoundedIcon />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              Urun listesi henuz bos
                            </Typography>
                            <Typography color="text.secondary">{t('sale.product.emptyState')}</Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ) : (
                      products.map((product: ProductResponseDto) => (
                        <TableRow
                          key={product.id}
                          hover
                          sx={{
                            cursor: 'pointer',
                            transition: 'background-color .18s ease',
                            '&:hover': {
                              backgroundColor: alpha(accentMain, 0.04),
                            },
                          }}
                          onClick={() => goTo(`${ROUTES.catalog}/products/${product.id}`)}
                        >
                          <TableCell sx={{ py: 1.75 }}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                              <Avatar
                                variant="rounded"
                                sx={{
                                  width: 42,
                                  height: 42,
                                  borderRadius: 2.5,
                                  bgcolor: alpha(accentMain, 0.1),
                                  color: accentDeep,
                                }}
                              >
                                <CategoryRoundedIcon fontSize="small" />
                              </Avatar>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography fontWeight={800}>{product.name}</Typography>
                                <Typography variant="caption" color="text.secondary" noWrap>
                                  {product.description || 'Aciklama eklenmemis'}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ py: 1.75 }}>
                            <Stack direction="row" spacing={0.75} alignItems="center">
                              <ScheduleRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                              <Typography fontWeight={700}>
                                {product.preparationTime != null ? `${product.preparationTime} dk` : '—'}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ py: 1.75 }}>
                            <Chip
                              size="small"
                              label={formatProductStatus(product.isActive, t)}
                              sx={{
                                borderRadius: 999,
                                bgcolor: product.isActive ? alpha(accentIndigo, 0.11) : alpha(theme.palette.text.primary, 0.08),
                                color: product.isActive ? accentIndigo : 'text.secondary',
                                fontWeight: 700,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" onClick={(e) => e.stopPropagation()} sx={{ py: 1.75 }}>
                            <Stack direction="row" justifyContent="flex-end" spacing={0.75}>
                              <Tooltip title={t('common.edit')}>
                                <IconButton
                                  size="small"
                                  onClick={() => goTo(`${ROUTES.catalog}/products/${product.id}`)}
                                  sx={{
                                    borderRadius: 2.5,
                                    bgcolor: alpha(theme.palette.text.primary, 0.05),
                                    '&:hover': { bgcolor: alpha(accentMain, 0.1) },
                                  }}
                                >
                                  <EditRoundedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('common.delete')}>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  sx={{
                                    borderRadius: 2.5,
                                    bgcolor: alpha(theme.palette.error.main, 0.08),
                                  }}
                                >
                                  <DeleteOutlineRoundedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Box>
            )}

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
              sx={{
                mt: -0.5,
                '& .MuiTablePagination-toolbar': {
                  px: 0,
                },
              }}
            />
          </Stack>
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
