'use client'

import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
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
  userLocation?: {
    lat: number
    lng: number
  } | null
}

export function RestaurantCard({ restaurant, userLocation }: RestaurantCardProps) {
  const router = useRouter()
  const { t, locale } = useI18n()

  const handleClick = () => {
    router.push(`/${locale}/restaurants/${restaurant.id}`)
  }

  const hasCoordinates = typeof restaurant.latitude === 'number' && typeof restaurant.longitude === 'number'

  const handleOpenDirections = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (!hasCoordinates) {
      return
    }

    const query = new URLSearchParams({
      api: '1',
      destination: `${restaurant.latitude},${restaurant.longitude}`,
      travelmode: 'driving',
    })
    if (canBuildOriginRoute) {
      query.set('origin', `${userLocation.lat},${userLocation.lng}`)
    }
    window.open(`https://www.google.com/maps/dir/?${query.toString()}`, '_blank', 'noopener,noreferrer')
  }

  const canBuildOriginRoute = hasCoordinates && typeof userLocation?.lat === 'number' && typeof userLocation?.lng === 'number'

  const handleOpenGoogleLocationTestRoute = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (!hasCoordinates) {
      return
    }

    const query = new URLSearchParams({
      api: '1',
      destination: `${restaurant.latitude},${restaurant.longitude}`,
      travelmode: 'driving',
    })
    window.open(`https://www.google.com/maps/dir/?${query.toString()}`, '_blank', 'noopener,noreferrer')
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
          {restaurant.tenantName && (
            <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
              {restaurant.tenantName}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="h6" component="h3" fontWeight="bold">
              {restaurant.name}
            </Typography>
            <Chip label={`★ ${restaurant.rating}`} size="small" variant="outlined" color="primary" />
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {restaurant.description}
          </Typography>
          {typeof restaurant.distanceKm === 'number' && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('restaurants.crowFlyDistance', { km: restaurant.distanceKm.toFixed(2) })}
            </Typography>
          )}
          {typeof restaurant.latitude === 'number' && typeof restaurant.longitude === 'number' && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
              {t('restaurants.shopCoordinates', {
                lat: restaurant.latitude.toFixed(6),
                lng: restaurant.longitude.toFixed(6),
              })}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {restaurant.categories.map((category) => (
              <Chip key={category} label={category} size="small" variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={handleOpenDirections}
            disabled={!hasCoordinates}
          >
            {t('restaurants.getDirections')}
          </Button>
          <Button
            fullWidth
            variant="text"
            size="small"
            onClick={handleOpenGoogleLocationTestRoute}
            disabled={!hasCoordinates}
          >
            {t('restaurants.debugRoute')}
          </Button>
        </Box>
      </CardActions>
    </Card>
  )
}
