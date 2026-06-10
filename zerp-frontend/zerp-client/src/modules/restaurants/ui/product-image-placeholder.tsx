'use client'

import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import { Box, type BoxProps } from '@mui/material'

export function ProductImagePlaceholder({ sx, ...props }: BoxProps) {
  return (
    <Box
      {...props}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #2c2c2c 0%, #1e1e1e 100%)'
            : 'linear-gradient(135deg, #f5f5f7 0%, #e5e5ea 100%)',
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.600' : 'grey.400'),
        flexShrink: 0,
        ...sx,
      }}
    >
      <RestaurantRoundedIcon
        sx={{
          width: '30%',
          height: '30%',
          minWidth: '40px',
          minHeight: '40px',
          maxWidth: '96px',
          maxHeight: '96px',
        }}
      />
    </Box>
  )
}
