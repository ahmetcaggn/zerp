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

import type { Product as MenuItem } from '../types'

interface MenuItemDetailModalProps {
  open: boolean
  onClose: () => void
  menuItem: MenuItem | null
  onAddToCart?: (menuItem: MenuItem) => void
}

export function MenuItemDetailModal({ open, onClose, menuItem, onAddToCart }: MenuItemDetailModalProps) {
  const { t } = useI18n()

  if (!menuItem) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, fontWeight: 'bold' }}>
        {t('productDetail.title')}
      </DialogTitle>
      <DialogContent>
        {/* Ürün Görseli */}
        <Box 
          component="img"
          src={menuItem.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image'}
          alt={menuItem.name}
          sx={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 2, mb: 2 }}
        />

        <Stack spacing={2}>
          {/* Başlık ve Fiyat */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h5" fontWeight="bold">
              {menuItem.name}
            </Typography>
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              {t('restaurants.price', { price: menuItem.price })}
            </Typography>
          </Box>
          <Typography color="text.secondary">
            {menuItem.description}
          </Typography>

          <Divider />

          {/* İçindekiler */}
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              {t('productDetail.ingredients')}
            </Typography>
            {menuItem.ingredients && menuItem.ingredients.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {menuItem.ingredients.map((ingredient) => (
                  <Chip key={ingredient} label={ingredient} size="small" variant="outlined" />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('productDetail.notAvailable')}
              </Typography>
            )}
          </Box>

          {/* Gramaj ve Kalori */}
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {t('productDetail.weight')}
              </Typography>
              <Typography variant="body2" color={menuItem.weight ? undefined : 'text.secondary'}>
                {menuItem.weight || t('productDetail.notAvailable')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {t('productDetail.calories')}
              </Typography>
              {menuItem.calories !== undefined && menuItem.calories !== null ? (
                <Typography variant="body2">
                  {t('productDetail.kcal', { value: menuItem.calories })}
                </Typography>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {t('productDetail.notAvailable')}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Alerjenler */}
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" color="error.main" gutterBottom>
              {t('productDetail.allergens')}
            </Typography>
            {menuItem.allergens && menuItem.allergens.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {menuItem.allergens.map((allergen) => (
                  <Chip key={allergen} label={allergen} size="small" color="error" variant="outlined" />
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('productDetail.notAvailable')}
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose} color="inherit">
          {t('productDetail.close')}
        </Button>
        <Button
          variant="contained"
          disabled={!menuItem.isAvailable}
          onClick={() => onAddToCart?.(menuItem)}
        >
          {t('restaurants.addToCart')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
