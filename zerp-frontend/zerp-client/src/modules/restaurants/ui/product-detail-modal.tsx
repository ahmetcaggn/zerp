'use client'

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material'

import { useI18n } from '@/core/i18n/i18n-provider'
import type { Product } from '../types'

interface ProductDetailModalProps {
  open: boolean
  onClose: () => void
  product: Product | null
}

export function ProductDetailModal({ open, onClose, product }: ProductDetailModalProps) {
  const { t } = useI18n()

  if (!product) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, fontWeight: 'bold' }}>
        {t('productDetail.title')}
      </DialogTitle>
      <DialogContent>
        {/* Ürün Görseli */}
        <Box 
          component="img"
          src={product.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'}
          alt={product.name}
          sx={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 2, mb: 2 }}
        />

        <Stack spacing={2}>
          {/* Başlık ve Fiyat */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h5" fontWeight="bold">
              {product.name}
            </Typography>
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              {t('restaurants.price', { price: product.price })}
            </Typography>
          </Box>
          <Typography color="text.secondary">
            {product.description}
          </Typography>

          <Divider />

          {/* İçindekiler */}
          {product.ingredients && product.ingredients.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {t('productDetail.ingredients')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {product.ingredients.map((ingredient) => (
                  <Chip key={ingredient} label={ingredient} size="small" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}

          {/* Gramaj ve Kalori */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            {product.weight && (
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  {t('productDetail.weight')}
                </Typography>
                <Typography variant="body2">{product.weight}</Typography>
              </Box>
            )}
            {product.calories && (
              <Box>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  {t('productDetail.calories')}
                </Typography>
                <Typography variant="body2">
                  {t('productDetail.kcal', { value: product.calories })}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Alerjenler */}
          {product.allergens && product.allergens.length > 0 && (
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" color="error.main" gutterBottom>
                {t('productDetail.allergens')}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {product.allergens.map((allergen) => (
                  <Chip key={allergen} label={allergen} size="small" color="error" variant="outlined" />
                ))}
              </Box>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          {t('productDetail.close')}
        </Button>
        <Button variant="contained" disabled={!product.isAvailable}>
          {t('restaurants.addToCart')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
