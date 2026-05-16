'use client'

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'

import { useI18n } from '@/core/i18n/i18n-provider'
import type { Restaurant } from '../types'

interface RestaurantCardProps {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const router = useRouter()
  const { t, locale } = useI18n()

  const handleClick = () => {
    router.push(`/${locale}/restaurants/${restaurant.id}`)
  }

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Box sx={{ position: 'relative', width: '100%', pt: '56.25%' /* 16:9 Aspect Ratio */ }}>
          <CardMedia
            component="img"
            image={restaurant.imageUrl || `https://placehold.co/600x400?text=${encodeURIComponent(restaurant.name)}`}
            alt={restaurant.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <Chip
            label={restaurant.isOpen ? t('restaurants.open') : t('restaurants.closed')}
            color={restaurant.isOpen ? 'success' : 'error'}
            size="small"
            sx={{ position: 'absolute', top: 12, right: 12, fontWeight: 'bold' }}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="h3" fontWeight="bold">
              {restaurant.name}
            </Typography>
            <Chip label={`★ ${restaurant.rating}`} size="small" variant="outlined" color="primary" />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {restaurant.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {restaurant.categories.map((category) => (
              <Chip key={category} label={category} size="small" variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
