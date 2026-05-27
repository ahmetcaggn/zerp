'use client'

import { Alert, Box, Button, Grid, Pagination, Stack, TextField, Typography } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { useMemo, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'

import { usePublicNearbyShops, usePublicShops } from '../hooks/use-public-sale'
import type { PublicShopDto, Restaurant } from '../types'
import { getBestUserPosition } from '../utils/location-utils'
import { RestaurantCard } from './restaurant-card'

const NEARBY_PAGE_SIZE = 10
const EARTH_RADIUS_KM = 6371

function isValidCoordinatePair(lat: number | undefined, lng: number | undefined): boolean {
  return (
    typeof lat === 'number'
    && typeof lng === 'number'
    && Number.isFinite(lat)
    && Number.isFinite(lng)
    && lat >= -90
    && lat <= 90
    && lng >= -180
    && lng <= 180
  )
}

function calculateCrowFlyDistanceKm(originLat: number, originLng: number, targetLat: number, targetLng: number): number {
  const dLat = ((targetLat - originLat) * Math.PI) / 180
  const dLng = ((targetLng - originLng) * Math.PI) / 180
  const lat1 = (originLat * Math.PI) / 180
  const lat2 = (targetLat * Math.PI) / 180

  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

function mapShopToRestaurant(
  shop: PublicShopDto,
  userLocation?: { lat: number; lng: number } | null,
): Restaurant {
  const shopLat = typeof shop.latitude === 'number' ? shop.latitude : undefined
  const shopLng = typeof shop.longitude === 'number' ? shop.longitude : undefined
  const userLat = typeof userLocation?.lat === 'number' ? userLocation.lat : undefined
  const userLng = typeof userLocation?.lng === 'number' ? userLocation.lng : undefined
  const hasUserLocation = isValidCoordinatePair(userLat, userLng)
  const hasShopLocation = isValidCoordinatePair(shopLat, shopLng)
  const computedDistanceKm = hasUserLocation && hasShopLocation
    ? calculateCrowFlyDistanceKm(userLat!, userLng!, shopLat!, shopLng!)
    : undefined

  return {
    id: shop.id,
    name: shop.name,
    tenantName: shop.tenantName ?? shop.tenantId,
    description: shop.description || [shop.address, shop.city, shop.country].filter(Boolean).join(', ') || '—',
    imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(shop.name)}`,
    isOpen: true,
    rating: 4.5,
    categories: [],
    latitude: shopLat,
    longitude: shopLng,
    distanceKm: computedDistanceKm,
  }
}

export function RestaurantList() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [isRequestingLocation, setIsRequestingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationAccuracyMeters, setLocationAccuracyMeters] = useState<number | null>(null)
  const [nearbyPage, setNearbyPage] = useState(1)
  const queryLocation = useMemo(() => {
    const rawLat = searchParams.get('lat')
    const rawLng = searchParams.get('lng')

    if (!rawLat || !rawLng) {
      return null
    }

    const latitude = Number(rawLat)
    const longitude = Number(rawLng)

    if (
      !Number.isFinite(latitude)
      || !Number.isFinite(longitude)
      || latitude < -90
      || latitude > 90
      || longitude < -180
      || longitude > 180
    ) {
      return null
    }

    return { lat: latitude, lng: longitude }
  }, [searchParams])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(queryLocation)
  const effectiveUserLocation = userLocation ?? queryLocation
  const nearbyStart = (nearbyPage - 1) * NEARBY_PAGE_SIZE
  const nearbyEnd = nearbyStart + NEARBY_PAGE_SIZE

  const { data: shops = [], isLoading, isError } = usePublicShops()
  const {
    data: nearbyShopsPageResult,
    isLoading: isLoadingNearbyShops,
    isError: isNearbyShopsError,
  } = usePublicNearbyShops(effectiveUserLocation?.lat ?? null, effectiveUserLocation?.lng ?? null, {
    start: nearbyStart,
    end: nearbyEnd,
  })

  const nearbyShops = nearbyShopsPageResult?.data ?? []
  const nearbyShopsTotal = nearbyShopsPageResult?.total ?? nearbyShops.length

  const activeShops = effectiveUserLocation ? nearbyShops : shops
  const restaurants = useMemo(
    () => activeShops.map((shop) => mapShopToRestaurant(shop, effectiveUserLocation)),
    [activeShops, effectiveUserLocation],
  )

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const visibleRestaurants = effectiveUserLocation
    ? filteredRestaurants
    : filteredRestaurants.slice(nearbyStart, nearbyEnd)

  function getLocationErrorMessage(code: number): string {
    if (code === 1) {
      return t('restaurants.locationPermissionDenied')
    }
    return t('restaurants.locationFailed')
  }

  function requestUserLocation() {
    if (!navigator.geolocation) {
      setLocationError(t('restaurants.locationNotSupported'))
      return
    }

    setLocationError(null)
    setIsRequestingLocation(true)

    getBestUserPosition()
      .then((position) => {
        setNearbyPage(1)
        setLocationAccuracyMeters(position.coords.accuracy)
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setIsRequestingLocation(false)
      })
      .catch((error: GeolocationPositionError | Error) => {
        const errorCode = 'code' in error ? error.code : 0
        setLocationError(getLocationErrorMessage(errorCode))
        setIsRequestingLocation(false)
      })
  }

  function handleNearbyRestaurantsClick() {
    requestUserLocation()
  }

  const nearbyTotalPages = Math.ceil(
    (effectiveUserLocation ? nearbyShopsTotal : filteredRestaurants.length) / NEARBY_PAGE_SIZE,
  )
  const isActiveLoading = effectiveUserLocation
    ? isLoadingNearbyShops
    : isLoading
  const isActiveError = effectiveUserLocation
    ? isNearbyShopsError
    : isError

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

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Button
          variant="contained"
          onClick={handleNearbyRestaurantsClick}
          disabled={isRequestingLocation}
          sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
        >
          {isRequestingLocation ? t('restaurants.locating') : t('restaurants.showNearby')}
        </Button>
      </Stack>

      {locationError && <Alert severity="warning">{locationError}</Alert>}

      <TextField
        fullWidth
        variant="outlined"
        placeholder={t('restaurants.searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setNearbyPage(1)
        }}
        sx={{ maxWidth: 500 }}
      />

      {effectiveUserLocation && (
        <Stack spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            {t('restaurants.userCoordinates', {
              lat: effectiveUserLocation.lat.toFixed(6),
              lng: effectiveUserLocation.lng.toFixed(6),
            })}
          </Typography>
          {typeof locationAccuracyMeters === 'number' && (
            <Typography variant="caption" color="text.secondary">
              {t('restaurants.locationAccuracy', { meters: Math.round(locationAccuracyMeters) })}
            </Typography>
          )}
        </Stack>
      )}

      {isActiveLoading && <Typography color="text.secondary">{t('common.loading')}</Typography>}
      {isActiveError && <Typography color="error">{t('restaurants.loadFailed')}</Typography>}
      {effectiveUserLocation && !isLoadingNearbyShops && !isNearbyShopsError && nearbyShopsTotal === 0 && (
        <Typography color="text.secondary">{t('restaurants.noNearby')}</Typography>
      )}

      <Grid container spacing={3}>
        {visibleRestaurants.map((restaurant) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={restaurant.id}>
            <RestaurantCard restaurant={restaurant} userLocation={effectiveUserLocation} />
          </Grid>
        ))}
      </Grid>

      {nearbyTotalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
          <Pagination
            page={nearbyPage}
            count={nearbyTotalPages}
            onChange={(_, value) => setNearbyPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Stack>
  )
}
