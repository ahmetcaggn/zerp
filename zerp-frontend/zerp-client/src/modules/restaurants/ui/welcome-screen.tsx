'use client'

import {
  ArrowForward,
  ExploreOutlined,
  LocationOnOutlined,
  MyLocation,
  RestaurantOutlined,
  Storefront,
} from '@mui/icons-material'
import {
  Alert,
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
  useTheme,
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

  const isDark = theme.palette.mode === 'dark'

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        background: isDark
          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${theme.palette.background.default} 50%, ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
      }}
    >
      {/* Subtle pattern overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, isDark ? 0.15 : 0.08)} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }}
      />

      {/* Floating decoration elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 6 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip
            icon={<RestaurantOutlined sx={{ fontSize: 16 }} />}
            label="ZERP Client"
            size="small"
            sx={{
              mb: 3,
              px: 1,
              background: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 600,
              letterSpacing: 0.5,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          />

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
              background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2,
            }}
          >
            {t('welcome.title')}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: 500,
              mx: 'auto',
              fontWeight: 400,
              fontSize: { xs: '1rem', sm: '1.125rem' },
              lineHeight: 1.6,
            }}
          >
            {t('welcome.subtitle')}
          </Typography>
        </Box>

        {/* Error Alert */}
        {locationError && (
          <Alert
            severity="warning"
            sx={{
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            }}
          >
            {locationError}
          </Alert>
        )}

        {/* Cards Section */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          justifyContent="center"
          alignItems="stretch"
          sx={{ maxWidth: 900, mx: 'auto' }}
        >
          {/* Location Card */}
          <Card
            sx={{
              flex: 1,
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: isDark
                ? alpha(theme.palette.background.paper, 0.6)
                : alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: isLocating ? 'wait' : 'pointer',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
            }}
            onClick={!isLocating ? handleUseLocation : undefined}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Icon Container */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${alpha(theme.palette.primary.dark, 0.8)} 100%)`,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                {isLocating ? (
                  <CircularProgress size={36} sx={{ color: 'white' }} />
                ) : (
                  <MyLocation sx={{ fontSize: 36, color: 'white' }} />
                )}
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: theme.palette.text.primary,
                }}
              >
                {isLocating ? t('welcome.findingLocation') : t('welcome.useLocation')}
              </Typography>

              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                {t('welcome.useLocationDesc')}
              </Typography>

              <Button
                variant="contained"
                size="large"
                disabled={isLocating}
                endIcon={isLocating ? null : <LocationOnOutlined />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.25,
                  fontWeight: 600,
                  textTransform: 'none',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                  '&:hover': {
                    boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                  },
                }}
              >
                {isLocating ? t('welcome.findingLocation') : t('welcome.useLocation')}
              </Button>
            </CardContent>
          </Card>

          {/* Manual Select Card */}
          <Card
            sx={{
              flex: 1,
              borderRadius: 4,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: isDark
                ? alpha(theme.palette.background.paper, 0.6)
                : alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: isLocating ? 'not-allowed' : 'pointer',
              opacity: isLocating ? 0.6 : 1,
              '&:hover': {
                transform: isLocating ? 'none' : 'translateY(-8px)',
                boxShadow: isLocating
                  ? 'none'
                  : `0 20px 40px ${alpha(theme.palette.secondary.main, 0.15)}`,
                borderColor: isLocating ? 'transparent' : alpha(theme.palette.secondary.main, 0.3),
              },
            }}
            onClick={!isLocating ? handleManualSelect : undefined}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Icon Container */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${alpha(theme.palette.secondary.dark, 0.8)} 100%)`,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.secondary.main, 0.3)}`,
                }}
              >
                <Storefront sx={{ fontSize: 36, color: 'white' }} />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  color: theme.palette.text.primary,
                }}
              >
                {t('welcome.manualSelect')}
              </Typography>

              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                {t('welcome.manualSelectDesc')}
              </Typography>

              <Button
                variant="outlined"
                size="large"
                disabled={isLocating}
                endIcon={<ExploreOutlined />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.25,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.main,
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    background: alpha(theme.palette.secondary.main, 0.08),
                    borderColor: theme.palette.secondary.main,
                  },
                }}
              >
                {t('welcome.manualSelect')}
              </Button>
            </CardContent>
          </Card>
        </Stack>

        {/* Footer hint */}
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ color: theme.palette.text.secondary }}
          >
            <ArrowForward sx={{ fontSize: 18, opacity: 0.6 }} />
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {locale === 'tr'
                ? 'Hızlı ve kolay sipariş deneyimi'
                : 'Quick and easy ordering experience'}
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
