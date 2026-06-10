'use client'

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import { Box, IconButton, Skeleton, Typography } from '@mui/material'
import { alpha, type SxProps, type Theme } from '@mui/material/styles'
import Image from 'next/image'
import { useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'

export type LandingImageSource = {
  alt: string
  src: string
}

export type LandingWorkflowStep = {
  description: string
  image: LandingImageSource
  number: string
  title: string
}

type ResponsiveAspectRatio = string | { xs?: string; sm?: string; md?: string; lg?: string }

type LandingImageProps = LandingImageSource & {
  aspectRatio?: ResponsiveAspectRatio
  objectFit?: 'cover' | 'contain'
  objectPosition?: string
  priority?: boolean
  sizes?: string
  sx?: SxProps<Theme>
}

export function LandingImage({
  alt,
  aspectRatio = '16/9',
  objectFit = 'cover',
  objectPosition = 'center',
  priority = false,
  sizes = '(max-width: 900px) 100vw, 50vw',
  src,
  sx,
}: LandingImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <Box
      sx={[
        {
          aspectRatio,
          backgroundColor: 'action.hover',
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      {!isLoaded && (
        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{
            height: '100%',
            inset: 0,
            position: 'absolute',
            transform: 'none',
            width: '100%',
          }}
        />
      )}
      <Image
        alt={alt}
        fill
        onLoad={() => setIsLoaded(true)}
        priority={priority}
        sizes={sizes}
        src={src}
        style={{
          objectFit,
          objectPosition,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 220ms ease',
        }}
        unoptimized
      />
    </Box>
  )
}

type LandingImageAlbumProps = {
  aspectRatio?: ResponsiveAspectRatio
  images: LandingImageSource[]
  itemSx?: SxProps<Theme>
  objectFit?: 'cover' | 'contain'
  objectPosition?: string
  priorityFirst?: boolean
  sizes?: string
  sx?: SxProps<Theme>
}

export function LandingImageAlbum({
  aspectRatio = '16/9',
  images,
  itemSx,
  objectFit = 'cover',
  objectPosition = 'center',
  priorityFirst = false,
  sizes,
  sx,
}: LandingImageAlbumProps) {
  const { t } = useI18n()
  const [activeIndex, setActiveIndex] = useState(0)

  if (images.length === 0) {
    return null
  }

  if (images.length === 1) {
    return (
      <LandingImage
        {...images[0]}
        aspectRatio={aspectRatio}
        objectFit={objectFit}
        objectPosition={objectPosition}
        priority={priorityFirst}
        sizes={sizes}
        sx={sx}
      />
    )
  }

  const goPrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1))
  }

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % images.length)
  }

  return (
    <Box
      sx={[
        {
          overflow: 'hidden',
          position: 'relative',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box
        sx={{
          display: 'flex',
          transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
          transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          width: '100%',
        }}
      >
        {images.map((image, index) => (
          <Box
            key={image.src}
            sx={{
              flex: '0 0 100%',
              minWidth: 0,
            }}
          >
            <Box
              sx={[
                {
                  width: '100%',
                },
                ...(Array.isArray(itemSx) ? itemSx : itemSx ? [itemSx] : []),
                {
                  flex: 'initial',
                },
              ]}
            >
              <LandingImage
                {...image}
                aspectRatio={aspectRatio}
                objectFit={objectFit}
                objectPosition={objectPosition}
                priority={priorityFirst && index === 0}
                sizes={sizes}
                sx={{ borderRadius: 'inherit' }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      <CarouselButton direction="left" label={t('home.previousImage')} onClick={goPrevious} />
      <CarouselButton direction="right" label={t('home.nextImage')} onClick={goNext} />

      <Box
        aria-hidden
        sx={{
          bottom: 12,
          display: 'flex',
          gap: 0.75,
          left: '50%',
          position: 'absolute',
          transform: 'translateX(-50%)',
          zIndex: 2,
        }}
      >
        {images.map((image, index) => (
          <Box
            key={`${image.src}-dot`}
            sx={{
              backgroundColor:
                index === activeIndex ? 'common.white' : 'rgba(255, 255, 255, 0.58)',
              borderRadius: 999,
              boxShadow: '0 1px 5px rgba(15, 23, 42, 0.22)',
              height: 7,
              transition: 'width 220ms ease, background-color 220ms ease',
              width: index === activeIndex ? 18 : 7,
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export function LandingWorkflowAlbum({ steps }: { steps: LandingWorkflowStep[] }) {
  const { t } = useI18n()
  const [activeIndex, setActiveIndex] = useState(0)

  if (steps.length === 0) {
    return null
  }

  const goPrevious = () => {
    setActiveIndex((current) => (current === 0 ? steps.length - 1 : current - 1))
  }

  const goNext = () => {
    setActiveIndex((current) => (current + 1) % steps.length)
  }

  return (
    <Box
      sx={{
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
          transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          width: '100%',
        }}
      >
        {steps.map((step, index) => (
          <Box key={step.title} sx={{ flex: '0 0 100%', minWidth: 0 }}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: { xs: 3, md: 4 },
                display: 'grid',
                gap: { xs: 3, md: 5 },
                gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 0.82fr) minmax(0, 1.35fr)' },
                minHeight: { md: 430 },
                overflow: 'hidden',
                p: { xs: 2.25, sm: 3, md: 4 },
                pb: { xs: 6, md: 5 },
              }}
            >
              <Box sx={{ minWidth: 0, position: 'relative', zIndex: 1 }}>
                <Typography
                  aria-hidden
                  sx={{
                    color: 'primary.main',
                    fontFamily: 'var(--font-space-grotesk), var(--font-dm-sans), sans-serif',
                    fontSize: { xs: 64, sm: 78, md: 96 },
                    fontWeight: 900,
                    lineHeight: 0.9,
                    mb: 1.5,
                    opacity: 0.28,
                  }}
                >
                  {step.number}
                </Typography>
                <Typography
                  component="h3"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '1.35rem', md: '1.65rem' },
                    mb: 1.5,
                    overflowWrap: 'anywhere',
                  }}
                >
                  {step.title}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '1.02rem', lineHeight: 1.7 }}>
                  {step.description}
                </Typography>
              </Box>

              <LandingImage
                {...step.image}
                aspectRatio="1661/1034"
                objectFit="contain"
                priority={index === 0}
                sizes="(max-width: 600px) 88vw, (max-width: 1200px) 58vw, 760px"
                sx={{
                  backgroundColor: 'background.default',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: { xs: 2.25, md: 3 },
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? `0 24px 54px ${alpha(theme.palette.common.black, 0.26)}`
                      : `0 22px 52px ${alpha(theme.palette.common.black, 0.08)}`,
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {steps.length > 1 ? (
        <>
          <CarouselButton direction="left" label={t('home.previousWorkflowStep')} onClick={goPrevious} />
          <CarouselButton direction="right" label={t('home.nextWorkflowStep')} onClick={goNext} />

          <Box
            aria-hidden
            sx={{
              bottom: 18,
              display: 'flex',
              gap: 0.75,
              left: '50%',
              position: 'absolute',
              transform: 'translateX(-50%)',
              zIndex: 2,
            }}
          >
            {steps.map((step, index) => (
              <Box
                key={`${step.title}-dot`}
                sx={{
                  backgroundColor:
                    index === activeIndex ? 'primary.main' : 'rgba(148, 163, 184, 0.62)',
                  borderRadius: 999,
                  boxShadow: '0 1px 5px rgba(15, 23, 42, 0.18)',
                  height: 7,
                  transition: 'width 220ms ease, background-color 220ms ease',
                  width: index === activeIndex ? 18 : 7,
                }}
              />
            ))}
          </Box>
        </>
      ) : null}
    </Box>
  )
}

function CarouselButton({
  direction,
  label,
  onClick,
}: {
  direction: 'left' | 'right'
  label: string
  onClick: () => void
}) {
  const Icon = direction === 'left' ? ChevronLeftRoundedIcon : ChevronRightRoundedIcon

  return (
    <IconButton
      aria-label={label}
      onClick={onClick}
      size="small"
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.82)
            : alpha(theme.palette.common.white, 0.88),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.common.white, 0.14)
            : alpha(theme.palette.common.black, 0.08),
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? `0 12px 28px ${alpha(theme.palette.common.black, 0.36)}`
            : `0 10px 28px ${alpha(theme.palette.common.black, 0.16)}`,
        color: (theme) =>
          theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
        height: { xs: 30, sm: 34, md: 38 },
        left: direction === 'left' ? { xs: 6, sm: 10, md: 14 } : 'auto',
        minHeight: 0,
        minWidth: 0,
        p: 0,
        position: 'absolute',
        right: direction === 'right' ? { xs: 6, sm: 10, md: 14 } : 'auto',
        top: '50%',
        transform: 'translateY(-50%)',
        transition: 'background-color 180ms ease, border-color 180ms ease, transform 180ms ease',
        WebkitTapHighlightColor: 'transparent',
        width: { xs: 30, sm: 34, md: 38 },
        zIndex: 2,
        '&:hover': {
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.96)
              : theme.palette.common.white,
          transform: 'translateY(-50%) scale(1.04)',
        },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: 2,
        },
        '& .MuiSvgIcon-root': {
          fontSize: { xs: 19, sm: 21, md: 23 },
        },
      }}
    >
      <Icon />
    </IconButton>
  )
}
