'use client'

import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'

import { useI18n } from '@/core/i18n/i18n-provider'

import type { Product as MenuItem } from '../types'
import { FadeInImage } from './fade-in-image'
import { ProductImagePlaceholder } from './product-image-placeholder'

interface MenuItemCardProps {
  menuItem: MenuItem
  onClick?: () => void
  onAddToCart?: (sourceRect: DOMRect) => void
}

export function MenuItemCard({ menuItem, onClick, onAddToCart }: MenuItemCardProps) {
  const { t } = useI18n()
  const hasNoImage =
    !menuItem.imageUrl ||
    menuItem.imageUrl.includes('placeholder') ||
    menuItem.imageUrl.includes('placehold.co')

  return (
    <Card
      elevation={1}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        alignItems: 'stretch',
        p: 1,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick
          ? {
              transform: 'translateY(-2px)',
              boxShadow: 3,
            }
          : {},
      }}
      onClick={onClick}
    >
      {hasNoImage ? (
        <ProductImagePlaceholder
          sx={{
            width: { xs: 104, sm: 100 },
            height: { xs: 104, sm: 100 },
            borderRadius: 2,
          }}
        />
      ) : (
        <FadeInImage
          src={menuItem.imageUrl!}
          alt={menuItem.name}
          objectFit="contain"
          sx={{
            width: { xs: 104, sm: 100 },
            height: { xs: 104, sm: 100 },
            flexShrink: 0,
            borderRadius: 2,
          }}
        />
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          minWidth: 0,
          ml: { xs: 1.5, sm: 2 },
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            p: 0,
            '&:last-child': { pb: 0 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              mb: 0.5,
              gap: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" sx={{ wordBreak: 'break-word' }}>
              {menuItem.name}
            </Typography>
            <Typography
              variant="subtitle1"
              color="primary.main"
              fontWeight="bold"
              sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            >
              {t('restaurants.price', { price: menuItem.price })}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {menuItem.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddShoppingCartRoundedIcon />}
              disabled={!menuItem.isAvailable}
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart?.(e.currentTarget.getBoundingClientRect())
              }}
            >
              {t('restaurants.addToCart')}
            </Button>
          </Box>
        </CardContent>
      </Box>
    </Card>
  )
}
