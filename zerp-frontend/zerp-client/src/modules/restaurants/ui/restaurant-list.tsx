'use client'

import { useState } from 'react'
import { Grid, InputAdornment, Stack, TextField, Typography } from '@mui/material'

import { useI18n } from '@/core/i18n/i18n-provider'
import { MOCK_RESTAURANTS } from '../data/mock'
import { RestaurantCard } from './restaurant-card'

export function RestaurantList() {
  const { t } = useI18n()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRestaurants = MOCK_RESTAURANTS.filter((restaurant) =>
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
