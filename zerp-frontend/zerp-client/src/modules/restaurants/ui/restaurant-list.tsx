'use client'

import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'

import {
  getDistrictOptions,
  resolveCityName,
  resolveDistrictName,
  TURKEY_CITY_OPTIONS,
} from '../data/tr-city-district-data'
import { usePublicShopsFeedInfinite } from '../hooks/use-public-sale'
import type { PublicShopDto, PublicShopFeedMode, PublicShopFeedOrder, Restaurant } from '../types'
import { getBestUserPosition } from '../utils/location-utils'
import { RestaurantCard } from './restaurant-card'

const FEED_PAGE_SIZE = 12
const EARTH_RADIUS_KM = 6371

type PublicImageSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'ORIGINAL'

function buildPublicShopImageUrl(shopId: string, size: PublicImageSize = 'MEDIUM'): string {
  return `/api/sale/public/shops/${encodeURIComponent(shopId)}/image?size=${size}`
}

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

function RestaurantCardSkeleton() {
  return (
    <Box
      sx={{
        height: '100%',
        borderRadius: 2.5,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: (theme) => theme.palette.background.paper,
        overflow: 'hidden',
      }}
    >
      <Skeleton variant="rectangular" height={198} />
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={1.25}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Skeleton variant="text" width="72%" height={28} />
              <Skeleton variant="text" width="46%" height={20} />
            </Box>
            <Skeleton variant="rounded" width={34} height={24} />
          </Box>

          <Skeleton variant="text" width="58%" height={20} />
          <Skeleton variant="text" width="42%" height={20} />
          <Skeleton variant="rounded" width="100%" height={36} />
        </Stack>
      </Box>
    </Box>
  )
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
    locationLabel: [shop.city, shop.state].filter(Boolean).join(' - ') || '—',
    description: shop.description?.trim() || '—',
    imageUrl: shop.imageId ? buildPublicShopImageUrl(shop.id, 'MEDIUM') : undefined,
    isOpen: true,
    rating: 0,
    categories: [],
    latitude: shopLat,
    longitude: shopLng,
    distanceKm: typeof shop.distanceKm === 'number' ? shop.distanceKm : computedDistanceKm,
  }
}

export function RestaurantList() {
  const { t } = useI18n()
  const searchParams = useSearchParams()

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

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [mode, setMode] = useState<PublicShopFeedMode>(queryLocation ? 'NEARBY' : 'ALL')
  const [sortOrder, setSortOrder] = useState<PublicShopFeedOrder>('ASC')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [isRequestingLocation, setIsRequestingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationAccuracyMeters, setLocationAccuracyMeters] = useState<number | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(queryLocation)

  const effectiveUserLocation = userLocation ?? queryLocation
  const isNearbyMode = mode === 'NEARBY'

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim())
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [searchTerm])

  const districtOptions = useMemo(() => getDistrictOptions(selectedCity), [selectedCity])

  const resolvedCity = useMemo(() => resolveCityName(selectedCity), [selectedCity])
  const resolvedDistrict = useMemo(
    () => resolveDistrictName(selectedCity, selectedDistrict),
    [selectedCity, selectedDistrict],
  )

  const {
    data: feedData,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = usePublicShopsFeedInfinite({
    mode,
    pageSize: FEED_PAGE_SIZE,
    q: debouncedSearchTerm || undefined,
    city: !isNearbyMode ? resolvedCity ?? undefined : undefined,
    state: !isNearbyMode ? resolvedDistrict ?? undefined : undefined,
    sortBy: isNearbyMode ? 'DISTANCE' : 'NAME',
    order: sortOrder,
    lat: isNearbyMode ? effectiveUserLocation?.lat : undefined,
    lng: isNearbyMode ? effectiveUserLocation?.lng : undefined,
  })

  const shops = useMemo(
    () => feedData?.pages.flatMap((page) => page.items) ?? [],
    [feedData?.pages],
  )

  const restaurants = useMemo(
    () => shops.map((shop) => mapShopToRestaurant(shop, effectiveUserLocation)),
    [effectiveUserLocation, shops],
  )

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return
    }

    const target = loadMoreRef.current
    if (!target) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          fetchNextPage()
        }
      },
      { rootMargin: '320px 0px' },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

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
        setLocationAccuracyMeters(position.coords.accuracy)
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setMode('NEARBY')
        setSortOrder('ASC')
        setIsRequestingLocation(false)
      })
      .catch((error: GeolocationPositionError | Error) => {
        const errorCode = 'code' in error ? error.code : 0
        setLocationError(getLocationErrorMessage(errorCode))
        setIsRequestingLocation(false)
      })
  }

  function handleCityChange(event: SelectChangeEvent<string>) {
    const city = event.target.value
    setSelectedCity(city)
    const nextDistrictOptions = getDistrictOptions(city)
    if (!nextDistrictOptions.includes(selectedDistrict)) {
      setSelectedDistrict('')
    }
  }

  function handleModeChange(nextMode: PublicShopFeedMode) {
    setMode(nextMode)
    setSortOrder('ASC')
    if (nextMode === 'NEARBY') {
      if (!effectiveUserLocation) {
        requestUserLocation()
      }
      return
    }

    setLocationError(null)
  }

  const isInitialLoading = isLoading && restaurants.length === 0

  return (
    <Stack spacing={3.5}>
      <Stack spacing={1.2}>
        <Typography variant="h3" fontWeight={800}>
          {t('restaurants.title')}
        </Typography>
        <Typography color="text.secondary">
          {t('restaurants.subtitle')}
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{
          p: 1,
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: (theme) => theme.palette.background.paper,
          width: 'fit-content',
          maxWidth: '100%',
        }}
      >
        <Button
          variant={!isNearbyMode ? 'contained' : 'outlined'}
          onClick={() => handleModeChange('ALL')}
          sx={{ minWidth: 180 }}
        >
          {t('restaurants.allRestaurants')}
        </Button>
        <Button
          variant={isNearbyMode ? 'contained' : 'outlined'}
          onClick={() => handleModeChange('NEARBY')}
          disabled={isRequestingLocation}
          sx={{ minWidth: 180 }}
        >
          {isRequestingLocation ? t('restaurants.locating') : t('restaurants.showNearby')}
        </Button>
      </Stack>

      {locationError && <Alert severity="warning">{locationError}</Alert>}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', md: 'center' }}
        sx={{
          p: { xs: 1.5, sm: 2 },
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: (theme) => theme.palette.background.paper,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('restaurants.searchPlaceholder')}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <FormControl sx={{ minWidth: { xs: '100%', md: 220 } }}>
          <InputLabel id="restaurant-sort-label">{t('restaurants.sortLabel')}</InputLabel>
          <Select
            labelId="restaurant-sort-label"
            value={sortOrder}
            label={t('restaurants.sortLabel')}
            onChange={(event) => setSortOrder(event.target.value as PublicShopFeedOrder)}
          >
            {isNearbyMode ? (
              [
                <MenuItem key="nearby-asc" value="ASC">{t('restaurants.sortDistanceAsc')}</MenuItem>,
                <MenuItem key="nearby-desc" value="DESC">{t('restaurants.sortDistanceDesc')}</MenuItem>,
              ]
            ) : (
              [
                <MenuItem key="name-asc" value="ASC">{t('restaurants.sortNameAsc')}</MenuItem>,
                <MenuItem key="name-desc" value="DESC">{t('restaurants.sortNameDesc')}</MenuItem>,
              ]
            )}
          </Select>
        </FormControl>
      </Stack>

      {!isNearbyMode ? (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
          <FormControl sx={{ minWidth: { xs: '100%', md: 220 } }}>
            <InputLabel id="restaurant-city-label">{t('restaurants.cityLabel')}</InputLabel>
            <Select
              labelId="restaurant-city-label"
              label={t('restaurants.cityLabel')}
              value={selectedCity}
              onChange={handleCityChange}
            >
              <MenuItem value="">
                <em>{t('restaurants.filterAll')}</em>
              </MenuItem>
              {TURKEY_CITY_OPTIONS.map((city) => (
                <MenuItem key={city} value={city}>{city}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: { xs: '100%', md: 220 } }} disabled={!selectedCity}>
            <InputLabel id="restaurant-district-label">{t('restaurants.districtLabel')}</InputLabel>
            <Select
              labelId="restaurant-district-label"
              label={t('restaurants.districtLabel')}
              value={selectedDistrict}
              onChange={(event) => setSelectedDistrict(event.target.value)}
            >
              <MenuItem value="">
                <em>{t('restaurants.filterAll')}</em>
              </MenuItem>
              {districtOptions.map((district) => (
                <MenuItem key={district} value={district}>{district}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      ) : (
        <Chip
          color="info"
          variant="outlined"
          label={t('restaurants.nearbyFiltersDisabled')}
          sx={{ alignSelf: 'flex-start' }}
        />
      )}

      {isNearbyMode && effectiveUserLocation && (
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

      {isError && <Typography color="error">{t('restaurants.loadFailed')}</Typography>}

      {isInitialLoading && (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Skeleton variant="rounded" height={380} />
            </Grid>
          ))}
        </Grid>
      )}

      {!isInitialLoading && restaurants.length === 0 && !isError && (
        <Typography color="text.secondary">
          {isNearbyMode ? t('restaurants.noNearby') : t('restaurants.noResults')}
        </Typography>
      )}

      {!isInitialLoading && restaurants.length > 0 && (
        <>
          <Grid container spacing={3}>
            {restaurants.map((restaurant) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} userLocation={effectiveUserLocation} />
              </Grid>
            ))}
          </Grid>

          <Box ref={loadMoreRef} sx={{ py: 0.5 }} aria-hidden />

          {isFetchingNextPage && (
                <Grid container spacing={3}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
                      <RestaurantCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
          )}

          {!hasNextPage && !isFetchingNextPage && (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {t('restaurants.endOfResults')}
            </Typography>
          )}
        </>
      )}

      {isFetching && !isFetchingNextPage && restaurants.length > 0 && (
        <Typography variant="caption" color="text.secondary" textAlign="center">
          {t('common.loading')}
        </Typography>
      )}
    </Stack>
  )
}
