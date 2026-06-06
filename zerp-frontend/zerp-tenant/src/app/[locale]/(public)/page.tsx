import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import PointOfSaleRoundedIcon from '@mui/icons-material/PointOfSaleRounded'
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded'
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded'
import TableRestaurantRoundedIcon from '@mui/icons-material/TableRestaurantRounded'
import { Box, Button, Chip, Container, Grid, Paper, Stack, Typography } from '@mui/material'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import type { Route } from 'next'
import { notFound, redirect } from 'next/navigation'
import type { ComponentType } from 'react'

import { getAuthSession } from '@/core/auth/server/session'
import { isLocale } from '@/core/constants/locales'
import { ROUTES, withLocale } from '@/core/constants/routes'
import { getMessages } from '@/core/i18n/messages'
import { responsivePageSx } from '@/core/theme/layout'

import { DemoRequestDialog } from './demo-request-dialog'
import {
  LandingImage,
  LandingImageAlbum,
  type LandingImageSource,
  LandingWorkflowAlbum,
  type LandingWorkflowStep,
} from './landing-media'

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
const landingImagePath = '/zerp-tenant-landing-page-images'
const playStoreUrl = 'https://play.google.com/store/apps/details?id=org.zerp.tenant'
const playStoreBadgeSrc = `${landingImagePath}/GetItOnGooglePlay_Badge_Web_color_Turkish.svg`
const demoRequestEmail = process.env.DEMO_REQUEST_EMAIL ?? 'pomocra@gmail.com'
const moduleImageFiles = [
  ['table-and-addition-tracking.webp', 'table-and-addition-tracking_1.webp'],
  ['menu-and-recipe-management_1.webp', 'menu-and-recipe-management_2.webp'],
  ['stock-management_1.webp', 'stock-management_2.webp', 'stock-management_3.webp'],
  ['payment_1.webp', 'payment_2.webp'],
  [
    'employee-and-permission-and-ticket-and-shop_1.webp',
    'employee-and-permission-and-ticket-and-shop_2.webp',
    'employee-and-permission-and-ticket-and-shop_3.webp',
    'employee-and-permission-and-ticket-and-shop_4.webp',
  ],
  ['customer-and-qr_1.webp', 'customer-and-qr_2.webp'],
] as const
const mobileImageFiles = ['mobile_1.webp', 'mobile_2.webp'] as const
const serviceFlowImageFiles = [
  'service_flow_image_1.webp',
  'service_flow_image_2.webp',
  'service_flow_image_3.webp',
  'service_flow_image_4.webp',
] as const

function imageSrc(fileName: string) {
  return `${landingImagePath}/${fileName}`
}

function landingImages(files: readonly string[], altBase: string): LandingImageSource[] {
  return files.map((fileName, index) => ({
    alt: files.length > 1 ? `${altBase} ${index + 1}` : altBase,
    src: imageSrc(fileName),
  }))
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
  images,
  title,
  tone,
}: {
  description: string
  icon: ComponentType<SvgIconProps>
  images: LandingImageSource[]
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
      <LandingImageAlbum
        images={images}
        aspectRatio="1650/1031"
        objectFit="contain"
        sizes="(max-width: 600px) 92vw, (max-width: 1200px) 46vw, 620px"
        sx={{ mb: 2.5 }}
        itemSx={{
          backgroundColor: 'background.paper',
          borderRadius: 1.5,
        }}
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
  const heroImage: LandingImageSource = {
    alt: home.mockup.ariaLabel,
    src: imageSrc('zerp-tenant-operation-panel.webp'),
  }
  const moduleImageSets = moduleImageFiles.map((files, index) =>
    landingImages(files, home.modules[index]?.title ?? home.modulesTitle),
  )
  const mobileImages = landingImages(mobileImageFiles, 'ZERP mobile app')
  const workflowSteps: LandingWorkflowStep[] = home.workflow.map((item, index) => ({
    description: item.description,
    image: {
      alt: item.title,
      src: imageSrc(serviceFlowImageFiles[index] ?? serviceFlowImageFiles[0]),
    },
    number: String(index + 1).padStart(2, '0'),
    title: item.title,
  }))

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
                <DemoRequestDialog
                  recipientEmail={demoRequestEmail}
                  texts={{
                    ...home.demoRequest,
                    cancel: messages.common.cancel,
                  }}
                  triggerLabel={home.primaryCta}
                />
                <Button
                  aria-label={home.playStoreCta}
                  href={playStoreUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  sx={{
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    border: 0,
                    borderRadius: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    lineHeight: 0,
                    minHeight: 0,
                    minWidth: 0,
                    p: 0,
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <Box
                    component="img"
                    alt=""
                    src={playStoreBadgeSrc}
                    sx={{ display: 'block', height: 40, width: 'auto' }}
                  />
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
              <LandingImage
                {...heroImage}
                aspectRatio={{ xs: '16/11', sm: '1891/1031' }}
                objectFit="contain"
                priority
                sizes="(max-width: 1200px) 100vw, 46vw"
                sx={{
                  boxShadow: '0 24px 64px rgba(0,0,0,0.1)',
                  backgroundColor: 'background.paper',
                  borderRadius: { xs: 3, md: 4 },
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
                        {home.tableFeatureBenefits.map((benefit) => (
                          <Stack key={benefit} direction="row" spacing={1.5} alignItems="center">
                            <CheckCircleRoundedIcon
                              sx={{ color: accentByTone.teal.main, fontSize: 20 }}
                            />
                            <Typography
                              sx={{ fontWeight: 600, color: 'text.secondary', lineHeight: 1.5 }}
                            >
                              {benefit}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <LandingImageAlbum
                      images={moduleImageSets[0] ?? []}
                      aspectRatio={{ xs: '4/3', sm: '16/10' }}
                      objectFit="cover"
                      sizes="(max-width: 900px) 86vw, 54vw"
                      sx={{ borderRadius: { xs: 3, md: 4 } }}
                      itemSx={{
                        borderRadius: { xs: 3, md: 4 },
                        flex: { xs: '0 0 86%', sm: '0 0 76%', md: '0 0 72%' },
                      }}
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
                        direction="row"
                        spacing={{ xs: 1.5, sm: 2.5 }}
                        sx={{
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                          mx: 'auto',
                          maxWidth: { xs: 360, sm: 460, md: 520 },
                        }}
                      >
                        {mobileImages.map((image, index) => (
                          <LandingImage
                            key={image.src}
                            {...image}
                            aspectRatio="9/16"
                            objectFit="contain"
                            sizes="(max-width: 600px) 42vw, (max-width: 900px) 220px, 240px"
                            sx={{
                              backgroundColor: 'background.paper',
                              borderRadius: { xs: 2.5, md: 3.5 },
                              boxShadow: '0 20px 48px rgba(15, 23, 42, 0.09)',
                              flex: '1 1 0',
                              minWidth: 0,
                              transform: index === 1 ? { sm: 'translateY(28px)' } : 'none',
                            }}
                          />
                        ))}
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 12, md: 5 }}>
                      <Stack spacing={3}>
                        <SectionHeading
                          eyebrow={home.mobileFeature.eyebrow}
                          title={home.mobileFeature.title}
                          description={home.mobileFeature.description}
                        />
                        <Stack spacing={2}>
                          {home.mobileFeature.benefits.map((benefit) => (
                            <Stack
                              key={benefit}
                              direction="row"
                              spacing={1.5}
                              alignItems="baseline"
                            >
                              <Box
                                sx={{
                                  backgroundColor: accentByTone.blue.main,
                                  borderRadius: '50%',
                                  flex: '0 0 auto',
                                  height: 8,
                                  transform: 'translateY(-1px)',
                                  width: 8,
                                }}
                              />
                              <Typography
                                sx={{ fontWeight: 600, color: 'text.secondary', lineHeight: 1.6 }}
                              >
                                {benefit}
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
                  <Grid key={item.title} size={{ xs: 12, md: 6 }}>
                    <FeatureCard
                      description={item.description}
                      icon={moduleIcons[index % moduleIcons.length]}
                      images={moduleImageSets[index] ?? []}
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

              <LandingWorkflowAlbum steps={workflowSteps} />
            </Stack>
          </Box>

          {/* 6. DIFFERENCES */}
          <Box
            component="section"
            sx={{
              display: 'grid',
              gap: { xs: 4, md: 6 },
              gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' },
              alignItems: 'start',
            }}
          >
            <Stack spacing={3}>
              <SectionHeading
                eyebrow={home.differenceEyebrow}
                title={home.differenceTitle}
                description={home.differenceDescription}
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
        </Stack>
      </Container>
    </Box>
  )
}
