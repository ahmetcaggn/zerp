'use client'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import PaidRoundedIcon from '@mui/icons-material/PaidRounded'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import ScaleRoundedIcon from '@mui/icons-material/ScaleRounded'
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded'
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  TablePagination,
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

import {
  findMockCategoryById,
  findMockMenuItemsByCategoryId,
  findMockMenuItemVisualById,
  findMockProductsByShopId,
} from '../../../api/mock-catalog-data'
import { useMenuCategory } from '../../../hooks/use-menu-categories'
import { useDeleteMenuItem, useMenuItems } from '../../../hooks/use-menu-items'
import { useProducts } from '../../../hooks/use-products'

interface Props {
  categoryId: string
}

function metricTone(id: string) {
  if (id === 'items') return { color: '#163c8f', bg: 'rgba(37,99,235,0.12)', icon: <RestaurantRoundedIcon /> }
  if (id === 'avg') return { color: '#4338ca', bg: 'rgba(99,102,241,0.13)', icon: <PaidRoundedIcon /> }
  if (id === 'linked') return { color: '#3158b8', bg: 'rgba(96,165,250,0.14)', icon: <Inventory2RoundedIcon /> }
  return { color: '#7c2d12', bg: 'rgba(251,146,60,0.14)', icon: <LocalFireDepartmentRoundedIcon /> }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value)
}

function fallbackVisual(name: string) {
  const key = encodeURIComponent(name)
  return `https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80&sig=${key}`
}

export function CategoryMenuItemsPageV2({ categoryId }: Props) {
  const theme = useTheme()
  const { t, locale } = useI18n()
  const router = useRouter()
  const { showToast } = useToast()
  const { scope, shops } = useShopScope()
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
  const hasRealProducts = (productsResult?.data?.length ?? 0) > 0
  const resolvedProducts = hasRealProducts ? productsResult?.data ?? [] : fallbackProducts
  const hasRealItems = (menuItemsResult?.total ?? 0) > 0
  const allItems = hasRealItems ? menuItemsResult?.data ?? [] : fallbackItems
  const paginatedItems = hasRealItems
    ? allItems
    : fallbackItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const itemsTotal = hasRealItems ? menuItemsResult?.total ?? 0 : fallbackItems.length

  const productNameMap = useMemo(
    () => new Map(resolvedProducts.map((product) => [product.id, product.name])),
    [resolvedProducts],
  )

  const { mutate: deleteMenuItem } = useDeleteMenuItem()

  const accentMain = '#2563eb'
  const accentDeep = '#163c8f'
  const accentIndigo = '#4338ca'
  const cardBorder = alpha(accentMain, theme.palette.mode === 'dark' ? 0.22 : 0.16)
  const softSurface = theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, rgba(15,23,42,0.96), rgba(17,24,39,0.9))'
    : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(247,250,252,0.94))'

  const selectedShop = useMemo(() => {
    if (selectedShopId) return shops.find((shop) => shop.id === selectedShopId)
    return undefined
  }, [selectedShopId, shops])

  const summary = useMemo(() => {
    const sourceItems = hasRealItems ? allItems : fallbackItems
    const totalPrice = sourceItems.reduce((sum, item) => sum + item.price, 0)
    const linkedProducts = sourceItems.reduce((sum, item) => sum + (item.productItems?.length ?? 0), 0)
    const avgPrice = sourceItems.length > 0 ? totalPrice / sourceItems.length : 0
    const hottestItem =
      sourceItems.reduce((max, item) => (item.calories && (max?.calories ?? 0) < item.calories ? item : max), sourceItems[0]) ??
      null

    return {
      count: sourceItems.length,
      avgPrice,
      linkedProducts,
      hottestItem,
    }
  }, [allItems, fallbackItems, hasRealItems])

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
      <Box sx={{ py: 10, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!resolvedCategory) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 5,
            borderColor: alpha(theme.palette.text.primary, 0.08),
            background: softSurface,
            p: 2,
          }}
        >
          <Typography color="text.secondary">{t('sale.category.emptyState')}</Typography>
        </Card>
      </Box>
    )
  }

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
              direction={{ xs: 'column', xl: 'row' }}
              justifyContent="space-between"
              spacing={2.5}
              alignItems={{ xl: 'center' }}
            >
              <Stack spacing={2}>
                <Button
                  startIcon={<ArrowBackRoundedIcon />}
                  onClick={() => goTo(`${ROUTES.catalog}/menus/${resolvedCategory.menuId}`)}
                  sx={{
                    alignSelf: 'flex-start',
                    borderRadius: 999,
                    px: 1.5,
                    py: 0.8,
                    color: accentDeep,
                    backgroundColor: alpha(accentMain, 0.08),
                    boxShadow: `0 10px 24px ${alpha(accentMain, 0.14)}`,
                    '&:hover': {
                      backgroundColor: alpha(accentMain, 0.14),
                      boxShadow: `0 14px 30px ${alpha(accentMain, 0.18)}`,
                    },
                  }}
                >
                  {t('sale.catalog.backToMenu')}
                </Button>

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
                    <RestaurantRoundedIcon />
                  </Avatar>

                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 0.5 }}>
                      {resolvedCategory.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
                      {resolvedCategory.description || t('sale.catalog.noDescription')}
                    </Typography>

                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.5 }}>
                      {selectedShop && (
                        <Chip
                          icon={<StorefrontRoundedIcon />}
                          label={selectedShop.name}
                          sx={{
                            borderRadius: 999,
                            bgcolor: alpha(accentMain, 0.08),
                            color: accentDeep,
                            fontWeight: 700,
                            '& .MuiChip-icon': { color: accentDeep },
                          }}
                        />
                      )}
                      {resolvedCategory.menuName && (
                        <Chip
                          label={resolvedCategory.menuName}
                          sx={{
                            borderRadius: 999,
                            bgcolor: alpha(accentIndigo, 0.1),
                            color: accentIndigo,
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ sm: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => goTo(`${ROUTES.catalog}/categories/${resolvedCategory.id}/edit`)}
                  sx={{
                    borderRadius: 999,
                    px: 2.4,
                    py: 1.15,
                    borderColor: alpha(accentMain, 0.34),
                    color: accentDeep,
                    backgroundColor: alpha(accentMain, 0.04),
                    boxShadow: `0 12px 24px ${alpha(accentMain, 0.08)}`,
                    '&:hover': {
                      borderColor: alpha(accentDeep, 0.42),
                      backgroundColor: alpha(accentMain, 0.08),
                    },
                  }}
                >
                  {t('sale.category.editButton')}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => goTo(`${ROUTES.catalog}/menu-items/new?categoryId=${resolvedCategory.id}`)}
                  sx={{
                    borderRadius: 999,
                    px: 2.6,
                    py: 1.2,
                    boxShadow: `0 14px 30px ${alpha(theme.palette.primary.main, 0.28)}`,
                  }}
                >
                  {t('sale.menuItem.createButton')}
                </Button>
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
              {[
                { id: 'items', label: 'Toplam Oge', value: summary.count, helper: 'Kart gorunumu' },
                { id: 'avg', label: 'Ort. Fiyat', value: formatCurrency(summary.avgPrice), helper: 'Kategori ortalamasi' },
                { id: 'linked', label: 'Bagli Urun', value: summary.linkedProducts, helper: 'Toplam eslesme' },
                {
                  id: 'hottest',
                  label: 'One Cikan',
                  value: summary.hottestItem?.name ?? '-',
                  helper: summary.hottestItem?.calories ? `${summary.hottestItem.calories} kcal` : 'Secili kategori',
                },
              ].map((metric) => {
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
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textTransform: 'uppercase', letterSpacing: '.08em' }}
                        >
                          {metric.label}
                        </Typography>
                        <Typography
                          variant={metric.id === 'hottest' ? 'h6' : 'h5'}
                          sx={{ fontWeight: 900, lineHeight: 1.1 }}
                          noWrap={metric.id === 'hottest'}
                        >
                          {metric.value}
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
          <Stack spacing={2.25}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
                {t('sale.catalog.menuItemsSectionTitle')}
              </Typography>
              <Typography color="text.secondary">
                Fotografli vitrin kartlari ile kategoriye bagli menu ogelerini daha guclu bir sunumda inceleyin.
              </Typography>
            </Box>

            {itemsTotal === 0 ? (
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
                  Menu ogesi listesi su an bos
                </Typography>
                <Typography color="text.secondary">{t('sale.menuItem.emptyState')}</Typography>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
                    gap: 2,
                  }}
                >
                  {paginatedItems.map((item) => {
                    const visual = findMockMenuItemVisualById(item.id)
                    const imageUrl = visual?.imageUrl ?? fallbackVisual(item.name)
                    const productChips = item.productItems ?? []

                    return (
                      <Card
                        key={item.id}
                        variant="outlined"
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: 4,
                          borderColor: alpha(accentMain, 0.18),
                          background: theme.palette.mode === 'dark'
                            ? `linear-gradient(160deg, ${alpha('#0f172a', 0.98)}, ${alpha('#111827', 0.92)})`
                            : 'linear-gradient(160deg, rgba(255,255,255,0.98), rgba(248,250,252,0.92))',
                          boxShadow: `0 16px 38px ${alpha(accentMain, 0.1)}`,
                          transition: 'transform .22s ease, box-shadow .22s ease, border-color .22s ease',
                          cursor: 'pointer',
                          '&:before': {
                            content: '""',
                            position: 'absolute',
                            inset: 0,
                            background: `radial-gradient(circle at top right, ${alpha(accentIndigo, 0.12)}, transparent 34%)`,
                            pointerEvents: 'none',
                          },
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            borderColor: alpha(accentDeep, 0.34),
                            boxShadow: `0 22px 48px ${alpha(accentMain, 0.18)}`,
                          },
                        }}
                        onClick={() => goTo(`${ROUTES.catalog}/menu-items/${item.id}`)}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <Box
                            component="img"
                            src={imageUrl}
                            alt={item.name}
                            sx={{
                              width: '100%',
                              height: 220,
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                          {visual?.badge && (
                            <Chip
                              label={visual.badge}
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 14,
                                left: 14,
                                borderRadius: 999,
                                bgcolor: alpha('#ffffff', 0.86),
                                color: accentDeep,
                                fontWeight: 800,
                                backdropFilter: 'blur(8px)',
                              }}
                            />
                          )}
                          <Box
                            sx={{
                              position: 'absolute',
                              inset: 'auto 0 0 0',
                              p: 2,
                              background: 'linear-gradient(180deg, transparent, rgba(15,23,42,0.8))',
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-end" spacing={1}>
                              <Typography variant="h6" sx={{ fontWeight: 900, color: '#fff' }}>
                                {item.name}
                              </Typography>
                              <Chip
                                label={formatCurrency(item.price)}
                                sx={{
                                  borderRadius: 999,
                                  bgcolor: alpha('#ffffff', 0.92),
                                  color: accentDeep,
                                  fontWeight: 900,
                                }}
                              />
                            </Stack>
                          </Box>
                        </Box>

                        <CardContent sx={{ position: 'relative', display: 'grid', gap: 1.5, minHeight: 260, p: 2.2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ minHeight: 42 }}>
                            {item.description || t('sale.catalog.noDescription')}
                          </Typography>

                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {item.calories != null && (
                              <Chip
                                size="small"
                                icon={<LocalFireDepartmentRoundedIcon />}
                                label={`${item.calories} kcal`}
                                sx={{
                                  borderRadius: 999,
                                  bgcolor: alpha('#fb923c', 0.12),
                                  color: '#9a3412',
                                  fontWeight: 700,
                                  '& .MuiChip-icon': { color: '#ea580c' },
                                }}
                              />
                            )}
                            {item.weight && (
                              <Chip
                                size="small"
                                icon={<ScaleRoundedIcon />}
                                label={`${item.weight} g`}
                                sx={{
                                  borderRadius: 999,
                                  bgcolor: alpha(accentMain, 0.08),
                                  color: accentDeep,
                                  fontWeight: 700,
                                  '& .MuiChip-icon': { color: accentDeep },
                                }}
                              />
                            )}
                            {productChips.length > 0 && (
                              <Chip
                                size="small"
                                icon={<Inventory2RoundedIcon />}
                                label={`${productChips.length} urun`}
                                sx={{
                                  borderRadius: 999,
                                  bgcolor: alpha(accentIndigo, 0.1),
                                  color: accentIndigo,
                                  fontWeight: 700,
                                  '& .MuiChip-icon': { color: accentIndigo },
                                }}
                              />
                            )}
                          </Stack>

                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.8 }}>
                              Bagli Urunler
                            </Typography>
                            <Stack direction="row" spacing={0.75} flexWrap="wrap">
                              {productChips.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                  -
                                </Typography>
                              ) : (
                                productChips.map((entry, index) => (
                                  <Chip
                                    key={`${entry.productId}-${index}`}
                                    size="small"
                                    label={`${productNameMap.get(entry.productId) ?? entry.productId} x${entry.quantity}`}
                                    sx={{
                                      borderRadius: 999,
                                      bgcolor: alpha(theme.palette.text.primary, 0.06),
                                      color: 'text.primary',
                                      fontWeight: 700,
                                    }}
                                  />
                                ))
                              )}
                            </Stack>
                          </Box>

                          <Box sx={{ mt: 'auto' }}>
                            <Divider sx={{ mb: 1.25, opacity: 0.7 }} />
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                              <Button
                                size="small"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  goTo(`${ROUTES.catalog}/menu-items/${item.id}`)
                                }}
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
                                Detayi Ac
                              </Button>

                              <Stack direction="row" spacing={0.5}>
                                <Tooltip title={t('common.edit')}>
                                  <IconButton
                                    size="small"
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      goTo(`${ROUTES.catalog}/menu-items/${item.id}`)
                                    }}
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
                                    onClick={(event) => {
                                      event.stopPropagation()
                                      handleDelete(item.id)
                                    }}
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
                    )
                  })}
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
                  sx={{
                    mt: 0.5,
                    '& .MuiTablePagination-toolbar': {
                      px: 0,
                    },
                  }}
                />
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
