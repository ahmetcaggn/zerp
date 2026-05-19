'use client'

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material'

import { useI18n } from '@/core/i18n/i18n-provider'

import type { Product as MenuItem } from '../types'

interface MenuItemCardProps {
  menuItem: MenuItem
  onClick?: () => void
  onAddToCart?: () => void
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
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        } : {},
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        sx={{ 
          width: { xs: '100%', sm: 100 }, 
          height: { xs: 120, sm: 100 }, 
          borderRadius: 1, 
          objectFit: 'contain' 
        }}
        image={menuItem.imageUrl || 'https://via.placeholder.com/150?text=No+Image'}
        alt={menuItem.name}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, gap: 1 }}>
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
                e.stopPropagation(); // prevent card click
                onAddToCart?.()
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
