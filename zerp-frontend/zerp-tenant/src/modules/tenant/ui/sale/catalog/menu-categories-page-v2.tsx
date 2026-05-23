'use client'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded'
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
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'

import { findMockMenuById, findMockMenuCategoriesByMenuId } from '../../../api/mock-catalog-data'
import { useDeleteMenuCategory, useMenuCategories } from '../../../hooks/use-menu-categories'
import { useMenu } from '../../../hooks/use-menus'

interface Props {
  menuId: string
}

function metricTone(id: string) {
  if (id === 'categories') return { color: '#163c8f', bg: 'rgba(37,99,235,0.12)', icon: <CategoryRoundedIcon /> }
  if (id === 'descriptions') return { color: '#4338ca', bg: 'rgba(99,102,241,0.13)', icon: <AutoAwesomeRoundedIcon /> }
  return { color: '#3158b8', bg: 'rgba(96,165,250,0.14)', icon: <RestaurantMenuRoundedIcon /> }
}

export function MenuCategoriesPageV2({ menuId }: Props) {
  const theme = useTheme()
  const { t, locale } = useI18n()
  const router = useRouter()
  const { showToast } = useToast()
  const { scope, shops } = useShopScope()

  const { data: menu, isLoading: isLoadingMenu } = useMenu(menuId)
  const { data: categoriesResult, isLoading: isLoadingCategories } = useMenuCategories({
    pagination: { page: 1, perPage: 200 },
    sort: { field: 'name', order: 'ASC' },
    filter: { 'menu.id': menuId },
  })

  const fallbackMenu = findMockMenuById(menuId)
  const fallbackCategories = findMockMenuCategoriesByMenuId(menuId)
  const resolvedMenu = menu ?? fallbackMenu
  const categories = (categoriesResult?.data?.length ?? 0) > 0 ? categoriesResult?.data ?? [] : fallbackCategories

  const { mutate: deleteCategory } = useDeleteMenuCategory()

  const accentMain = '#2563eb'
  const accentDeep = '#163c8f'
  const accentIndigo = '#4338ca'
  const cardBorder = alpha(accentMain, theme.palette.mode === 'dark' ? 0.22 : 0.16)
  const softSurface = theme.palette.mode === 'dark'
    ? 'linear-gradient(145deg, rgba(15,23,42,0.96), rgba(17,24,39,0.9))'
    : 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(247,250,252,0.94))'

  const selectedShop = useMemo(() => {
    if (resolvedMenu?.shopId) return shops.find((shop) => shop.id === resolvedMenu.shopId)
    if (scope.mode === 'SHOP') return shops.find((shop) => shop.id === scope.shopId)
    return undefined
  }, [resolvedMenu?.shopId, scope, shops])

  const metrics = useMemo(
    () => [
      { id: 'categories', label: 'Toplam Kategori', value: categories.length, helper: 'Menu akisi' },
      {
        id: 'descriptions',
        label: 'Aciklamali',
        value: categories.filter((category) => Boolean(category.description?.trim())).length,
        helper: 'Icerik kalitesi',
      },
      {
        id: 'menu',
        label: 'Menu Dili',
        value: resolvedMenu?.language === 'EN' ? 'EN' : 'TR',
        helper: 'Varsayilan yapi',
      },
    ],
    [categories, resolvedMenu?.language],
  )

  function goTo(path: string) {
    router.push(withLocale(locale, path) as Route)
  }

  function handleDelete(id: string) {
    deleteCategory(id, {
      onSuccess: () => showToast(t('sale.category.deletedToast')),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  if (isLoadingMenu || isLoadingCategories) {
    return (
      <Box sx={{ py: 10, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!resolvedMenu) {
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
          <Typography color="text.secondary">{t('sale.menu.emptyState')}</Typography>
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
                  onClick={() => goTo(ROUTES.catalog)}
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
                  {t('sale.catalog.backToCatalog')}
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
                    <RestaurantMenuRoundedIcon />
                  </Avatar>

                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 0.5 }}>
                      {resolvedMenu.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
                      {resolvedMenu.description || t('sale.catalog.noDescription')}
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
                      <Chip
                        label={resolvedMenu.language === 'EN' ? t('sale.menu.language.en') : t('sale.menu.language.tr')}
                        sx={{
                          borderRadius: 999,
                          bgcolor: alpha(accentIndigo, 0.1),
                          color: accentIndigo,
                          fontWeight: 700,
                        }}
                      />
                      <Chip
                        label={resolvedMenu.active ? 'Aktif Menu' : 'Pasif Menu'}
                        sx={{
                          borderRadius: 999,
                          bgcolor: resolvedMenu.active ? alpha(accentMain, 0.08) : alpha(theme.palette.text.primary, 0.08),
                          color: resolvedMenu.active ? accentDeep : 'text.secondary',
                          fontWeight: 700,
                        }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} alignItems={{ sm: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => goTo(`${ROUTES.catalog}/menus/${menuId}/edit`)}
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
                  {t('sale.menu.editButton')}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => goTo(`${ROUTES.catalog}/categories/new?menuId=${menuId}`)}
                  sx={{
                    borderRadius: 999,
                    px: 2.6,
                    py: 1.2,
                    boxShadow: `0 14px 30px ${alpha(theme.palette.primary.main, 0.28)}`,
                  }}
                >
                  {t('sale.category.createButton')}
                </Button>
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
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textTransform: 'uppercase', letterSpacing: '.08em' }}
                        >
                          {metric.label}
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
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
                {t('sale.catalog.categoriesSectionTitle')}
              </Typography>
              <Typography color="text.secondary">
                Menu akisini guclendiren kategorileri tek alanda goruntuleyin ve yonetin.
              </Typography>
            </Box>

            {categories.length === 0 ? (
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
                  Kategori listesi su an bos
                </Typography>
                <Typography color="text.secondary">{t('sale.category.emptyState')}</Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
                  gap: 2,
                }}
              >
                {categories.map((category, index) => (
                  <Card
                    key={category.id}
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
                  >
                    <CardContent sx={{ position: 'relative', display: 'grid', gap: 1.5, minHeight: 270, p: 2.35 }}>
                      <Stack direction="row" justifyContent="space-between" spacing={1}>
                        <Chip
                          size="small"
                          label={`Kategori ${String(index + 1).padStart(2, '0')}`}
                          sx={{
                            alignSelf: 'flex-start',
                            borderRadius: 999,
                            bgcolor: alpha(accentMain, 0.08),
                            color: accentDeep,
                            fontWeight: 700,
                          }}
                        />
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 42,
                            height: 42,
                            borderRadius: 2.5,
                            bgcolor: alpha(accentIndigo, 0.12),
                            color: accentIndigo,
                          }}
                        >
                          <CategoryRoundedIcon fontSize="small" />
                        </Avatar>
                      </Stack>

                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.75 }}>
                          {category.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ minHeight: 48 }}>
                          {category.description || t('sale.catalog.noDescription')}
                        </Typography>
                      </Box>

                      <Chip
                        size="small"
                        label={resolvedMenu.name}
                        sx={{
                          justifySelf: 'flex-start',
                          borderRadius: 999,
                          bgcolor: alpha(accentMain, 0.08),
                          color: accentDeep,
                          fontWeight: 700,
                        }}
                      />

                      <Box sx={{ mt: 'auto' }}>
                        <Divider sx={{ mb: 1.25, opacity: 0.7 }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                          <Button
                            size="small"
                            onClick={() => goTo(`${ROUTES.catalog}/categories/${category.id}`)}
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
                            {t('sale.catalog.openMenuItemsButton')}
                          </Button>

                          <Stack direction="row" spacing={0.5}>
                            <Tooltip title={t('common.edit')}>
                              <IconButton
                                size="small"
                                onClick={() => goTo(`${ROUTES.catalog}/categories/${category.id}/edit`)}
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
                                onClick={() => handleDelete(category.id)}
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
    </Box>
  )
}
