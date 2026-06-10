'use client'

import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import MonitorWeightRoundedIcon from '@mui/icons-material/MonitorWeightRounded'
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
import { ProductImagePlaceholder } from './product-image-placeholder'

interface MenuItemDetailModalProps {
  open: boolean
  onClose: () => void
  menuItem: MenuItem | null
  onAddToCart?: (menuItem: MenuItem, sourceRect: DOMRect) => void
}

function buildOriginalImageUrl(imageId?: string): string | null {
  if (!imageId) {
    return null
  }
  return `/api/sale/public/images/${encodeURIComponent(imageId)}?size=ORIGINAL`
}

export function MenuItemDetailModal({ open, onClose, menuItem, onAddToCart }: MenuItemDetailModalProps) {
  const { t } = useI18n()

  if (!menuItem) return null
  const imageSrc = buildOriginalImageUrl(menuItem.imageId) ?? menuItem.imageUrl
  const hasNoImage =
    !imageSrc ||
    imageSrc.includes('placeholder') ||
    imageSrc.includes('placehold.co')

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1, fontWeight: 800 }}>
        {t('productDetail.title')}
      </DialogTitle>
      <DialogContent>
        {hasNoImage ? (
          <ProductImagePlaceholder
            sx={{
              width: '100%',
              height: { xs: 220, sm: 280 },
              borderRadius: 1.5,
              mb: 2,
            }}
          />
        ) : (
          <Box
            component="img"
            src={imageSrc}
            alt={menuItem.name}
            sx={{
              width: '100%',
              height: { xs: 220, sm: 280 },
              objectFit: 'contain',
              borderRadius: 1.5,
              mb: 2,
              bgcolor: 'background.default',
            }}
          />
        )}

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
            <Typography variant="h5" fontWeight={800}>
              {menuItem.name}
            </Typography>
            <Typography variant="h6" color="primary.main" fontWeight={800} sx={{ whiteSpace: 'nowrap' }}>
              {t('restaurants.price', { price: menuItem.price })}
            </Typography>
          </Box>

          {menuItem.description ? (
            <Typography color="text.secondary">
              {menuItem.description}
            </Typography>
          ) : null}

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<MonitorWeightRoundedIcon fontSize="small" />}
              label={menuItem.weight || t('productDetail.notAvailable')}
              variant="outlined"
            />
            <Chip
              icon={<LocalFireDepartmentRoundedIcon fontSize="small" />}
              label={menuItem.calories !== undefined && menuItem.calories !== null
                ? t('productDetail.kcal', { value: menuItem.calories })
                : t('productDetail.notAvailable')}
              variant="outlined"
            />
          </Stack>

          <Divider />

          <Box>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom>
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

          <Box>
            <Typography variant="subtitle2" fontWeight={700} color="error.main" gutterBottom>
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
          onClick={(event) => onAddToCart?.(menuItem, event.currentTarget.getBoundingClientRect())}
        >
          {t('restaurants.addToCart')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
