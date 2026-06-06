'use client'
import AddIcon from '@mui/icons-material/Add'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import { Box, ButtonBase, Chip, CircularProgress, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

import { useI18n } from '@/core/i18n/i18n-provider'

import type { MenuItemResponseDto } from '../../types/sale'
import type { CartItem } from './pos-view'

interface Props {
  items: MenuItemResponseDto[]
  cart: CartItem[]
  onAdd: (item: MenuItemResponseDto) => void
  isLoading: boolean
  disabled?: boolean
}

export function ProductGrid({ items, cart, onAdd, isLoading, disabled = false }: Props) {
  const { t } = useI18n()
  function getQty(id: string): number {
    return cart
      .filter((cartItem) => cartItem.menuItemId === id)
      .reduce((sum, cartItem) => sum + cartItem.quantity, 0)
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (items.length === 0) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          bgcolor: 'background.default',
          color: 'text.secondary',
        }}
      >
        <RestaurantMenuIcon sx={{ fontSize: 64, opacity: 0.2 }} />
        <Typography variant="body1" color="text.secondary">
          {t('pos.noCategoryItems')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        p: 2,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(148px, 1fr))',
        gap: 1.5,
        alignContent: 'start',
        bgcolor: 'background.default',
      }}
    >
      {items.map((item) => {
        const qty = getQty(item.id)
        const inCart = qty > 0

        return (
          <ButtonBase
            key={item.id}
            disabled={disabled}
            onClick={() => onAdd(item)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: 3,
              border: '2px solid',
              borderColor: inCart ? 'primary.main' : 'transparent',
              bgcolor: inCart
                ? (theme) =>
                    alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.08)
                : 'background.paper',
              minHeight: 120,
              position: 'relative',
              width: '100%',
              boxShadow: inCart ? 0 : '0 1px 3px rgba(0,0,0,0.07)',
              transition: 'all 0.12s',
              '&:active': { transform: 'scale(0.96)' },
              '&:hover': disabled
                ? {}
                : {
                    borderColor: 'primary.main',
                    boxShadow: 2,
                  },
              opacity: disabled ? 0.55 : 1,
              textAlign: 'left',
            }}
          >
            {inCart && (
              <Chip
                label={qty}
                color="primary"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  height: 26,
                  minWidth: 26,
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            )}

            <Typography
              variant="body2"
              fontWeight={600}
              fontSize="0.9rem"
              lineHeight={1.35}
              sx={{ pr: inCart ? 4.5 : 0, mb: 'auto', pb: 1 }}
            >
              {item.name}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Typography
                variant="body1"
                fontWeight={800}
                fontSize="1rem"
                color={inCart ? 'primary.main' : 'text.primary'}
              >
                {item.price.toFixed(2)} ₺
              </Typography>
              {!inCart && (
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.main',
                    color: 'white',
                    flexShrink: 0,
                  }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </Box>
              )}
            </Box>
          </ButtonBase>
        )
      })}
    </Box>
  )
}
