'use client'

import { useState } from 'react'
import { Grid, Stack, TextField, Typography } from '@mui/material'

import { useI18n } from '@/core/i18n/i18n-provider'
import { usePublicShops } from '../hooks/use-public-sale'
import { RestaurantCard } from './restaurant-card'
import type { Restaurant } from '../types'

function mapShopToRestaurant(shop: {
  id: string
  name: string
  tenantName?: string
  tenantId?: string
  description?: string
  address?: string
  city?: string
  country?: string
}): Restaurant {
  return {
    id: shop.id,
    name: shop.name,
    tenantName: shop.tenantName ?? shop.tenantId,
    description: shop.description || [shop.address, shop.city, shop.country].filter(Boolean).join(', ') || '—',
    imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(shop.name)}`,
    isOpen: true,
    rating: 4.5,
    categories: [],
  }
}

export function RestaurantList() {
  const { t } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')
  const { data: shops = [], isLoading, isError } = usePublicShops()

  const restaurants = shops.map(mapShopToRestaurant)

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Typography variant="h3" fontWeight="bold">
          {t('restaurants.title')}
        </Typography>
        <Typography color="text.secondary">
          {t('restaurants.subtitle')}
        </Typography>
      </Stack>

      <TextField
        fullWidth
        variant="outlined"
        placeholder={t('restaurants.searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ maxWidth: 500 }}
      />

      {isLoading && <Typography color="text.secondary">{t('common.loading')}</Typography>}
      {isError && <Typography color="error">{t('restaurants.loadFailed')}</Typography>}

      <Grid container spacing={3}>
        {filteredRestaurants.map((restaurant) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={restaurant.id}>
            <RestaurantCard restaurant={restaurant} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
