'use client'

import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'

import { useI18n } from '@/core/i18n/i18n-provider'

import type { Restaurant } from '../types'

function calculateCrowFlyDistanceKm(originLat: number, originLng: number, targetLat: number, targetLng: number): number {
  const earthRadiusKm = 6371
  const dLat = ((targetLat - originLat) * Math.PI) / 180
  const dLng = ((targetLng - originLng) * Math.PI) / 180
  const lat1 = (originLat * Math.PI) / 180
  const lat2 = (targetLat * Math.PI) / 180

  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

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

  const hasRestaurantLocation = typeof restaurant.latitude === 'number' && typeof restaurant.longitude === 'number'
  const hasUserLocation = typeof userLocation?.lat === 'number' && typeof userLocation?.lng === 'number'
  const distanceKm = typeof restaurant.distanceKm === 'number'
    ? restaurant.distanceKm
    : hasRestaurantLocation && hasUserLocation
      ? calculateCrowFlyDistanceKm(
          userLocation.lat,
          userLocation.lng,
          restaurant.latitude as number,
          restaurant.longitude as number,
        )
      : null

  const handleOpenMenu = () => {
    const query = hasUserLocation
      ? `?lat=${userLocation.lat}&lng=${userLocation.lng}`
      : ''
    router.push(`/${locale}/restaurants/${restaurant.id}${query}`)
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2.5,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        background: (theme) =>
          `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        transition: 'transform 200ms ease, box-shadow 200ms ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea
        onClick={handleOpenMenu}
        sx={{
          alignItems: 'stretch',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            image={restaurant.imageUrl || `https://placehold.co/900x540?text=${encodeURIComponent(restaurant.name)}`}
            alt={restaurant.name}
            sx={{ height: 198, objectFit: 'cover' }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(15,23,42,0) 35%, rgba(15,23,42,0.5) 100%)',
            }}
          />
          <Chip
            label={restaurant.isOpen ? t('restaurants.open') : t('restaurants.closed')}
            color={restaurant.isOpen ? 'success' : 'error'}
            size="small"
            sx={{ position: 'absolute', top: 14, right: 14, fontWeight: 700 }}
          />
        </Box>

        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1.25, p: 2.5 }}>
          <Stack spacing={0.9}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1.5}>
              <Stack spacing={0.4} sx={{ minWidth: 0 }}>
                {restaurant.tenantName && (
                  <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                    {restaurant.tenantName}
                  </Typography>
                )}

                <Typography variant="h6" component="h3" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                  {restaurant.name}
                </Typography>
              </Stack>

              <Chip label="-" size="small" variant="outlined" color="primary" sx={{ fontWeight: 700, flexShrink: 0 }} />
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
              {restaurant.locationLabel || '-'}
            </Typography>

            {distanceKm !== null && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary' }}>
                <LocationOnRoundedIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" sx={{ lineHeight: 1.4, fontWeight: 600 }}>
                  {distanceKm.toFixed(1)} km
                </Typography>
              </Box>
            )}

            <Typography
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                minHeight: 42,
              }}
            >
              {restaurant.description || '-'}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>

      <Box sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        <Button fullWidth variant="contained" size="small" onClick={handleOpenMenu}>
          {t('restaurants.openMenu')}
        </Button>
      </Box>
    </Card>
  )
}
