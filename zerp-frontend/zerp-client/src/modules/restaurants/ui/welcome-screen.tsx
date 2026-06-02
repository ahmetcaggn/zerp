'use client'

import {
  LocationOnRounded,
  StorefrontRounded,
  ChevronRightRounded,
} from '@mui/icons-material'
import {
  Alert,
  alpha,
  Box,
  Container,
  Stack,
  Typography,
  useTheme,
  CircularProgress,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'

import { getBestUserPosition } from '../utils/location-utils'

export function WelcomeScreen() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const theme = useTheme()
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(t('restaurants.locationNotSupported'))
      return
    }

    setIsLocating(true)
    setLocationError(null)

    getBestUserPosition()
      .then((position) => {
        setIsLocating(false)
        const { latitude, longitude } = position.coords
        router.push(`/${locale}/restaurants?lat=${latitude}&lng=${longitude}`)
      })
      .catch((error: GeolocationPositionError | Error) => {
        setIsLocating(false)
        const errorCode = 'code' in error ? error.code : 0
        setLocationError(
          errorCode === 1
            ? t('restaurants.locationPermissionDenied')
            : t('restaurants.locationFailed'),
        )
      })
  }

  const handleManualSelect = () => {
    router.push(`/${locale}/restaurants`)
  }

  // Theme-based colors using system primary (teal)
  const isDark = theme.palette.mode === 'dark'
  const primaryColor = theme.palette.primary.main
  const primaryLight = isDark ? alpha(primaryColor, 0.15) : alpha(primaryColor, 0.08)
  const warmBg = theme.palette.background.default
  const warmSecondary = theme.palette.text.primary
  const warmMuted = theme.palette.text.secondary
  const warmBorder = theme.palette.divider

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: warmBg,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Main Content */}
      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 3, sm: 4 },
          py: { xs: 6, sm: 8 },
        }}
      >
        {/* Hero Section */}
        <Box sx={{ mb: { xs: 5, sm: 6 } }}>
          {/* Brand Mark */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: `linear-gradient(145deg, ${primaryColor} 0%, ${alpha(primaryColor, 0.8)} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              boxShadow: `0 12px 32px ${alpha(primaryColor, 0.35)}`,
            }}
          >
            <Typography
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: 22,
                letterSpacing: '-0.5px',
              }}
            >
              Z
            </Typography>
          </Box>

          {/* Greeting */}
          <Typography
            sx={{
              fontSize: { xs: 15, sm: 16 },
              fontWeight: 500,
              color: warmMuted,
              mb: 1.5,
              letterSpacing: '0.3px',
            }}
          >
            {locale === 'tr' ? 'Merhaba' : 'Hello'}
          </Typography>

          {/* Main Title */}
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 32, sm: 40, md: 48 },
              fontWeight: 700,
              color: warmSecondary,
              lineHeight: 1.15,
              letterSpacing: '-1px',
              mb: 2,
            }}
          >
            {locale === 'tr' ? 'Ne yemek\nistersin?' : 'What would you\nlike to eat?'}
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              fontSize: { xs: 16, sm: 17 },
              color: warmMuted,
              lineHeight: 1.6,
              maxWidth: 340,
            }}
          >
            {locale === 'tr'
              ? 'Yakınındaki restoranları keşfet ve siparişini hızlıca ver.'
              : 'Discover nearby restaurants and place your order quickly.'}
          </Typography>
        </Box>

        {/* Error Alert */}
        {locationError && (
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              borderRadius: '16px',
              border: 'none',
            }}
          >
            {locationError}
          </Alert>
        )}

        {/* Action Cards */}
        <Stack spacing={2}>
          {/* Primary: Location Button */}
          <Box
            onClick={!isLocating ? handleUseLocation : undefined}
            sx={{
              p: 0,
              borderRadius: '20px',
              background: `linear-gradient(145deg, ${primaryColor} 0%, ${alpha(primaryColor, 0.85)} 100%)`,
              boxShadow: `0 16px 48px ${alpha(primaryColor, 0.4)}`,
              cursor: isLocating ? 'wait' : 'pointer',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              '&:hover': {
                transform: isLocating ? 'none' : 'translateY(-2px)',
                boxShadow: `0 20px 56px ${alpha(primaryColor, 0.5)}`,
              },
              '&:active': {
                transform: isLocating ? 'none' : 'translateY(0) scale(0.99)',
              },
            }}
          >
            <Box
              sx={{
                p: { xs: 2.5, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isLocating ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  <LocationOnRounded sx={{ fontSize: 26, color: 'white' }} />
                )}
              </Box>

              {/* Text */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 17, sm: 18 },
                    fontWeight: 600,
                    color: 'white',
                    mb: 0.25,
                  }}
                >
                  {isLocating
                    ? locale === 'tr'
                      ? 'Konum alınıyor...'
                      : 'Getting location...'
                    : locale === 'tr'
                      ? 'Konumumu Kullan'
                      : 'Use My Location'}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 13, sm: 14 },
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  {locale === 'tr'
                    ? 'En yakın restoranları bul'
                    : 'Find the nearest restaurants'}
                </Typography>
              </Box>

              {/* Arrow */}
              {!isLocating && (
                <ChevronRightRounded
                  sx={{
                    fontSize: 28,
                    color: 'rgba(255,255,255,0.8)',
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Secondary: Browse All */}
          <Box
            onClick={!isLocating ? handleManualSelect : undefined}
            sx={{
              p: 0,
              borderRadius: '20px',
              background: theme.palette.background.paper,
              border: `1px solid ${warmBorder}`,
              boxShadow: isDark ? 'none' : '0 4px 24px rgba(0,0,0,0.04)',
              cursor: isLocating ? 'not-allowed' : 'pointer',
              opacity: isLocating ? 0.5 : 1,
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              '&:hover': {
                transform: isLocating ? 'none' : 'translateY(-2px)',
                boxShadow: isDark ? `0 8px 32px ${alpha(primaryColor, 0.15)}` : '0 8px 32px rgba(0,0,0,0.08)',
                borderColor: alpha(primaryColor, 0.3),
              },
              '&:active': {
                transform: isLocating ? 'none' : 'translateY(0) scale(0.99)',
              },
            }}
          >
            <Box
              sx={{
                p: { xs: 2.5, sm: 3 },
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: '14px',
                  background: primaryLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <StorefrontRounded sx={{ fontSize: 26, color: primaryColor }} />
              </Box>

              {/* Text */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: { xs: 17, sm: 18 },
                    fontWeight: 600,
                    color: warmSecondary,
                    mb: 0.25,
                  }}
                >
                  {locale === 'tr' ? 'Tüm Restoranlar' : 'Browse All'}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 13, sm: 14 },
                    color: warmMuted,
                  }}
                >
                  {locale === 'tr'
                    ? 'Listeden seçim yap'
                    : 'Choose from the list'}
                </Typography>
              </Box>

              {/* Arrow */}
              <ChevronRightRounded
                sx={{
                  fontSize: 28,
                  color: warmMuted,
                  opacity: 0.5,
                  flexShrink: 0,
                }}
              />
            </Box>
          </Box>
        </Stack>

        {/* Bottom Hint */}
        <Box
          sx={{
            mt: { xs: 5, sm: 6 },
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              color: alpha(warmMuted, 0.6),
              letterSpacing: '0.2px',
            }}
          >
            {locale === 'tr'
              ? 'Hızlı, kolay ve lezzetli sipariş deneyimi'
              : 'Fast, easy and delicious ordering experience'}
          </Typography>
        </Box>
      </Container>

      {/* Safe Area Bottom Spacer (for mobile) */}
      <Box
        sx={{
          height: 'env(safe-area-inset-bottom, 0px)',
          background: warmBg,
        }}
      />
    </Box>
  )
}
