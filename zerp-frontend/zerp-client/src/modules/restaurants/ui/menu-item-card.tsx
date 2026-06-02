'use client'

import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import { Box, Button, Card, CardContent, Typography } from '@mui/material'

import { useI18n } from '@/core/i18n/i18n-provider'

import type { Product as MenuItem } from '../types'
import { FadeInImage } from './fade-in-image'

interface MenuItemCardProps {
  menuItem: MenuItem
  onClick?: () => void
  onAddToCart?: (sourceRect: DOMRect) => void
}

export function MenuItemCard({ menuItem, onClick, onAddToCart }: MenuItemCardProps) {
  const { t } = useI18n()

  return (
    <Card
      elevation={1}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        height: '100%',
        alignItems: { xs: 'stretch', sm: 'center' },
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
      <FadeInImage
        src={menuItem.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
        alt={menuItem.name}
        objectFit="contain"
        sx={{
          width: { xs: '100%', sm: 100 },
          height: { xs: 120, sm: 100 },
          borderRadius: 2,
        }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          ml: { xs: 0, sm: 2 },
          mt: { xs: 1, sm: 0 },
        }}
      >
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
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
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {menuItem.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="small"
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
