'use client'

import { useState } from 'react'
import { Box, Button, Grid, Stack, Typography, List, ListItemButton, ListItemText, Paper } from '@mui/material'
import { useRouter } from 'next/navigation'

import { useI18n } from '@/core/i18n/i18n-provider'
import { MOCK_PRODUCTS, MOCK_RESTAURANTS } from '../data/mock'
import { ProductCard } from './product-card'
import { ProductDetailModal } from './product-detail-modal'
import type { Product } from '../types'

interface ProductListProps {
  restaurantId: string
}

export function ProductList({ restaurantId }: ProductListProps) {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const restaurant = MOCK_RESTAURANTS.find((r) => r.id === restaurantId)
  const products = MOCK_PRODUCTS[restaurantId] || []

  if (!restaurant) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography>{t('restaurants.notFound')}</Typography>
        <Button onClick={() => router.push(`/${locale}/restaurants`)} sx={{ mt: 2 }}>
          <Typography>{t('restaurants.backToRestaurants')}</Typography>
        </Button>
      </Box>
    )
  }

  // Kategorilere göre gruplama
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) acc[product.category] = []
    acc[product.category].push(product)
    return acc
  }, {} as Record<string, typeof products>)

  const scrollToCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const element = document.getElementById(`category-${categoryId}`)
    if (element) {
      // scrollMarginTop sayesinde üstten boşluklu scroll yapar
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <Stack spacing={4}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          {restaurant.name} - {t('restaurants.productsTitle')}
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
                <ListItemButton 
                  onClick={() => scrollToCategory('all')} 
                  sx={{ 
                    whiteSpace: 'nowrap', 
                    flexShrink: 0,
                    borderBottom: { xs: 0, md: 1 },
                    borderRight: { xs: 1, md: 0 },
                    borderColor: 'divider'
                  }}
                >
                  <ListItemText 
                    primary={t('restaurants.allCategories')} 
                    primaryTypographyProps={{ fontWeight: 'bold' }} 
                  />
                </ListItemButton>
                {Object.keys(productsByCategory).map((category, index, array) => (
                  <ListItemButton 
                    key={category} 
                    onClick={() => scrollToCategory(category)}
                    sx={{ 
                      whiteSpace: 'nowrap', 
                      flexShrink: 0,
                      borderBottom: { xs: 0, md: index !== array.length - 1 ? 1 : 0 },
                      borderRight: { xs: index !== array.length - 1 ? 1 : 0, md: 0 },
                      borderColor: 'divider'
                    }}
                  >
                    <ListItemText primary={category} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
        </Box>

        {/* Sağ Liste (Ürünler) */}
        <Box sx={{ flexGrow: 1, width: { xs: '100%', md: 'auto' } }}>
          <Stack spacing={4}>
            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <Box key={category} id={`category-${category}`} sx={{ scrollMarginTop: 80 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 'medium' }}>
                  {category}
                </Typography>
                <Grid container spacing={2}>
                  {categoryProducts.map((product) => (
                    <Grid size={{ xs: 6, md: 6 }} key={product.id}>
                      <ProductCard product={product} onClick={() => setSelectedProduct(product)} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}

            {products.length === 0 && (
              <Typography color="text.secondary">{t('restaurants.noProducts')}</Typography>
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
