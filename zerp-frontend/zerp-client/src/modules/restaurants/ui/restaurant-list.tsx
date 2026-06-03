'use client'

import {
  FilterAltRounded,
  LocationOnRounded,
  SearchRounded,
  StorefrontRounded,
} from '@mui/icons-material'
import {
  Alert,
  alpha,
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'

import {
  CUISINE_CATEGORIES,
  type CuisineCategory,
  cuisineCategoryLabelKey,
} from '../data/cuisine-categories'
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
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  )
}

function calculateCrowFlyDistanceKm(
  originLat: number,
  originLng: number,
  targetLat: number,
  targetLng: number,
): number {
  const dLat = ((targetLat - originLat) * Math.PI) / 180
  const dLng = ((targetLng - originLng) * Math.PI) / 180
  const lat1 = (originLat * Math.PI) / 180
  const lat2 = (targetLat * Math.PI) / 180

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c
}

function RestaurantCardSkeleton() {
  return (
    <Box
      sx={{
        height: '100%',
        borderRadius: '20px',
        bgcolor: (theme) => theme.palette.background.paper,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
      }}
    >
      <Skeleton variant="rectangular" height={180} />
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={1.5}>
          <Skeleton variant="text" width="72%" height={28} />
          <Skeleton variant="text" width="46%" height={20} />
          <Skeleton variant="text" width="58%" height={20} />
          <Skeleton variant="rounded" width="100%" height={44} sx={{ borderRadius: '12px' }} />
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
  const computedDistanceKm =
    hasUserLocation && hasShopLocation
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
    cuisineCategories: shop.cuisineCategories ?? [],
    latitude: shopLat,
    longitude: shopLng,
    distanceKm: typeof shop.distanceKm === 'number' ? shop.distanceKm : computedDistanceKm,
  }
}

export function RestaurantList() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const primaryColor = theme.palette.primary.main

  const queryLocation = useMemo(() => {
    const rawLat = searchParams.get('lat')
    const rawLng = searchParams.get('lng')

    if (!rawLat || !rawLng) {
      return null
    }

    const latitude = Number(rawLat)
    const longitude = Number(rawLng)

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return null
    }

    return { lat: latitude, lng: longitude }
  }, [searchParams])

  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('')
  const [mode, setMode] = useState<PublicShopFeedMode>(queryLocation ? 'NEARBY' : 'ALL')
  const [sortOrder, setSortOrder] = useState<PublicShopFeedOrder>('ASC')
  const [appliedSortOrder, setAppliedSortOrder] = useState<PublicShopFeedOrder>('ASC')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [appliedCity, setAppliedCity] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [appliedDistrict, setAppliedDistrict] = useState<string>('')
  const [selectedCuisineCategory, setSelectedCuisineCategory] = useState<CuisineCategory | ''>('')
  const [appliedCuisineCategory, setAppliedCuisineCategory] = useState<CuisineCategory | ''>('')
  const [isRequestingLocation, setIsRequestingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [locationAccuracyMeters, setLocationAccuracyMeters] = useState<number | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(
    queryLocation,
  )

  const effectiveUserLocation = userLocation ?? queryLocation
  const isNearbyMode = mode === 'NEARBY'

  const districtOptions = useMemo(() => getDistrictOptions(selectedCity), [selectedCity])

  const resolvedCity = useMemo(() => resolveCityName(appliedCity), [appliedCity])
  const resolvedDistrict = useMemo(
    () => resolveDistrictName(appliedCity, appliedDistrict),
    [appliedCity, appliedDistrict],
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
    q: (isNearbyMode ? searchTerm.trim() : appliedSearchTerm) || undefined,
    city: !isNearbyMode ? (resolvedCity ?? undefined) : undefined,
    state: !isNearbyMode ? (resolvedDistrict ?? undefined) : undefined,
    cuisineCategory: (isNearbyMode ? selectedCuisineCategory : appliedCuisineCategory) || undefined,
    sortBy: isNearbyMode ? 'DISTANCE' : 'NAME',
    order: isNearbyMode ? sortOrder : appliedSortOrder,
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
        setAppliedSortOrder('ASC')
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
    setAppliedSortOrder('ASC')
    if (nextMode === 'NEARBY') {
      if (!effectiveUserLocation) {
        requestUserLocation()
      }
      return
    }

    setLocationError(null)
  }

  function handleApplyFilters() {
    setAppliedSearchTerm(searchTerm.trim())
    setAppliedSortOrder(sortOrder)
    setAppliedCity(selectedCity)
    setAppliedDistrict(selectedDistrict)
    setAppliedCuisineCategory(selectedCuisineCategory)
  }

  function getSortShortLabel(value: PublicShopFeedOrder): string {
    if (isNearbyMode) {
      return value === 'ASC'
        ? t('restaurants.sortDistanceAscShort')
        : t('restaurants.sortDistanceDescShort')
    }

    return value === 'ASC' ? t('restaurants.sortNameAscShort') : t('restaurants.sortNameDescShort')
  }

  const isInitialLoading = isLoading && restaurants.length === 0

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.background.default,
        pb: 6,
      }}
    >
      <Container maxWidth="lg" sx={{ pt: { xs: 3, sm: 4 } }}>
        <Stack spacing={4}>
          {/* Header */}
          <Box>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: 28, sm: 36, md: 42 },
                fontWeight: 700,
                color: theme.palette.text.primary,
                letterSpacing: 0,
                mb: 1,
              }}
            >
              {t('restaurants.title')}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 15, sm: 16 },
                color: theme.palette.text.secondary,
                maxWidth: 480,
              }}
            >
              {t('restaurants.subtitle')}
            </Typography>
          </Box>

          {/* Mode Toggle */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: { xs: 0.75, sm: 1.5 },
              p: 0.75,
              borderRadius: '16px',
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              width: { xs: '100%', sm: 'fit-content' },
              maxWidth: '100%',
              boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            <Button
              onClick={() => handleModeChange('ALL')}
              startIcon={<StorefrontRounded />}
              sx={{
                flex: { xs: '1 1 0', sm: '0 0 auto' },
                minWidth: 0,
                px: { xs: 1, sm: 3 },
                py: { xs: 1, sm: 1.25 },
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: { xs: 12, sm: 14 },
                textTransform: 'none',
                background: !isNearbyMode
                  ? `linear-gradient(145deg, ${primaryColor} 0%, ${alpha(primaryColor, 0.85)} 100%)`
                  : 'transparent',
                color: !isNearbyMode ? 'white' : theme.palette.text.secondary,
                boxShadow: !isNearbyMode ? `0 4px 16px ${alpha(primaryColor, 0.3)}` : 'none',
                '&:hover': {
                  background: !isNearbyMode
                    ? `linear-gradient(145deg, ${primaryColor} 0%, ${alpha(primaryColor, 0.85)} 100%)`
                    : alpha(primaryColor, 0.08),
                },
                '& .MuiButton-startIcon': {
                  mr: { xs: 0.5, sm: 1 },
                  ml: 0,
                },
              }}
            >
              {t('restaurants.allRestaurants')}
            </Button>
            <Button
              onClick={() => handleModeChange('NEARBY')}
              startIcon={<LocationOnRounded />}
              disabled={isRequestingLocation}
              sx={{
                flex: { xs: '1 1 0', sm: '0 0 auto' },
                minWidth: 0,
                px: { xs: 1, sm: 3 },
                py: { xs: 1, sm: 1.25 },
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: { xs: 12, sm: 14 },
                textTransform: 'none',
                background: isNearbyMode
                  ? `linear-gradient(145deg, ${primaryColor} 0%, ${alpha(primaryColor, 0.85)} 100%)`
                  : 'transparent',
                color: isNearbyMode ? 'white' : theme.palette.text.secondary,
                boxShadow: isNearbyMode ? `0 4px 16px ${alpha(primaryColor, 0.3)}` : 'none',
                '&:hover': {
                  background: isNearbyMode
                    ? `linear-gradient(145deg, ${primaryColor} 0%, ${alpha(primaryColor, 0.85)} 100%)`
                    : alpha(primaryColor, 0.08),
                },
                '& .MuiButton-startIcon': {
                  mr: { xs: 0.5, sm: 1 },
                  ml: 0,
                },
              }}
            >
              {isRequestingLocation ? t('restaurants.locating') : t('restaurants.showNearby')}
            </Button>
          </Box>

          {locationError && (
            <Alert severity="warning" sx={{ borderRadius: '12px' }}>
              {locationError}
            </Alert>
          )}

          {/* Search & Filters */}
          <Box
            sx={{
              p: { xs: 1.25, sm: 2.5 },
              borderRadius: '20px',
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: isDark ? 'none' : '0 4px 24px rgba(0,0,0,0.04)',
            }}
          >
            <Stack spacing={{ xs: 1, sm: 2 }}>
              {/* Search Row */}
              <Stack
                direction="row"
                spacing={{ xs: 1, sm: 2 }}
                alignItems="center"
                sx={{ minWidth: 0 }}
              >
                <TextField
                  fullWidth
                  size="small"
                  variant="outlined"
                  placeholder={t('restaurants.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchRounded
                        sx={{ mr: 1, color: theme.palette.text.secondary, fontSize: 22 }}
                      />
                    ),
                  }}
                  sx={{
                    flex: '1 1 auto',
                    minWidth: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: '12px', sm: '14px' },
                      background: alpha(theme.palette.text.primary, 0.02),
                    },
                  }}
                />

                <FormControl
                  size="small"
                  sx={{
                    flex: { xs: '0 0 86px', sm: '0 0 170px', md: '0 0 200px' },
                    minWidth: 0,
                  }}
                >
                  <InputLabel id="restaurant-sort-label">{t('restaurants.sortLabel')}</InputLabel>
                  <Select
                    labelId="restaurant-sort-label"
                    value={sortOrder}
                    label={t('restaurants.sortLabel')}
                    onChange={(event) => setSortOrder(event.target.value as PublicShopFeedOrder)}
                    renderValue={(value) => getSortShortLabel(value as PublicShopFeedOrder)}
                    sx={{ borderRadius: { xs: '12px', sm: '14px' } }}
                  >
                    {isNearbyMode
                      ? [
                          <MenuItem key="nearby-asc" value="ASC">
                            {t('restaurants.sortDistanceAsc')}
                          </MenuItem>,
                          <MenuItem key="nearby-desc" value="DESC">
                            {t('restaurants.sortDistanceDesc')}
                          </MenuItem>,
                        ]
                      : [
                          <MenuItem key="name-asc" value="ASC">
                            {t('restaurants.sortNameAsc')}
                          </MenuItem>,
                          <MenuItem key="name-desc" value="DESC">
                            {t('restaurants.sortNameDesc')}
                          </MenuItem>,
                        ]}
                  </Select>
                </FormControl>

                <Autocomplete
                  options={CUISINE_CATEGORIES}
                  value={selectedCuisineCategory || null}
                  getOptionLabel={(category) => t(cuisineCategoryLabelKey(category))}
                  isOptionEqualToValue={(option, value) => option === value}
                  onChange={(_, value) => setSelectedCuisineCategory(value ?? '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('restaurants.cuisineCategoryLabel')}
                      placeholder={t('restaurants.filterAll')}
                      size="small"
                    />
                  )}
                  sx={{
                    flex: { xs: '0 0 118px', sm: '0 0 190px', md: '0 0 220px' },
                    minWidth: 0,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: { xs: '12px', sm: '14px' },
                    },
                  }}
                />
              </Stack>

              {/* City/District Filters (only in ALL mode) */}
              {!isNearbyMode && (
                <Stack
                  direction="row"
                  spacing={{ xs: 1, sm: 2 }}
                  alignItems="center"
                  sx={{ minWidth: 0 }}
                >
                  <FormControl size="small" sx={{ flex: '1 1 0', minWidth: 0 }}>
                    <InputLabel id="restaurant-city-label">{t('restaurants.cityLabel')}</InputLabel>
                    <Select
                      labelId="restaurant-city-label"
                      label={t('restaurants.cityLabel')}
                      value={selectedCity}
                      onChange={handleCityChange}
                      sx={{ borderRadius: { xs: '12px', sm: '14px' } }}
                    >
                      <MenuItem value="">
                        <em>{t('restaurants.filterAll')}</em>
                      </MenuItem>
                      {TURKEY_CITY_OPTIONS.map((city) => (
                        <MenuItem key={city} value={city}>
                          {city}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl
                    size="small"
                    sx={{ flex: '1 1 0', minWidth: 0 }}
                    disabled={!selectedCity}
                  >
                    <InputLabel id="restaurant-district-label">
                      {t('restaurants.districtLabel')}
                    </InputLabel>
                    <Select
                      labelId="restaurant-district-label"
                      label={t('restaurants.districtLabel')}
                      value={selectedDistrict}
                      onChange={(event) => setSelectedDistrict(event.target.value)}
                      sx={{ borderRadius: { xs: '12px', sm: '14px' } }}
                    >
                      <MenuItem value="">
                        <em>{t('restaurants.filterAll')}</em>
                      </MenuItem>
                      {districtOptions.map((district) => (
                        <MenuItem key={district} value={district}>
                          {district}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    onClick={handleApplyFilters}
                    startIcon={<FilterAltRounded />}
                    sx={{
                      flex: { xs: '0 0 44px', sm: '0 0 auto' },
                      minWidth: { xs: 44, sm: 116 },
                      width: { xs: 44, sm: 'auto' },
                      height: 40,
                      px: { xs: 0, sm: 2.25 },
                      borderRadius: { xs: '12px', sm: '14px' },
                      fontWeight: 700,
                      textTransform: 'none',
                      '& .MuiButton-startIcon': {
                        m: { xs: 0, sm: '0 8px 0 -4px' },
                      },
                    }}
                    aria-label={t('restaurants.applyFilters')}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                      {t('restaurants.applyFilters')}
                    </Box>
                  </Button>
                </Stack>
              )}
            </Stack>
          </Box>

          {/* Nearby Info Chip */}
          {isNearbyMode && (
            <Chip
              icon={<LocationOnRounded sx={{ fontSize: 18 }} />}
              label={t('restaurants.nearbyFiltersDisabled')}
              variant="outlined"
              sx={{
                alignSelf: 'flex-start',
                borderRadius: '10px',
                borderColor: alpha(primaryColor, 0.3),
                color: primaryColor,
                fontWeight: 500,
              }}
            />
          )}

          {/* User Location Info */}
          {isNearbyMode && effectiveUserLocation && (
            <Box
              sx={{
                p: 2,
                borderRadius: '14px',
                background: alpha(primaryColor, isDark ? 0.1 : 0.05),
                border: `1px solid ${alpha(primaryColor, 0.15)}`,
              }}
            >
              <Typography variant="body2" sx={{ color: primaryColor, fontWeight: 500 }}>
                {t('restaurants.userCoordinates', {
                  lat: effectiveUserLocation.lat.toFixed(6),
                  lng: effectiveUserLocation.lng.toFixed(6),
                })}
              </Typography>
              {typeof locationAccuracyMeters === 'number' && (
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  {t('restaurants.locationAccuracy', {
                    meters: Math.round(locationAccuracyMeters),
                  })}
                </Typography>
              )}
            </Box>
          )}

          {isError && <Typography color="error">{t('restaurants.loadFailed')}</Typography>}

          {/* Loading Skeletons */}
          {isInitialLoading && (
            <Grid container spacing={3}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
                  <RestaurantCardSkeleton />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Empty State */}
          {!isInitialLoading && restaurants.length === 0 && !isError && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 3,
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '20px',
                  background: alpha(primaryColor, isDark ? 0.1 : 0.08),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <StorefrontRounded sx={{ fontSize: 36, color: primaryColor }} />
              </Box>
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  mb: 1,
                }}
              >
                {isNearbyMode ? t('restaurants.noNearby') : t('restaurants.noResults')}
              </Typography>
              <Typography sx={{ color: theme.palette.text.secondary }}>
                {isNearbyMode ? t('restaurants.noNearby') : t('restaurants.noResults')}
              </Typography>
            </Box>
          )}

          {/* Restaurant Grid */}
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
                <Typography
                  sx={{
                    textAlign: 'center',
                    color: theme.palette.text.secondary,
                    fontSize: 14,
                    py: 2,
                  }}
                >
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
      </Container>
    </Box>
  )
}
