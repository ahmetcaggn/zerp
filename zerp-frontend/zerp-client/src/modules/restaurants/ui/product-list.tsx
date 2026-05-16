'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Grid,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Pagination,
} from '@mui/material'
import { useRouter } from 'next/navigation'

import { useI18n } from '@/core/i18n/i18n-provider'
import { DEFAULT_PRODUCT_DETAIL_FIELDS } from '../data/defaults'
import { usePublicCategoryProducts, usePublicShopMenu, usePublicShops } from '../hooks/use-public-sale'
import { ProductCard } from './product-card'
import { ProductDetailModal } from './product-detail-modal'
import type { Product } from '../types'

interface ProductListProps {
  restaurantId: string
}

const PAGE_SIZE = 12

export function ProductList({ restaurantId }: ProductListProps) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const { data: shops = [], isLoading: isLoadingShops } = usePublicShops()
  const { data: shopMenuResponse, isLoading: isLoadingMenu, isError: isMenuError } = usePublicShopMenu(restaurantId)

  const restaurant = useMemo(
    () => shops.find((shop) => shop.id === restaurantId),
    [shops, restaurantId],
  )

  const categories = shopMenuResponse?.categories ?? []
  const activeMenu = shopMenuResponse?.activeMenu

  useEffect(() => {
    if (!categories.length) {
      setSelectedCategoryId(null)
      return
    }

    if (!selectedCategoryId || !categories.some((category) => category.id === selectedCategoryId)) {
      setSelectedCategoryId(categories[0].id)
      setPage(1)
    }
  }, [categories, selectedCategoryId])

  const productQueryParams = selectedCategoryId
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
    data: categoryProductsResponse,
    isLoading: isLoadingProducts,
    isError: isProductsError,
  } = usePublicCategoryProducts(productQueryParams)

  const selectedCategoryName =
    categories.find((category) => category.id === selectedCategoryId)?.name ?? t('restaurants.productsTitle')

  const products: Product[] = (categoryProductsResponse?.data ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    imageUrl: undefined,
    category: selectedCategoryName,
    isAvailable: product.isAvailable,
    ...DEFAULT_PRODUCT_DETAIL_FIELDS,
  }))

  const totalProducts = categoryProductsResponse?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE))

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

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 4, md: 8 } }}>
        {/* Sol Menü (Kategoriler) */}
        <Box 
          sx={{ 
            position: 'sticky', 
            top: 16, 
            zIndex: 10, 
            width: { xs: '100%', md: '25%' }, 
            flexShrink: 0,
            alignSelf: 'flex-start', // Önemli: Desktopta uzamasını engeller, böylece sticky çalışır
            bgcolor: 'background.default' // Mobilde ürünlerin üstünden geçerken arka planı şeffaf olmasın diye
          }}
        >
          <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <List 
                component="nav" 
                disablePadding
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'row', md: 'column' }, 
                  overflowX: { xs: 'auto', md: 'visible' },
                  '&::-webkit-scrollbar': { display: 'none' },
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                {categories.map((category, index, array) => (
                  <ListItemButton 
                    key={category.id} 
                    selected={category.id === selectedCategoryId}
                    onClick={() => {
                      setSelectedCategoryId(category.id)
                      setPage(1)
                    }}
                    sx={{ 
                      whiteSpace: 'nowrap', 
                      flexShrink: 0,
                      borderBottom: { xs: 0, md: index !== array.length - 1 ? 1 : 0 },
                      borderRight: { xs: index !== array.length - 1 ? 1 : 0, md: 0 },
                      borderColor: 'divider'
                    }}
                  >
                    <ListItemText primary={category.name} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
        </Box>

        {/* Sağ Liste (Ürünler) */}
        <Box sx={{ flexGrow: 1, width: { xs: '100%', md: 'auto' } }}>
          <Stack spacing={4}>
            <Box sx={{ scrollMarginTop: 80 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
                {selectedCategoryName}
              </Typography>

              {isLoadingProducts && <Typography color="text.secondary">{t('common.loading')}</Typography>}
              {isProductsError && <Typography color="error">{t('restaurants.loadFailed')}</Typography>}

              {!isLoadingProducts && !isProductsError && (
                <Grid container spacing={2}>
                  {products.map((product) => (
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

            {categories.length > 0 && !isLoadingProducts && products.length === 0 && (
              <Typography color="text.secondary">{t('restaurants.noProducts')}</Typography>
            )}

            {totalProducts > PAGE_SIZE && (
              <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                <Pagination
                  page={page}
                  count={totalPages}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </Stack>
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
