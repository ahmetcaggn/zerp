'use client'

import { LocationOn, Storefront } from '@mui/icons-material'
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'

import { getBestUserPosition } from '../utils/location-utils'

export function WelcomeScreen() {
  const { t, locale } = useI18n()
  const router = useRouter()
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

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          {t('welcome.title')}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {t('welcome.subtitle')}
        </Typography>
      </Box>

      {locationError && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {locationError}
        </Alert>
      )}

      <Grid container spacing={4} justifyContent="center">
        {/* Konumumu Kullan Kartı */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardActionArea 
              onClick={handleUseLocation} 
              disabled={isLocating}
              sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {isLocating ? (
                <CircularProgress size={64} sx={{ mb: 2 }} />
              ) : (
                <LocationOn color="primary" sx={{ fontSize: 64, mb: 2 }} />
              )}
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {isLocating ? t('welcome.findingLocation') : t('welcome.useLocation')}
                </Typography>
                <Typography color="text.secondary">
                  {t('welcome.useLocationDesc')}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Listeden Seç Kartı */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card 
            elevation={3} 
            sx={{ 
              height: '100%', 
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}
          >
            <CardActionArea 
              onClick={handleManualSelect}
              disabled={isLocating}
              sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <Storefront color="secondary" sx={{ fontSize: 64, mb: 2 }} />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  {t('welcome.manualSelect')}
                </Typography>
                <Typography color="text.secondary">
                  {t('welcome.manualSelectDesc')}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
