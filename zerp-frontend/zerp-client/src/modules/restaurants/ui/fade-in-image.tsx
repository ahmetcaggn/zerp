'use client'

import { Box, Skeleton } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { useState } from 'react'

interface FadeInImageProps {
  alt: string
  src: string
  objectFit?: 'cover' | 'contain'
  sx?: SxProps<Theme>
}

export function FadeInImage({ alt, src, objectFit = 'cover', sx }: FadeInImageProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const isLoaded = loadedSrc === src

  return (
    <Box
      sx={[
        {
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'action.hover',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {!isLoaded && (
        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transform: 'none',
          }}
        />
      )}
      <Box
        component="img"
        src={src}
        alt={alt}
        onLoad={() => setLoadedSrc(src)}
        onError={() => setLoadedSrc(null)}
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 260ms ease',
        }}
      />
    </Box>
  )
}
