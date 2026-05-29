'use client'

import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material'

import { useI18n } from '@/core/i18n/i18n-provider'

import type { Product as MenuItem } from '../types'

interface MenuItemCardProps {
  menuItem: MenuItem
  onClick?: () => void
  onAddToCart?: (sourceRect: DOMRect) => void
}

export function MenuItemCard({ menuItem, onClick, onAddToCart }: MenuItemCardProps) {
  const { t } = useI18n()

  return (
    <Card
      elevation={0}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        height: '100%',
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        p: 1,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': onClick
          ? {
              transform: 'translateY(-3px)',
              boxShadow: 4,
            }
          : undefined,
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        sx={{
          width: { xs: '100%', sm: 118 },
          height: { xs: 132, sm: 118 },
          borderRadius: 1.5,
          objectFit: 'cover',
        }}
        image={menuItem.imageUrl || 'https://placehold.co/300x300?text=No+Image'}
        alt={menuItem.name}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: { xs: 0, sm: 1.5 }, mt: { xs: 1, sm: 0 } }}>
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ wordBreak: 'break-word' }}>
                {menuItem.name}
              </Typography>
              <Typography
                variant="subtitle1"
                color="primary.main"
                fontWeight={800}
                sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                {t('restaurants.price', { price: menuItem.price })}
              </Typography>
            </Box>

            {menuItem.description ? (
              <Typography variant="body2" color="text.secondary" sx={{ minHeight: { sm: 40 } }}>
                {menuItem.description}
              </Typography>
            ) : null}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <Chip
                size="small"
                label={menuItem.isAvailable ? t('restaurants.open') : t('restaurants.closed')}
                color={menuItem.isAvailable ? 'success' : 'default'}
                variant={menuItem.isAvailable ? 'filled' : 'outlined'}
              />

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
          </Stack>
        </CardContent>
      </Box>
    </Card>
  )
}
