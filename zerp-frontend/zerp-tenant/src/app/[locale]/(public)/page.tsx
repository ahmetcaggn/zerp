import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded'
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded'
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded'
import TableRestaurantRoundedIcon from '@mui/icons-material/TableRestaurantRounded'
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import type { Route } from 'next'
import { notFound, redirect } from 'next/navigation'
import type { ComponentType } from 'react'

import { getAuthSession } from '@/core/auth/server/session'
import { isLocale } from '@/core/constants/locales'
import { ROUTES, withLocale } from '@/core/constants/routes'
import { getMessages } from '@/core/i18n/messages'
import { responsiveLayout, responsivePageSx } from '@/core/theme/layout'

type AccentTone = 'teal' | 'blue' | 'amber' | 'rose'

const accentByTone: Record<
  AccentTone,
  { main: string; soft: string; surface: string; border: string }
> = {
  teal: {
    main: '#0f766e',
    soft: '#14b8a6',
    surface: 'rgba(20, 184, 166, 0.12)',
    border: 'rgba(20, 184, 166, 0.24)',
  },
  blue: {
    main: '#2563eb',
    soft: '#60a5fa',
    surface: 'rgba(37, 99, 235, 0.10)',
    border: 'rgba(37, 99, 235, 0.22)',
  },
  amber: {
    main: '#b45309',
    soft: '#f59e0b',
    surface: 'rgba(245, 158, 11, 0.13)',
    border: 'rgba(245, 158, 11, 0.26)',
  },
  rose: {
    main: '#be123c',
    soft: '#fb7185',
    surface: 'rgba(244, 63, 94, 0.10)',
    border: 'rgba(244, 63, 94, 0.22)',
  },
}

const moduleIcons: ComponentType<SvgIconProps>[] = [
  TableRestaurantRoundedIcon,
  RestaurantMenuRoundedIcon,
  Inventory2RoundedIcon,
  PointOfSaleRoundedIcon,
  GroupsRoundedIcon,
  QrCode2RoundedIcon,
]

const moduleTones: AccentTone[] = ['teal', 'blue', 'amber', 'rose', 'teal', 'blue']
const workflowTones: AccentTone[] = ['teal', 'blue', 'amber', 'rose']

function ImagePlaceholder({
  aspectRatio = '16/9',
  text = 'Görsel Alanı',
  sx,
  tone = 'blue',
}: {
  aspectRatio?: string | { xs?: string; sm?: string; md?: string; lg?: string }
  text?: string
  sx?: SxProps<Theme>
  tone?: AccentTone
}) {
  const accent = accentByTone[tone]
  return (
    <Box
      sx={[
        {
          width: '100%',
          aspectRatio,
          backgroundColor: accent.surface,
          border: '2px dashed',
          borderColor: accent.border,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          px: { xs: 2, sm: 3 },
          position: 'relative',
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <InsertPhotoRoundedIcon
        sx={{ fontSize: { xs: 34, sm: 42, md: 48 }, color: accent.main, mb: 1, opacity: 0.8 }}
      />
      <Typography
        variant="overline"
        sx={{
          color: accent.main,
          fontWeight: 800,
          letterSpacing: 0,
          lineHeight: 1.35,
          maxWidth: '100%',
          opacity: 0.8,
          textAlign: 'center',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
        }}
      >
        {text}
      </Typography>
    </Box>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string
  title: string
  description: string
  centered?: boolean
}) {
  return (
    <Stack
      spacing={1.25}
      sx={{
        alignItems: centered ? 'center' : 'flex-start',
        maxWidth: 760,
        mx: centered ? 'auto' : 0,
        textAlign: centered ? 'center' : 'left',
        width: '100%',
      }}
    >
      <Typography
        component="p"
        variant="overline"
        sx={{
          color: 'primary.main',
          fontWeight: 800,
          letterSpacing: 0,
          textTransform: 'uppercase',
        }}
      >
        {eyebrow}
      </Typography>
      <Typography
        component="h2"
        variant="h2"
        sx={{
          color: 'text.primary',
          fontFamily: 'var(--font-space-grotesk), var(--font-dm-sans), sans-serif',
          fontSize: { xs: '1.85rem', sm: '2.25rem', md: '2.65rem' },
          letterSpacing: 0,
          maxWidth: '100%',
          overflowWrap: 'anywhere',
        }}
      >
        {title}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ fontSize: { xs: '1rem', md: '1.08rem' }, lineHeight: 1.7 }}
      >
        {description}
      </Typography>
    </Stack>
  )
}

function FeatureCard({
  description,
  icon: Icon,
  title,
  tone,
}: {
  description: string
  icon: ComponentType<SvgIconProps>
  title: string
  tone: AccentTone
}) {
  const accent = accentByTone[tone]

  return (
    <Paper
      variant="outlined"
      sx={{
        height: '100%',
        borderRadius: 2,
        borderColor: accent.border,
        p: { xs: 2, sm: 2.5 },
        backgroundColor: 'background.paper',
        boxShadow: '0 18px 42px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 24px 48px rgba(15, 23, 42, 0.08)',
        },
      }}
    >
      <ImagePlaceholder
        text="Özellik Görseli"
        aspectRatio="16/9"
        tone={tone}
        sx={{ borderRadius: 1.5, mb: 2.5, border: 'none' }}
      />
      <Stack spacing={1.5} sx={{ flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 1.5,
              alignItems: 'center',
              backgroundColor: accent.surface,
              color: accent.main,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Icon />
          </Box>
          <Typography
            component="h3"
            variant="h6"
            sx={{ fontWeight: 800, lineHeight: 1.25, overflowWrap: 'anywhere' }}
          >
            {title}
          </Typography>
        </Stack>
        <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
          {description}
        </Typography>
      </Stack>
    </Paper>
  )
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const session = await getAuthSession()
  if (session) {
    redirect(withLocale(locale, ROUTES.dashboard) as Route)
  }

  const messages = getMessages(locale)
  const home = messages.home

  return (
    <Box id="top" component="main">
      <Container
        maxWidth="xl"
        sx={{
          ...responsivePageSx.homeContainer,
          pb: { xs: 5, md: 7 },
        }}
      >
        <Stack spacing={{ xs: 7, sm: 8, md: 11 }}>
          {/* 1. HERO SECTION */}
          <Box
            component="section"
            sx={{
              alignItems: 'center',
              display: 'grid',
              gap: { xs: 4, md: 5, lg: 6 },
              gridTemplateColumns: {
                xs: 'minmax(0, 1fr)',
                lg: 'minmax(0, 1fr) minmax(420px, 0.92fr)',
              },
              minHeight: {
                lg: 'min(760px, calc(100vh - var(--app-toolbar-height-desktop) - 72px))',
              },
              pt: { xs: 0, md: 3 },
            }}
          >
            <Stack spacing={{ xs: 3, md: 4 }} sx={{ minWidth: 0 }}>
              <Stack spacing={{ xs: 2, md: 2.5 }}>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {home.heroTags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        borderRadius: 1.5,
                        bgcolor: accentByTone.teal.surface,
                        color: 'primary.main',
                        fontWeight: 800,
                      }}
                    />
                  ))}
                </Stack>
                <Typography
                  variant="h1"
                  sx={{
                    color: 'text.primary',
                    fontFamily: 'var(--font-space-grotesk), var(--font-dm-sans), sans-serif',
                    fontSize: { xs: '2.15rem', sm: '3.1rem', md: '4rem', lg: '4.25rem' },
                    fontWeight: 800,
                    letterSpacing: 0,
                    lineHeight: 1.05,
                    maxWidth: 820,
                    overflowWrap: 'anywhere',
                  }}
                >
                  {home.title}
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '1.05rem', md: '1.25rem' },
                    lineHeight: 1.75,
                    maxWidth: 580,
                  }}
                >
                  {home.description}
                </Typography>
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                gap={2}
                sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
              >
                <Button
                  href="#demo"
                  size="large"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    minHeight: 52,
                    borderRadius: 2,
                    px: 3.5,
                    fontWeight: 800,
                    fontSize: '1rem',
                  }}
                >
                  {home.primaryCta}
                </Button>
              </Stack>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                {home.proofPoints.map((item) => (
                  <Grid key={item.value} size={{ xs: 12, sm: 4 }}>
                    <Stack>
                      <Typography sx={{ fontSize: 32, fontWeight: 900, lineHeight: 1.1 }}>
                        {item.value}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: 13, lineHeight: 1.45, fontWeight: 600 }}
                      >
                        {item.label}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Stack>

            <Box sx={{ minWidth: 0, position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 10, md: '-5%' },
                  right: { xs: 0, md: '-5%' },
                  bottom: { xs: 10, md: '-5%' },
                  left: { xs: 0, md: '5%' },
                  background: `linear-gradient(135deg, ${accentByTone.teal.surface} 0%, transparent 100%)`,
                  borderRadius: { xs: 3, md: 6 },
                  zIndex: -1,
                }}
              />
              <ImagePlaceholder
                text={home.mockup.windowTitle}
                aspectRatio={{ xs: '16/11', sm: '4/3' }}
                tone="teal"
                sx={{
                  boxShadow: '0 24px 64px rgba(0,0,0,0.1)',
                  border: 'none',
                  backgroundColor: 'background.paper',
                }}
              />
            </Box>
          </Box>

          {/* 2. LOGo STRIP / PROBLEM STRIP */}
          <Box
            component="section"
            sx={{
              borderBlock: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'action.hover',
              px: { xs: 2.5, sm: 3, md: 4 },
              py: { xs: 4, md: 5 },
            }}
          >
            <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
              {home.problemStrip.map((item, index) => {
                const accent = accentByTone[workflowTones[index % workflowTones.length]]

                return (
                  <Grid key={item.title} size={{ xs: 12, md: 4 }}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={2}
                      alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
                    >
                      <Box
                        sx={{
                          alignItems: 'center',
                          backgroundColor: accent.surface,
                          borderRadius: 2,
                          color: accent.main,
                          display: 'flex',
                          flexShrink: 0,
                          height: 48,
                          justifyContent: 'center',
                          width: 48,
                        }}
                      >
                        <CheckCircleRoundedIcon />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 900, mb: 1, fontSize: '1.1rem' }}>
                          {item.title}
                        </Typography>
                        <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {item.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                )
              })}
            </Grid>
          </Box>

          {/* 3. ALTERNATING FEATURE HIGHLIGHTS */}
          {home.modules.length > 0 && (
            <Box component="section">
              <Stack spacing={{ xs: 8, md: 12 }}>
                {/* First alternating feature */}
                <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Stack spacing={3}>
                      <SectionHeading
                        eyebrow={home.modulesEyebrow}
                        title={home.modules[0].title}
                        description={home.modules[0].description}
                      />
                      <Stack spacing={2}>
                        {[1, 2, 3].map((idx) => (
                          <Stack key={idx} direction="row" spacing={1.5} alignItems="center">
                            <CheckCircleRoundedIcon
                              sx={{ color: accentByTone.teal.main, fontSize: 20 }}
                            />
                            <Typography
                              sx={{ fontWeight: 600, color: 'text.secondary', lineHeight: 1.5 }}
                            >
                              Etkili özellik açıklaması {idx}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <ImagePlaceholder
                      text="Ürün detay görseli"
                      aspectRatio={{ xs: '4/3', sm: '16/10' }}
                      tone="teal"
                      sx={{ borderRadius: { xs: 3, md: 4 } }}
                    />
                  </Grid>
                </Grid>

                {/* Second alternating feature (reversed on desktop) */}
                {home.modules.length > 1 && (
                  <Grid
                    container
                    spacing={{ xs: 4, md: 8 }}
                    alignItems="center"
                    direction={{ xs: 'column-reverse', md: 'row' }}
                  >
                    <Grid size={{ xs: 12, md: 7 }}>
                      <Stack
                        direction={{ xs: 'row', sm: 'row' }}
                        spacing={{ xs: 1.5, sm: 2 }}
                        sx={{
                          alignItems: 'flex-start',
                          mx: 'auto',
                          maxWidth: { xs: 420, md: 'none' },
                        }}
                      >
                        <ImagePlaceholder
                          text="Mobil arayüz 1"
                          aspectRatio="9/16"
                          tone="blue"
                          sx={{ borderRadius: { xs: 3, md: 4 } }}
                        />
                        <ImagePlaceholder
                          text="Mobil arayüz 2"
                          aspectRatio="9/16"
                          tone="amber"
                          sx={{
                            borderRadius: { xs: 3, md: 4 },
                            transform: { sm: 'translateY(32px)' },
                          }}
                        />
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Stack spacing={3}>
                        <SectionHeading
                          eyebrow="Tüm Cihazlarda Kullanım"
                          title={home.modules[1].title}
                          description={home.modules[1].description}
                        />
                        <Stack spacing={2}>
                          {[1, 2].map((idx) => (
                            <Stack key={idx} direction="row" spacing={1.5}>
                              <Box
                                sx={{
                                  mt: 0.5,
                                  backgroundColor: accentByTone.blue.surface,
                                  borderRadius: '50%',
                                  p: 0.5,
                                }}
                              >
                                <ArrowForwardRoundedIcon
                                  sx={{ color: accentByTone.blue.main, fontSize: 16 }}
                                />
                              </Box>
                              <Typography
                                sx={{ fontWeight: 600, color: 'text.secondary', lineHeight: 1.6 }}
                              >
                                Kullanıcıların en çok değer verdiği detaylı fayda açıklaması alanı{' '}
                                {idx}.
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                )}
              </Stack>
            </Box>
          )}

          {/* 4. MODULES CARDS GRID */}
          <Box component="section" sx={{ py: 4 }}>
            <Stack spacing={{ xs: 4, md: 6 }}>
              <SectionHeading
                centered
                eyebrow={home.modulesEyebrow}
                title={home.modulesTitle}
                description={home.modulesDescription}
              />
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {home.modules.map((item, index) => (
                  <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <FeatureCard
                      description={item.description}
                      icon={moduleIcons[index % moduleIcons.length]}
                      title={item.title}
                      tone={moduleTones[index % moduleTones.length]}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Box>

          {/* 5. WORKFLOW SECTION with full width image space */}
          <Box
            component="section"
            sx={{
              backgroundColor: 'action.hover',
              mx: { xs: -2, sm: -3, md: -4 },
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 5, md: 10 },
              borderRadius: { xs: 0, lg: 4 },
            }}
          >
            <Stack spacing={{ xs: 4, md: 6 }}>
              <SectionHeading
                centered
                eyebrow={home.workflowEyebrow}
                title={home.workflowTitle}
                description={home.workflowDescription}
              />

              <ImagePlaceholder
                text="Servis akışı görseli"
                aspectRatio={{ xs: '4/3', sm: '16/9', md: '21/9' }}
                tone="rose"
                sx={{ borderRadius: 3, mb: { xs: 0, md: 2 } }}
              />

              <Grid container spacing={{ xs: 3, md: 4 }}>
                {home.workflow.map((item, index) => {
                  const accent = accentByTone[workflowTones[index % workflowTones.length]]

                  return (
                    <Grid key={item.title} size={{ xs: 12, md: 3 }}>
                      <Box sx={{ position: 'relative', pt: 3 }}>
                        <Typography
                          sx={{
                            color: accent.soft,
                            fontFamily:
                              'var(--font-space-grotesk), var(--font-dm-sans), sans-serif',
                            fontSize: { xs: 56, md: 80 },
                            fontWeight: 900,
                            lineHeight: 1,
                            position: 'absolute',
                            top: -20,
                            left: { xs: 0, md: -10 },
                            opacity: 0.3,
                            zIndex: 0,
                          }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </Typography>
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                          <Typography
                            component="h3"
                            sx={{ fontWeight: 900, mb: 1, fontSize: '1.15rem' }}
                          >
                            {item.title}
                          </Typography>
                          <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
                            {item.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )
                })}
              </Grid>
            </Stack>
          </Box>

          {/* 6. DIFFERENCES */}
          <Box
            component="section"
            sx={{
              display: 'grid',
              gap: { xs: 4, md: 6 },
              gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' },
              alignItems: 'center',
            }}
          >
            <Stack spacing={3}>
              <SectionHeading
                eyebrow={home.differenceEyebrow}
                title={home.differenceTitle}
                description={home.differenceDescription}
              />
              <ImagePlaceholder
                text="Karşılaştırma veya Güven Sembolü (Kare)"
                aspectRatio="1/1"
                tone="amber"
                sx={{ borderRadius: 4, display: { xs: 'none', lg: 'flex' } }}
              />
            </Stack>

            <Grid container spacing={{ xs: 2, md: 3 }}>
              {home.differences.map((item, index) => {
                const accent = accentByTone[moduleTones[index % moduleTones.length]]
                return (
                  <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: accent.border,
                        borderRadius: 2,
                        minHeight: { xs: 'auto', sm: 160 },
                        p: { xs: 2.25, sm: 3 },
                        backgroundColor: 'background.paper',
                        transition: 'border-color 0.2s',
                        '&:hover': {
                          borderColor: accent.main,
                        },
                      }}
                    >
                      <Typography
                        sx={{ color: accent.main, fontWeight: 900, mb: 1.5, fontSize: '1.1rem' }}
                      >
                        {item.title}
                      </Typography>
                      <Typography color="text.secondary" sx={{ lineHeight: 1.65 }}>
                        {item.description}
                      </Typography>
                    </Box>
                  </Grid>
                )
              })}
            </Grid>
          </Box>

          {/* 7. DEMO / CTA CTA WITH IMAGE */}
          <Box
            id="demo"
            component="section"
            sx={{
              scrollMarginTop: {
                xs: `calc(${responsiveLayout.toolbarMinHeight.xs}px + 24px)`,
                sm: `calc(${responsiveLayout.toolbarMinHeight.sm}px + 24px)`,
              },
              borderRadius: { xs: 3, md: 4 },
              border: 'none',
              backgroundColor: accentByTone.blue.main,
              color: 'common.white',
              p: { xs: 2.5, sm: 3, md: 6 },
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: { xs: '100%', md: '50%' },
                height: '100%',
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1))`,
                zIndex: 0,
              }}
            />

            <Grid
              container
              spacing={{ xs: 4, md: 6 }}
              alignItems="center"
              sx={{ position: 'relative', zIndex: 1 }}
            >
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography
                      component="p"
                      variant="overline"
                      sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 800, letterSpacing: 1 }}
                    >
                      {home.demoEyebrow}
                    </Typography>
                    <Typography
                      component="h2"
                      variant="h2"
                      sx={{
                        fontFamily: 'var(--font-space-grotesk), var(--font-dm-sans), sans-serif',
                        letterSpacing: 0,
                        fontSize: { xs: '1.85rem', sm: '2.15rem', md: '2.5rem' },
                        mt: 1,
                      }}
                    >
                      {home.demoTitle}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: { xs: '1rem', md: '1.15rem' },
                      lineHeight: 1.75,
                      color: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    {home.demoDescription}
                  </Typography>

                  <Stack spacing={2} sx={{ mt: 2 }}>
                    {home.demoSteps.map((step) => (
                      <Stack key={step} direction="row" spacing={1.5} alignItems="flex-start">
                        <CheckCircleRoundedIcon
                          sx={{ color: 'rgba(255,255,255,0.9)', mt: 0.25 }}
                          fontSize="small"
                        />
                        <Typography sx={{ lineHeight: 1.55, fontWeight: 600 }}>{step}</Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    gap={2}
                    sx={{ alignItems: { xs: 'stretch', sm: 'center' }, pt: 2 }}
                  >
                    <Button
                      href={`/${locale}/register`}
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardRoundedIcon />}
                      sx={{
                        borderRadius: 2,
                        fontWeight: 900,
                        backgroundColor: 'common.white',
                        color: accentByTone.blue.main,
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        },
                      }}
                    >
                      {home.demoRegisterCta}
                    </Button>
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <ImagePlaceholder
                  text="Demo arayüz görseli"
                  aspectRatio={{ xs: '16/10', md: '1/1' }}
                  tone="blue"
                  sx={{
                    borderRadius: { xs: 3, md: 4 },
                    border: 'none',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    '& svg, & .MuiTypography-root': {
                      color: 'white !important',
                      opacity: '1 !important',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
