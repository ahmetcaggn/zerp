'use client'

import { useEffect, useMemo, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Pagination,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'

import { queryKeys } from '@/core/api/query-keys'
import { useI18n } from '@/core/i18n/i18n-provider'
import { getPublicCategoryMenuItems } from '../api/public-sale-client'
import { DEFAULT_PRODUCT_DETAIL_FIELDS } from '../data/defaults'
import { usePublicCategoryMenuItems, usePublicShopMenu, usePublicShops } from '../hooks/use-public-sale'
import { ProductCard } from './product-card'
import { ProductDetailModal } from './product-detail-modal'
import type { Product } from '../types'

interface ProductListProps {
  restaurantId: string
}

const PAGE_SIZE = 12
const PREVIEW_LIMIT = 4
const ALL_CATEGORY_ID = '__all__'

export function ProductList({ restaurantId }: ProductListProps) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const { data: shops = [], isLoading: isLoadingShops } = usePublicShops()
  const {
    data: shopMenuResponse,
    isLoading: isLoadingMenu,
    isError: isMenuError,
  } = usePublicShopMenu(restaurantId)

  const restaurant = useMemo(
    () => shops.find((shop) => shop.id === restaurantId),
    [shops, restaurantId],
  )

  const categories = useMemo(
    () => shopMenuResponse?.categories ?? [],
    [shopMenuResponse?.categories],
  )
  const activeMenu = shopMenuResponse?.activeMenu

  const categoryTabs = useMemo(
    () => [
      { id: ALL_CATEGORY_ID, name: t('restaurants.allCategories') },
      ...categories.map((category) => ({ id: category.id, name: category.name })),
    ],
    [categories, t],
  )

  useEffect(() => {
    if (!categories.length) {
      setSelectedCategoryId(null)
      return
    }

    const selectedStillExists = categoryTabs.some((category) => category.id === selectedCategoryId)
    if (!selectedCategoryId || !selectedStillExists) {
      setSelectedCategoryId(ALL_CATEGORY_ID)
      setPage(1)
    }
  }, [categories, categoryTabs, selectedCategoryId])

  const isDiscoveryMode = selectedCategoryId === ALL_CATEGORY_ID
  const selectedCategoryName =
    categoryTabs.find((category) => category.id === selectedCategoryId)?.name ??
    t('restaurants.productsTitle')

  const detailProductQueryParams = selectedCategoryId && !isDiscoveryMode
    ? {
        shopId: restaurantId,
        categoryId: selectedCategoryId,
        start: (page - 1) * PAGE_SIZE,
        end: page * PAGE_SIZE,
        sort: 'name' as const,
        order: 'ASC' as const,
      }
    : null

  const {
    data: detailProductsResponse,
    isLoading: isLoadingDetailProducts,
    isError: isDetailProductsError,
  } = usePublicCategoryMenuItems(detailProductQueryParams)

  const discoveryPreviewQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: [
        ...queryKeys.client.restaurants.products,
        'preview',
        restaurantId,
        category.id,
        PREVIEW_LIMIT,
      ],
      queryFn: () =>
        getPublicCategoryMenuItems({
          shopId: restaurantId,
          categoryId: category.id,
          start: 0,
          end: PREVIEW_LIMIT,
          sort: 'name',
          order: 'ASC',
        }),
      enabled: isDiscoveryMode,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    })),
  })

  const isLoadingDiscoveryProducts =
    isDiscoveryMode && discoveryPreviewQueries.some((query) => query.isLoading)
  const hasDiscoveryError =
    isDiscoveryMode && discoveryPreviewQueries.some((query) => query.isError)

  function mapToProduct(publicMenuItem: {
    id: string
    name: string
    description?: string
    price: number
    isAvailable: boolean
  }, categoryName: string): Product {
    return {
      id: publicMenuItem.id,
      name: publicMenuItem.name,
      description: publicMenuItem.description,
      price: Number(publicMenuItem.price),
      imageUrl: undefined,
      category: categoryName,
      isAvailable: publicMenuItem.isAvailable,
      ...DEFAULT_PRODUCT_DETAIL_FIELDS,
    }
  }

  const detailProducts: Product[] = (detailProductsResponse?.data ?? []).map((product) =>
    mapToProduct(product, selectedCategoryName),
  )

  const detailTotalProducts = detailProductsResponse?.total ?? 0
  const detailTotalPages = Math.max(1, Math.ceil(detailTotalProducts / PAGE_SIZE))

  if (!restaurant && !isLoadingShops) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography>{t('restaurants.notFound')}</Typography>
        <Button onClick={() => router.push(`/${locale}/restaurants`)} sx={{ mt: 2 }}>
          <Typography>{t('restaurants.backToRestaurants')}</Typography>
        </Button>
      </Box>
    )
  }

  if (isLoadingShops || isLoadingMenu) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="text.secondary">{t('common.loading')}</Typography>
      </Box>
    )
  }

  if (isMenuError) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="error">{t('restaurants.loadFailed')}</Typography>
      </Box>
    )
  }

  if (!activeMenu) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight="bold">
          {restaurant?.name}
        </Typography>
        <Typography color="text.secondary">
          {shopMenuResponse?.message || t('restaurants.activeMenuMissing')}
        </Typography>
        <Button variant="outlined" onClick={() => router.push(`/${locale}/restaurants`)}>
          {t('restaurants.changeStore')}
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={4}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {restaurant?.name ?? t('restaurants.title')} - {t('restaurants.productsTitle')}
        </Typography>
        <Button variant="outlined" color="primary" onClick={() => router.push(`/${locale}/restaurants`)}>
          {t('restaurants.changeStore')}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            position: 'sticky',
            top: 16,
            zIndex: 10,
            width: { xs: '100%', md: 270 },
            flexShrink: 0,
            alignSelf: 'flex-start',
            bgcolor: 'background.default',
          }}
        >
          <Paper elevation={0} sx={{ borderRadius: 1.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
            <Box
              component="nav"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                gap: 1,
                p: 1.5,
                overflowX: { xs: 'auto', md: 'hidden' },
                overflowY: { xs: 'hidden', md: 'auto' },
                maxHeight: { md: '68vh' },
                '&::-webkit-scrollbar': { width: { md: 8 }, height: { xs: 0, md: 8 } },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: (theme) => theme.palette.action.hover,
                  borderRadius: 999,
                },
              }}
            >
              {categoryTabs.map((category) => {
                const selected = category.id === selectedCategoryId
                return (
                  <Chip
                    key={category.id}
                    label={category.name}
                    clickable
                    variant={selected ? 'filled' : 'outlined'}
                    color={selected ? 'primary' : 'default'}
                    onClick={() => {
                      setSelectedCategoryId(category.id)
                      setPage(1)
                    }}
                    sx={{
                      justifyContent: 'flex-start',
                      width: { xs: 'auto', md: '100%' },
                      borderRadius: 999,
                      px: 0.5,
                      py: 0.25,
                      fontWeight: selected ? 700 : 500,
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                      '& .MuiChip-label': {
                        px: 1.2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: { xs: 180, md: '100%' },
                      },
                    }}
                  />
                )
              })}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flexGrow: 1, width: { xs: '100%', md: 'auto' } }}>
          {isDiscoveryMode ? (
            <Stack spacing={3}>
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 0.75 }}>
                  {t('restaurants.discoveryTitle')}
                </Typography>
                <Typography color="text.secondary">
                  {t('restaurants.discoverySubtitle')}
                </Typography>
              </Box>

              {isLoadingDiscoveryProducts && <LinearProgress />}
              {hasDiscoveryError && (
                <Typography color="error">{t('restaurants.loadFailed')}</Typography>
              )}

              {!isLoadingDiscoveryProducts && !hasDiscoveryError && (
                <Stack spacing={2.5}>
                  {categories.map((category, index) => {
                    const previewQuery = discoveryPreviewQueries[index]
                    const previewProducts = (previewQuery.data?.data ?? []).map((product) =>
                      mapToProduct(product, category.name),
                    )

                    return (
                      <Paper
                        key={category.id}
                        elevation={0}
                        sx={{
                          p: { xs: 2, md: 2.5 },
                          borderRadius: 1.5,
                          border: (theme) => `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 1,
                            mb: 1.5,
                          }}
                        >
                          <Typography variant="h6" fontWeight={700}>
                            {category.name}
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedCategoryId(category.id)
                              setPage(1)
                            }}
                          >
                            {t('restaurants.seeAllCategory')}
                          </Button>
                        </Box>

                        <Divider sx={{ mb: 1.75 }} />

                        {previewQuery.isLoading && (
                          <Typography color="text.secondary">{t('common.loading')}</Typography>
                        )}
                        {previewQuery.isError && (
                          <Typography color="error">{t('restaurants.loadFailed')}</Typography>
                        )}

                        {!previewQuery.isLoading && !previewQuery.isError && (
                          <>
                            {previewProducts.length > 0 ? (
                              <Grid container spacing={2}>
                                {previewProducts.map((product) => (
                                  <Grid size={{ xs: 12, sm: 6, lg: 6 }} key={product.id}>
                                    <ProductCard
                                      product={product}
                                      onClick={() => setSelectedProduct(product)}
                                    />
                                  </Grid>
                                ))}
                              </Grid>
                            ) : (
                              <Typography color="text.secondary">
                                {t('restaurants.previewEmpty')}
                              </Typography>
                            )}
                          </>
                        )}
                      </Paper>
                    )
                  })}
                </Stack>
              )}
            </Stack>
          ) : (
            <Stack spacing={4}>
              <Box sx={{ scrollMarginTop: 80 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                  {selectedCategoryName}
                </Typography>

                {isLoadingDetailProducts && <Typography color="text.secondary">{t('common.loading')}</Typography>}
                {isDetailProductsError && <Typography color="error">{t('restaurants.loadFailed')}</Typography>}

                {!isLoadingDetailProducts && !isDetailProductsError && (
                  <Grid container spacing={2}>
                    {detailProducts.map((product) => (
                      <Grid size={{ xs: 6, md: 6 }} key={product.id}>
                        <ProductCard product={product} onClick={() => setSelectedProduct(product)} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>

              {categories.length === 0 && (
                <Typography color="text.secondary">{t('restaurants.noCategories')}</Typography>
              )}

              {categories.length > 0 && !isLoadingDetailProducts && detailProducts.length === 0 && (
                <Typography color="text.secondary">{t('restaurants.noProducts')}</Typography>
              )}

              {detailTotalProducts > PAGE_SIZE && (
                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                  <Pagination
                    page={page}
                    count={detailTotalPages}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                  />
                </Box>
              )}
            </Stack>
          )}
        </Box>
      </Box>

      <ProductDetailModal
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </Stack>
  )
}
