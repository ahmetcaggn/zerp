'use client'

import { useState } from 'react'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from '@mui/material'
import { LocationOn, Storefront } from '@mui/icons-material'
import { useRouter } from 'next/navigation'

import { useI18n } from '@/core/i18n/i18n-provider'

export function WelcomeScreen() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const [isLocating, setIsLocating] = useState(false)

  const handleUseLocation = () => {
    setIsLocating(true)
    
    // Konum bulma simülasyonu
    // Gerçekte burada navigator.geolocation.getCurrentPosition kullanılacak
    // ve dönen koordinata göre backend API'den en yakın mağaza id'si alınacak.
    setTimeout(() => {
      setIsLocating(false)
      // Şimdilik 1 numaralı mağazayı bulmuş gibi yönlendiriyoruz
      router.push(`/${locale}/restaurants/1`)
    }, 1500)
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
