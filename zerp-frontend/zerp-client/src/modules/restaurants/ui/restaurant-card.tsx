'use client'

import DirectionsRoundedIcon from '@mui/icons-material/DirectionsRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded'
import {
  alpha,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'

import type { CuisineCategory } from '../data/cuisine-categories'
import { cuisineCategoryLabelKey } from '../data/cuisine-categories'
import type { Restaurant } from '../types'
import { FadeInImage } from './fade-in-image'
import { ProductImagePlaceholder } from './product-image-placeholder'

function calculateCrowFlyDistanceKm(
  originLat: number,
  originLng: number,
  targetLat: number,
  targetLng: number,
): number {
  const earthRadiusKm = 6371
  const dLat = ((targetLat - originLat) * Math.PI) / 180
  const dLng = ((targetLng - originLng) * Math.PI) / 180
  const lat1 = (originLat * Math.PI) / 180
  const lat2 = (targetLat * Math.PI) / 180

  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
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

function CuisineCategoryTags({ categories }: { categories: CuisineCategory[] }) {
  const { t } = useI18n()
  const theme = useTheme()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const measureRef = useRef<HTMLDivElement | null>(null)
  const [visibleCount, setVisibleCount] = useState(categories.length)
  const [hiddenCount, setHiddenCount] = useState(0)

  const labels = useMemo(
    () => categories.map((category) => t(cuisineCategoryLabelKey(category))),
    [categories, t],
  )

  useEffect(() => {
    const container = containerRef.current
    const measure = measureRef.current
    if (!container || !measure) {
      return
    }

    const currentContainer = container
    const currentMeasure = measure

    function updateVisibleCount() {
      const availableWidth = currentContainer.clientWidth
      const gap = 6
      const categoryChipWidths = Array.from(
        currentMeasure.querySelectorAll('[data-measure-kind="category"]'),
      ).map((child) => Math.ceil(child.getBoundingClientRect().width))
      const overflowChipWidths = new Map(
        Array.from(currentMeasure.querySelectorAll('[data-measure-kind="overflow"]')).map(
          (child) => [
            Number((child as HTMLElement).dataset.remainingCount),
            Math.ceil(child.getBoundingClientRect().width),
          ],
        ),
      )
      const totalCount = categoryChipWidths.length
      const totalWidth = categoryChipWidths.reduce(
        (width, chipWidth, index) => width + chipWidth + (index > 0 ? gap : 0),
        0,
      )

      if (totalWidth <= availableWidth) {
        setVisibleCount(totalCount)
        setHiddenCount(0)
        return
      }

      const prefixWidths = categoryChipWidths.reduce<number[]>((widths, chipWidth, index) => {
        const previousWidth = widths[index - 1] ?? 0
        widths.push(previousWidth + chipWidth + (index > 0 ? gap : 0))
        return widths
      }, [])

      for (let nextVisibleCount = totalCount - 1; nextVisibleCount >= 0; nextVisibleCount -= 1) {
        const nextHiddenCount = totalCount - nextVisibleCount
        const overflowWidth = overflowChipWidths.get(nextHiddenCount)
        if (!overflowWidth) {
          continue
        }

        const visibleWidth = nextVisibleCount > 0 ? (prefixWidths[nextVisibleCount - 1] ?? 0) : 0
        const combinedWidth =
          visibleWidth + overflowWidth + (nextVisibleCount > 0 ? gap : 0)

        if (combinedWidth <= availableWidth) {
          setVisibleCount(nextVisibleCount)
          setHiddenCount(nextHiddenCount)
          return
        }
      }

      setVisibleCount(0)
      setHiddenCount(0)
    }

    updateVisibleCount()

    const resizeObserver = new ResizeObserver(updateVisibleCount)
    resizeObserver.observe(currentContainer)
    window.addEventListener('resize', updateVisibleCount)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateVisibleCount)
    }
  }, [labels])

  if (categories.length === 0) {
    return <Box aria-hidden="true" sx={{ minHeight: 24 }} />
  }

  const chipSx = {
    maxWidth: '100%',
    height: 24,
    borderRadius: '8px',
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.text.secondary,
    flexShrink: 0,
    fontSize: 12,
    fontWeight: 700,
    '& .MuiChip-label': {
      overflow: 'hidden',
      px: 1,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  } as const

  return (
    <Box sx={{ position: 'relative', minWidth: 0 }}>
      <Box
        ref={containerRef}
        sx={{
          display: 'flex',
          gap: 0.75,
          minHeight: 24,
          minWidth: 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {labels.slice(0, visibleCount).map((label) => (
          <Chip key={label} label={label} size="small" sx={chipSx} />
        ))}
        {hiddenCount > 0 && <Chip label={`+${hiddenCount}`} size="small" sx={chipSx} />}
      </Box>
      <Box
        ref={measureRef}
        aria-hidden="true"
        sx={{
          display: 'flex',
          gap: 0.75,
          height: 0,
          left: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          position: 'absolute',
          top: 0,
          visibility: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {labels.map((label) => (
          <Chip key={label} data-measure-kind="category" label={label} size="small" sx={chipSx} />
        ))}
        {labels.map((_, index) => {
          const remainingCount = index + 1
          return (
            <Chip
              key={`overflow-${remainingCount}`}
              data-measure-kind="overflow"
              data-remaining-count={remainingCount}
              label={`+${remainingCount}`}
              size="small"
              sx={chipSx}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export function RestaurantCard({ restaurant, userLocation }: RestaurantCardProps) {
  const router = useRouter()
  const { t, locale } = useI18n()
  const theme = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const primaryColor = theme.palette.primary.main

  const hasRestaurantLocation =
    typeof restaurant.latitude === 'number' && typeof restaurant.longitude === 'number'
  const hasUserLocation =
    typeof userLocation?.lat === 'number' && typeof userLocation?.lng === 'number'
  const distanceKm =
    typeof restaurant.distanceKm === 'number'
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
    const query = hasUserLocation ? `?lat=${userLocation.lat}&lng=${userLocation.lng}` : ''
    router.push(`/${locale}/restaurants/${restaurant.id}${query}`)
  }

  const handleOpenDirections = () => {
    if (!hasRestaurantLocation) {
      return
    }

    const query = new URLSearchParams({
      api: '1',
      destination: `${restaurant.latitude},${restaurant.longitude}`,
      travelmode: 'driving',
    })
    if (hasUserLocation) {
      query.set('origin', `${userLocation!.lat},${userLocation!.lng}`)
    }

    window.open(
      `https://www.google.com/maps/dir/?${query.toString()}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: '20px',
        border: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isDark
            ? `0 20px 48px ${alpha(primaryColor, 0.2)}`
            : '0 20px 48px rgba(0,0,0,0.12)',
          borderColor: alpha(primaryColor, 0.2),
        },
      }}
    >
      <CardActionArea
        onClick={handleOpenMenu}
        sx={{
          alignItems: 'stretch',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {restaurant.imageUrl ? (
            <FadeInImage src={restaurant.imageUrl} alt={restaurant.name} sx={{ height: 180 }} />
          ) : (
            <ProductImagePlaceholder sx={{ height: 180 }} />
          )}
          {/* Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)',
            }}
          />
          {/* Distance Badge */}
          {distanceKm !== null && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 14,
                left: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.25,
                py: 0.5,
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              <LocationOnRoundedIcon sx={{ fontSize: 16, color: primaryColor }} />
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#1a1a1a',
                }}
              >
                {distanceKm.toFixed(1)} km
              </Typography>
            </Box>
          )}
        </Box>

        <CardContent
          sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1.5, p: 2.5 }}
        >
          {/* Tenant Name */}
          {restaurant.tenantName && (
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {restaurant.tenantName}
            </Typography>
          )}

          <Typography
            component="h3"
            sx={{
              fontSize: { xs: 18, sm: 20 },
              fontWeight: 700,
              color: theme.palette.text.primary,
              lineHeight: 1.25,
              minWidth: 0,
            }}
          >
            {restaurant.name}
          </Typography>

          <CuisineCategoryTags categories={restaurant.cuisineCategories ?? []} />

          {/* Location */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <LocationOnRoundedIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
            <Typography
              sx={{
                fontSize: 13,
                color: theme.palette.text.secondary,
              }}
            >
              {restaurant.locationLabel || '-'}
            </Typography>
          </Box>

          {/* Description */}
          <Typography
            sx={{
              fontSize: 14,
              color: theme.palette.text.secondary,
              lineHeight: 1.5,
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: 42,
              flexGrow: 1,
            }}
          >
            {restaurant.description || '-'}
          </Typography>
        </CardContent>
      </CardActionArea>

      {/* Action Buttons */}
      <Box sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        <Stack direction="row" spacing={1.5}>
          <Button
            fullWidth
            onClick={handleOpenMenu}
            startIcon={<RestaurantMenuRoundedIcon />}
            sx={{
              py: 1.25,
              borderRadius: '14px',
              fontWeight: 600,
              fontSize: 14,
              textTransform: 'none',
              background: `linear-gradient(145deg, ${primaryColor} 0%, ${alpha(primaryColor, 0.85)} 100%)`,
              color: 'white',
              boxShadow: `0 4px 16px ${alpha(primaryColor, 0.35)}`,
              '&:hover': {
                boxShadow: `0 6px 20px ${alpha(primaryColor, 0.45)}`,
              },
            }}
          >
            {t('restaurants.openMenu')}
          </Button>
          <Button
            onClick={handleOpenDirections}
            disabled={!hasRestaurantLocation}
            sx={{
              minWidth: 52,
              borderRadius: '14px',
              border: `1px solid ${theme.palette.divider}`,
              color: theme.palette.text.secondary,
              '&:hover': {
                borderColor: alpha(primaryColor, 0.3),
                background: alpha(primaryColor, 0.08),
                color: primaryColor,
              },
              '&:disabled': {
                opacity: 0.4,
              },
            }}
          >
            <DirectionsRoundedIcon />
          </Button>
        </Stack>
      </Box>
    </Card>
  )
}
