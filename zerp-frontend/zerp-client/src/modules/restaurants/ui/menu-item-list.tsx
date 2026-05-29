'use client'

import AddIcon from '@mui/icons-material/Add'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  IconButton,
  LinearProgress,
  Pagination,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useQueries } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'react-qr-code'

import { queryKeys } from '@/core/api/query-keys'
import { useI18n } from '@/core/i18n/i18n-provider'

import { getPublicCategoryMenuItems } from '../api/public-sale-client'
import { useCreatePublicCartOrder, usePublicCategoryMenuItems, usePublicShopMenu, usePublicShops } from '../hooks/use-public-sale'
import type { MenuLanguage, Product as MenuItem, PublicMenuItemDto } from '../types'
import {
  addItemToCart,
  buildCartOrderPayload,
  type CartItemState,
  updateCartItemQuantity,
} from '../utils/cart-utils'
import { MenuItemCard } from './menu-item-card'
import { MenuItemDetailModal } from './menu-item-detail-modal'

interface MenuItemListProps {
  restaurantId: string
}

const PAGE_SIZE = 12
const PREVIEW_LIMIT = 4
const ALL_CATEGORY_ID = '__all__'
const MENU_IMAGE_FALLBACK_URL = 'https://placehold.co/400'
const SHOP_IMAGE_FALLBACK_URL = 'https://placehold.co/1400x600?text=Store'

type PublicImageSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'ORIGINAL'

function buildPublicMenuItemImageUrl(imageId: string, size: PublicImageSize = 'SMALL'): string {
  const encodedImageId = encodeURIComponent(imageId)
  return `/api/sale/public/images/${encodedImageId}?size=${size}`
}

function buildPublicShopImageUrl(shopId: string, size: PublicImageSize = 'LARGE'): string {
  return `/api/sale/public/shops/${encodeURIComponent(shopId)}/image?size=${size}`
}

function ensureWebsiteUrl(value: string): string {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value
  }

  return `https://${value}`
}

function isValidCoordinatePair(lat: number | null | undefined, lng: number | null | undefined): boolean {
  return (
    typeof lat === 'number'
    && typeof lng === 'number'
    && Number.isFinite(lat)
    && Number.isFinite(lng)
    && lat >= -90
    && lat <= 90
    && lng >= -180
    && lng <= 180
  )
}

function calculateCrowFlyDistanceKm(originLat: number, originLng: number, targetLat: number, targetLng: number): number {
  const earthRadiusKm = 6371
  const dLat = ((targetLat - originLat) * Math.PI) / 180
  const dLng = ((targetLng - originLng) * Math.PI) / 180
  const lat1 = (originLat * Math.PI) / 180
  const lat2 = (targetLat * Math.PI) / 180

  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

export function MenuItemList({ restaurantId }: MenuItemListProps) {
  const { t, locale } = useI18n()
  const requestedMenuLanguage: MenuLanguage = locale === 'tr' ? 'TR' : 'EN'
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(ALL_CATEGORY_ID)
  const [page, setPage] = useState(1)

  const [cartItems, setCartItems] = useState<CartItemState[]>([])
  const [cartOrderNote, setCartOrderNote] = useState('')
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [isLeafletUnavailable, setIsLeafletUnavailable] = useState(false)
  const [qrOrderCode, setQrOrderCode] = useState<string | null>(null)
  const [cartError, setCartError] = useState<string | null>(null)
  const [isCartCountPulsing, setIsCartCountPulsing] = useState(false)
  const cartButtonRef = useRef<HTMLButtonElement | null>(null)
  const cartPulseTimeoutRef = useRef<number | null>(null)
  const aboutMapContainerRef = useRef<HTMLDivElement | null>(null)
  const aboutMapRef = useRef<any>(null)

  const { data: shops = [], isLoading: isLoadingShops } = usePublicShops()
  const {
    data: shopMenuResponse,
    isLoading: isLoadingMenu,
    isError: isMenuError,
  } = usePublicShopMenu(restaurantId, requestedMenuLanguage)

  const createPublicCartOrderMutation = useCreatePublicCartOrder()

  const restaurant = useMemo(
    () => shops.find((shop) => shop.id === restaurantId),
    [shops, restaurantId],
  )
  const hasCoordinates = typeof restaurant?.latitude === 'number' && typeof restaurant?.longitude === 'number'
  const tenantValue = restaurant?.tenantName ?? restaurant?.tenantId
  const queryLocation = useMemo(() => {
    const rawLat = searchParams.get('lat')
    const rawLng = searchParams.get('lng')

    if (!rawLat || !rawLng) {
      return null
    }

    const latitude = Number(rawLat)
    const longitude = Number(rawLng)

    if (!isValidCoordinatePair(latitude, longitude)) {
      return null
    }

    return { lat: latitude, lng: longitude }
  }, [searchParams])
  const distanceValue = useMemo(() => {
    if (!hasCoordinates || !queryLocation) {
      return null
    }

    const latitude = restaurant?.latitude
    const longitude = restaurant?.longitude

    if (!isValidCoordinatePair(latitude, longitude)) {
      return null
    }

    return `${calculateCrowFlyDistanceKm(queryLocation.lat, queryLocation.lng, latitude as number, longitude as number).toFixed(1)} km`
  }, [hasCoordinates, queryLocation, restaurant?.latitude, restaurant?.longitude])

  const categories = useMemo(
    () => shopMenuResponse?.categories ?? [],
    [shopMenuResponse?.categories],
  )
  const activeMenu = shopMenuResponse?.activeMenu

  const categoryTabs = useMemo(
    () => [
      { id: ALL_CATEGORY_ID, name: t('restaurants.allCategories') },
      ...categories.map((category) => ({ id: category.id, name: category.name })),
    ],
    [categories, t],
  )

  useEffect(() => {
    return () => {
      if (cartPulseTimeoutRef.current !== null) {
        window.clearTimeout(cartPulseTimeoutRef.current)
      }
    }
  }, [])

  function cleanupAboutMap() {
    if (aboutMapRef.current) {
      aboutMapRef.current.remove()
      aboutMapRef.current = null
    }
  }

  async function initializeAboutMap() {
    if (!hasCoordinates || !aboutMapContainerRef.current || !restaurant) {
      return
    }

    cleanupAboutMap()

    try {
      const leaflet = await import('leaflet')
      if (!aboutMapContainerRef.current) {
        return
      }

      const map = leaflet.map(aboutMapContainerRef.current, {
        zoomControl: false,
        attributionControl: true,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
      }).setView([restaurant.latitude as number, restaurant.longitude as number], 15)

      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)

      const markerIcon = leaflet.divIcon({
        className: 'shop-location-marker',
        html: '<div style="width:18px;height:18px;border-radius:999px;background:#e11d48;border:3px solid #ffffff;box-shadow:0 2px 10px rgba(0,0,0,0.22);"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      })

      leaflet.marker([restaurant.latitude as number, restaurant.longitude as number], { icon: markerIcon }).addTo(map)
      aboutMapRef.current = map
      setIsLeafletUnavailable(false)

      window.setTimeout(() => {
        map.invalidateSize()
      }, 120)
    } catch {
      cleanupAboutMap()
      setIsLeafletUnavailable(true)
    }
  }

  const isDiscoveryMode = selectedCategoryId === ALL_CATEGORY_ID
  const selectedCategoryName =
    categoryTabs.find((category) => category.id === selectedCategoryId)?.name ??
    t('restaurants.productsTitle')

  const detailMenuItemQueryParams = !isDiscoveryMode
    ? {
        shopId: restaurantId,
        categoryId: selectedCategoryId,
        language: requestedMenuLanguage,
        start: (page - 1) * PAGE_SIZE,
        end: page * PAGE_SIZE,
        sort: 'name' as const,
        order: 'ASC' as const,
      }
    : null

  const {
    data: detailMenuItemsResponse,
    isLoading: isLoadingDetailMenuItems,
    isError: isDetailMenuItemsError,
  } = usePublicCategoryMenuItems(detailMenuItemQueryParams)

  const discoveryPreviewQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: [
        ...queryKeys.client.restaurants.products,
        'preview',
        restaurantId,
        requestedMenuLanguage,
        category.id,
        PREVIEW_LIMIT,
      ],
      queryFn: () =>
        getPublicCategoryMenuItems({
          shopId: restaurantId,
          categoryId: category.id,
          language: requestedMenuLanguage,
          start: 0,
          end: PREVIEW_LIMIT,
          sort: 'name',
          order: 'ASC',
        }),
      enabled: isDiscoveryMode,
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    })),
  })

  const isLoadingDiscoveryMenuItems =
    isDiscoveryMode && discoveryPreviewQueries.some((query) => query.isLoading)
  const hasDiscoveryError =
    isDiscoveryMode && discoveryPreviewQueries.some((query) => query.isError)

  const totalCartItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )

  const shopHeroImage = useMemo(() => {
    if (restaurant?.imageId) {
      return buildPublicShopImageUrl(restaurant.id, 'LARGE')
    }

    return SHOP_IMAGE_FALLBACK_URL
  }, [restaurant])

  const shopDescription = useMemo(() => {
    const value = restaurant?.description?.trim()
    if (value) {
      return value
    }

    const addressValue = [restaurant?.address, restaurant?.city, restaurant?.country]
      .filter((item): item is string => Boolean(item && item.trim()))
      .join(', ')

    return addressValue || t('restaurants.storeInfoFallback')
  }, [restaurant, t])

  const shopAddressLine = useMemo(() => {
    const fullAddress = [restaurant?.address, restaurant?.city, restaurant?.state, restaurant?.country, restaurant?.postalCode]
      .filter((item): item is string => Boolean(item && item.trim()))
      .join(', ')

    return fullAddress || t('restaurants.storeInfoUnavailable')
  }, [restaurant, t])

  const ratingValue = t('restaurants.ratingUnknown')
  const statusValue = t('restaurants.statusUnknown')
  const restaurantLabel = tenantValue || t('restaurants.storeInfoFallback')

  const aboutMapLinks = useMemo(() => {
    if (!hasCoordinates || !restaurant) {
      return null
    }

    const lat = restaurant.latitude as number
    const lng = restaurant.longitude as number
    const delta = 0.01
    const bbox = `${lng - delta}%2C${lat - delta}%2C${lng + delta}%2C${lat + delta}`
    return {
      embed: `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`,
      open: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`,
    }
  }, [hasCoordinates, restaurant])

  const detailRows = useMemo(
    () =>
      [
        { label: t('restaurants.ratingLabel'), value: ratingValue },
        { label: t('restaurants.statusLabel'), value: statusValue },
        { label: t('restaurants.detailTenant'), value: restaurant?.tenantName || restaurant?.tenantId || '-' },
        { label: t('restaurants.detailDescription'), value: restaurant?.description || '-' },
        { label: t('restaurants.detailAddress'), value: shopAddressLine || '-' },
        { label: t('restaurants.detailPhone'), value: restaurant?.phone || '-' },
        { label: t('restaurants.detailEmail'), value: restaurant?.email || '-' },
        { label: t('restaurants.detailWebsite'), value: restaurant?.website || '-' },
        { label: t('restaurants.detailMenuName'), value: activeMenu?.name || '-' },
        { label: t('restaurants.detailMenuLanguage'), value: activeMenu?.language || '-' },
        { label: t('restaurants.detailCategoryCount'), value: String(categories.length) },
        {
          label: t('restaurants.detailCoordinates'),
          value: hasCoordinates ? `${restaurant!.latitude!.toFixed(6)}, ${restaurant!.longitude!.toFixed(6)}` : '-',
        },
      ] as const,
    [
      activeMenu?.language,
      activeMenu?.name,
      categories.length,
      hasCoordinates,
      ratingValue,
      restaurant,
      shopAddressLine,
      statusValue,
      t,
    ],
  )

  useEffect(() => () => cleanupAboutMap(), [])

  function handleOpenAboutModal() {
    setIsLeafletUnavailable(false)
    setIsAboutModalOpen(true)
  }

  function handleCloseAboutModal() {
    setIsAboutModalOpen(false)
    cleanupAboutMap()
  }

  function handleAboutDialogEntered() {
    void initializeAboutMap()
  }

  function handleAboutDialogExit() {
    cleanupAboutMap()
  }

  function mapToMenuItem(publicMenuItem: PublicMenuItemDto, categoryName: string): MenuItem {
    const imageUrl = publicMenuItem.imageId
      ? buildPublicMenuItemImageUrl(publicMenuItem.imageId, 'SMALL')
      : MENU_IMAGE_FALLBACK_URL

    return {
      id: publicMenuItem.id,
      name: publicMenuItem.name,
      description: publicMenuItem.description,
      price: Number(publicMenuItem.price),
      imageId: publicMenuItem.imageId,
      imageUrl,
      category: categoryName,
      isAvailable: publicMenuItem.isAvailable ?? publicMenuItem.available ?? true,
      ingredients: publicMenuItem.ingredients,
      calories: publicMenuItem.calories ?? undefined,
      weight: publicMenuItem.weight ?? undefined,
      allergens: publicMenuItem.allergens,
    }
  }

  function triggerCartCountPulse() {
    setIsCartCountPulsing(false)
    requestAnimationFrame(() => {
      setIsCartCountPulsing(true)
    })

    if (cartPulseTimeoutRef.current !== null) {
      window.clearTimeout(cartPulseTimeoutRef.current)
    }
    cartPulseTimeoutRef.current = window.setTimeout(() => {
      setIsCartCountPulsing(false)
    }, 280)
  }

  function triggerFlyToCartAnimation(menuItem: MenuItem, sourceRect?: DOMRect) {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const cartButtonRect = cartButtonRef.current?.getBoundingClientRect()
    const startCenterX = sourceRect ? sourceRect.left + sourceRect.width / 2 : window.innerWidth / 2
    const startCenterY = sourceRect ? sourceRect.top + sourceRect.height / 2 : window.innerHeight / 2
    const endCenterX = cartButtonRect ? cartButtonRect.left + cartButtonRect.width / 2 : window.innerWidth - 40
    const endCenterY = cartButtonRect ? cartButtonRect.top + cartButtonRect.height / 2 : 40
    const size = Math.max(40, Math.min(72, sourceRect?.height ?? 56))

    const flyingNode = document.createElement('div')
    flyingNode.setAttribute('aria-hidden', 'true')
    Object.assign(flyingNode.style, {
      position: 'fixed',
      left: `${startCenterX - size / 2}px`,
      top: `${startCenterY - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
      pointerEvents: 'none',
      zIndex: '1400',
      background: '#ffffff',
      border: '1px solid rgba(0, 0, 0, 0.08)',
    })

    const imageNode = document.createElement('img')
    imageNode.src = menuItem.imageUrl || MENU_IMAGE_FALLBACK_URL
    imageNode.alt = menuItem.name
    Object.assign(imageNode.style, {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    })
    flyingNode.appendChild(imageNode)
    document.body.appendChild(flyingNode)

    const animation = flyingNode.animate(
      [
        { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 0.95 },
        {
          transform: `translate3d(${endCenterX - startCenterX}px, ${endCenterY - startCenterY}px, 0) scale(0.32)`,
          opacity: 0.2,
        },
      ],
      {
        duration: 520,
        easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        fill: 'forwards',
      },
    )

    const cleanup = () => {
      flyingNode.remove()
    }

    animation.onfinish = cleanup
    animation.oncancel = cleanup
  }

  function handleAddToCart(menuItem: MenuItem, sourceRect?: DOMRect) {
    setCartItems((prev) => addItemToCart(prev, {
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
    }))
    setQrOrderCode(null)
    setCartError(null)
    triggerCartCountPulse()
    triggerFlyToCartAnimation(menuItem, sourceRect)
  }

  async function handleCreateQrCode() {
    if (!cartItems.length) {
      return
    }

    setCartError(null)
    try {
      const payload = buildCartOrderPayload(cartItems, cartOrderNote)
      const response = await createPublicCartOrderMutation.mutateAsync({
        shopId: restaurantId,
        payload,
      })
      setQrOrderCode(response.code)
    } catch {
      setCartError(t('restaurants.cartSubmitFailed'))
    }
  }

  const detailMenuItems: MenuItem[] = (detailMenuItemsResponse?.data ?? []).map((menuItem) =>
    mapToMenuItem(menuItem, selectedCategoryName),
  )

  const detailTotalMenuItems = detailMenuItemsResponse?.total ?? 0
  const detailTotalPages = Math.max(1, Math.ceil(detailTotalMenuItems / PAGE_SIZE))

  if (!restaurant && !isLoadingShops) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography>{t('restaurants.notFound')}</Typography>
        <Button onClick={() => router.push(`/${locale}/restaurants`)} sx={{ mt: 2 }}>
          <Typography>{t('restaurants.backToRestaurants')}</Typography>
        </Button>
      </Box>
    )
  }

  if (isLoadingShops || isLoadingMenu) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="text.secondary">{t('common.loading')}</Typography>
      </Box>
    )
  }

  if (isMenuError) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography color="error">{t('restaurants.loadFailed')}</Typography>
      </Box>
    )
  }

  if (!activeMenu) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight="bold">
          {restaurant?.name}
        </Typography>
        <Typography color="text.secondary">
          {shopMenuResponse?.message || t('restaurants.activeMenuMissing')}
        </Typography>
        <Button variant="outlined" onClick={() => router.push(`/${locale}/restaurants`)}>
          {t('restaurants.changeStore')}
        </Button>
      </Stack>
    )
  }

  return (
    <>
      <Stack spacing={3.5}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button
            variant="text"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => {
              if (window.history.length > 1) {
                router.back()
                return
              }

              router.push(`/${locale}/restaurants`)
            }}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('restaurants.backToRestaurants')}
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            p: { xs: 2, md: 3 },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '220px minmax(0, 1fr)' },
              alignItems: 'stretch',
              gap: { xs: 2, md: 3 },
            }}
          >
            <Box
              component="img"
              src={shopHeroImage}
              alt={restaurant?.name}
              sx={{
                width: '100%',
                maxWidth: { xs: 280, md: 220 },
                mx: { xs: 'auto', md: 0 },
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                  borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            />

            <Stack spacing={1.25} sx={{ minWidth: 0, justifyContent: 'flex-start' }}>
              <Typography variant="h2" fontWeight={800} sx={{ lineHeight: 1.15 }}>
                {restaurant?.name}
              </Typography>

              <Typography color="text.secondary">{restaurantLabel}</Typography>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<StarRoundedIcon />}
                  label={`${t('restaurants.ratingLabel')}: ${ratingValue}`}
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  icon={<LocalOfferRoundedIcon />}
                  label={`${t('restaurants.statusLabel')}: ${statusValue}`}
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
                {distanceValue && (
                  <Chip
                    icon={<LocationOnRoundedIcon />}
                    label={distanceValue}
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                  />
                )}
                <Button
                  variant="text"
                  startIcon={<InfoOutlinedIcon />}
                  onClick={handleOpenAboutModal}
                  sx={{ px: 0.75, minWidth: 'auto' }}
                >
                  {t('restaurants.about')}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
          <Typography variant="h5" fontWeight={700}>
            {t('restaurants.productsTitle')}
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              ref={cartButtonRef}
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              onClick={() => setIsCartDrawerOpen(true)}
            >
              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                <Box component="span">{t('restaurants.openCart')}</Box>
                <Box
                  component="span"
                  sx={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: 999,
                    px: 0.75,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.24)',
                    fontWeight: 700,
                    lineHeight: 1,
                    animation: isCartCountPulsing ? 'cartCountPulse 280ms ease-out' : 'none',
                    '@keyframes cartCountPulse': {
                      '0%': { transform: 'scale(1)' },
                      '40%': { transform: 'scale(1.22)' },
                      '100%': { transform: 'scale(1)' },
                    },
                  }}
                >
                  {totalCartItems}
                </Box>
              </Box>
            </Button>
            <Button variant="outlined" color="primary" onClick={() => router.push(`/${locale}/restaurants`)}>
              {t('restaurants.changeStore')}
            </Button>
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2.5, md: 3 } }}>
          <Box
            sx={{
              position: 'sticky',
              top: 16,
              zIndex: 10,
              width: { xs: '100%', md: 270 },
              flexShrink: 0,
              alignSelf: 'flex-start',
              bgcolor: 'background.default',
            }}
          >
            <Paper elevation={0} sx={{ borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}` }}>
              <Box
                component="nav"
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  gap: 0.75,
                  p: 1,
                  overflowX: { xs: 'auto', md: 'hidden' },
                  overflowY: { xs: 'hidden', md: 'auto' },
                  maxHeight: { md: '68vh' },
                  '&::-webkit-scrollbar': { width: { md: 8 }, height: { xs: 0, md: 8 } },
                  '&::-webkit-scrollbar-thumb': {
                    bgcolor: (theme) => theme.palette.action.hover,
                    borderRadius: 999,
                  },
                }}
              >
                {categoryTabs.map((category) => {
                  const selected = category.id === selectedCategoryId
                  return (
                    <Chip
                      key={category.id}
                      label={category.name}
                      clickable
                      variant={selected ? 'filled' : 'outlined'}
                      color={selected ? 'primary' : 'default'}
                      onClick={() => {
                        setSelectedCategoryId(category.id)
                        setPage(1)
                      }}
                      sx={{
                        justifyContent: 'flex-start',
                        width: { xs: 'auto', md: '100%' },
                        borderRadius: 2,
                        fontWeight: selected ? 700 : 500,
                        flexShrink: 0,
                        '& .MuiChip-label': {
                          px: 1.2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: { xs: 180, md: '100%' },
                        },
                      }}
                    />
                  )
                })}
              </Box>
            </Paper>
          </Box>

          <Box sx={{ flexGrow: 1, width: { xs: '100%', md: 'auto' } }}>
            {isDiscoveryMode ? (
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 0.75 }}>
                    {t('restaurants.discoveryTitle')}
                  </Typography>
                  <Typography color="text.secondary">
                    {t('restaurants.discoverySubtitle')}
                  </Typography>
                </Box>

                {isLoadingDiscoveryMenuItems && <LinearProgress />}
                {hasDiscoveryError && (
                  <Typography color="error">{t('restaurants.loadFailed')}</Typography>
                )}

                {!isLoadingDiscoveryMenuItems && !hasDiscoveryError && (
                  <Stack spacing={2}>
                    {categories.map((category, index) => {
                      const previewQuery = discoveryPreviewQueries[index]
                      const previewMenuItems = (previewQuery.data?.data ?? []).map((menuItem) =>
                        mapToMenuItem(menuItem, category.name),
                      )

                      return (
                        <Paper
                          key={category.id}
                          elevation={0}
                          sx={{
                            p: { xs: 1.75, md: 2.25 },
                            borderRadius: 1.5,
                            border: (theme) => `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 1,
                              mb: 1.5,
                            }}
                          >
                            <Typography variant="h6" fontWeight={700}>
                              {category.name}
                            </Typography>
                            <Button
                              size="small"
                              onClick={() => {
                                setSelectedCategoryId(category.id)
                                setPage(1)
                              }}
                            >
                              {t('restaurants.seeAllCategory')}
                            </Button>
                          </Box>

                          <Divider sx={{ mb: 1.75 }} />

                          {previewQuery.isLoading && (
                            <Typography color="text.secondary">{t('common.loading')}</Typography>
                          )}
                          {previewQuery.isError && (
                            <Typography color="error">{t('restaurants.loadFailed')}</Typography>
                          )}

                          {!previewQuery.isLoading && !previewQuery.isError && (
                            <>
                              {previewMenuItems.length > 0 ? (
                                <Grid container spacing={1.5}>
                                  {previewMenuItems.map((menuItem) => (
                                    <Grid size={{ xs: 12, sm: 6, lg: 6 }} key={menuItem.id}>
                                      <MenuItemCard
                                        menuItem={menuItem}
                                        onClick={() => setSelectedMenuItem(menuItem)}
                                        onAddToCart={(sourceRect) => handleAddToCart(menuItem, sourceRect)}
                                      />
                                    </Grid>
                                  ))}
                                </Grid>
                              ) : (
                                <Typography color="text.secondary">
                                  {t('restaurants.previewEmpty')}
                                </Typography>
                              )}
                            </>
                          )}
                        </Paper>
                      )
                    })}
                  </Stack>
                )}
              </Stack>
            ) : (
              <Stack spacing={3}>
                <Box sx={{ scrollMarginTop: 80 }}>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                    {selectedCategoryName}
                  </Typography>

                  {isLoadingDetailMenuItems && <Typography color="text.secondary">{t('common.loading')}</Typography>}
                  {isDetailMenuItemsError && <Typography color="error">{t('restaurants.loadFailed')}</Typography>}

                  {!isLoadingDetailMenuItems && !isDetailMenuItemsError && (
                    <Grid container spacing={1.5}>
                      {detailMenuItems.map((menuItem) => (
                        <Grid size={{ xs: 12, md: 6 }} key={menuItem.id}>
                          <MenuItemCard
                            menuItem={menuItem}
                            onClick={() => setSelectedMenuItem(menuItem)}
                            onAddToCart={(sourceRect) => handleAddToCart(menuItem, sourceRect)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>

                {categories.length === 0 && (
                  <Typography color="text.secondary">{t('restaurants.noCategories')}</Typography>
                )}

                {categories.length > 0 && !isLoadingDetailMenuItems && detailMenuItems.length === 0 && (
                  <Typography color="text.secondary">{t('restaurants.noProducts')}</Typography>
                )}

                {detailTotalMenuItems > PAGE_SIZE && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                    <Pagination
                      page={page}
                      count={detailTotalPages}
                      onChange={(_, value) => setPage(value)}
                      color="primary"
                    />
                  </Box>
                )}
              </Stack>
            )}
          </Box>
        </Box>

        <Dialog
          open={isAboutModalOpen}
          onClose={handleCloseAboutModal}
          fullWidth
          maxWidth="md"
          slotProps={{
            transition: {
              onEntered: handleAboutDialogEntered,
              onExit: handleAboutDialogExit,
            },
          }}
        >
          <DialogTitle sx={{ pb: 1, fontWeight: 800 }}>
            {restaurant?.name} · {t('restaurants.about')}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.25}>
              <Typography color="text.secondary">{shopDescription}</Typography>

              {hasCoordinates && !isLeafletUnavailable ? (
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      zIndex: 1000,
                      bgcolor: 'rgba(255,255,255,0.94)',
                      px: 1.2,
                      py: 0.8,
                      borderRadius: 1,
                      maxWidth: { xs: 'calc(100% - 20px)', md: 440 },
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {t('restaurants.detailAddress')}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {shopAddressLine}
                    </Typography>
                  </Box>
                  <Box ref={aboutMapContainerRef} sx={{ height: 280, width: '100%' }} />
                </Paper>
              ) : hasCoordinates && isLeafletUnavailable && aboutMapLinks ? (
                <Paper variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden', p: 1.5 }}>
                  <Stack spacing={1.5}>
                    <Typography variant="body2" color="text.secondary">
                      {t('restaurants.mapFallbackInfo')}
                    </Typography>
                    <Box
                      component="iframe"
                      src={aboutMapLinks.embed}
                      title={t('restaurants.detailAddress')}
                      loading="lazy"
                      sx={{ width: '100%', height: 280, border: 0, borderRadius: 1 }}
                    />
                  </Stack>
                </Paper>
              ) : (
                <Alert severity="info">{t('restaurants.coordinatesMissing')}</Alert>
              )}

              {hasCoordinates && aboutMapLinks && (
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    component="a"
                    href={aboutMapLinks.open}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {t('restaurants.openInMap')}
                  </Button>
                </Box>
              )}

              <Grid container spacing={1.2}>
                {detailRows.map((row) => (
                  <Grid key={row.label} size={{ xs: 12, sm: 6 }}>
                    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 1.25, height: '100%' }}>
                      <Typography variant="caption" color="text.secondary">
                        {row.label}
                      </Typography>
                      <Typography sx={{ wordBreak: 'break-word', fontWeight: 600 }}>
                        {row.value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {restaurant?.phone && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PhoneRoundedIcon />}
                    component="a"
                    href={`tel:${restaurant.phone}`}
                  >
                    {t('restaurants.call')}
                  </Button>
                )}
                {restaurant?.email && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EmailRoundedIcon />}
                    component="a"
                    href={`mailto:${restaurant.email}`}
                  >
                    {t('restaurants.email')}
                  </Button>
                )}
                {restaurant?.website && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<LanguageRoundedIcon />}
                    component="a"
                    href={ensureWebsiteUrl(restaurant.website)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {t('restaurants.website')}
                  </Button>
                )}
              </Stack>
            </Stack>
          </DialogContent>
        </Dialog>

        <MenuItemDetailModal
          open={!!selectedMenuItem}
          onClose={() => setSelectedMenuItem(null)}
          menuItem={selectedMenuItem}
          onAddToCart={(menuItem, sourceRect) => {
            handleAddToCart(menuItem, sourceRect)
            setSelectedMenuItem(null)
          }}
        />
      </Stack>

      <Drawer
        anchor="right"
        open={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        PaperProps={{
          sx: {
            borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
            backgroundImage: 'none',
          },
        }}
      >
        <Stack spacing={2} sx={{ width: { xs: 330, sm: 410 }, p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={800}>
              {t('restaurants.cartTitle')}
            </Typography>
            <Chip size="small" color="primary" label={totalCartItems} />
          </Stack>

          {cartItems.length === 0 && (
            <Typography color="text.secondary">{t('restaurants.cartEmpty')}</Typography>
          )}

          {cartItems.map((item) => (
            <Paper key={item.menuItemId} variant="outlined" sx={{ p: 1.5, borderRadius: 1.5 }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Typography fontWeight={700}>{item.name}</Typography>
                  <Typography color="primary.main" fontWeight={800}>
                    {t('restaurants.price', { price: item.unitPrice })}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2">{t('restaurants.quantity')}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCartItems((prev) => updateCartItemQuantity(prev, item.menuItemId, item.quantity - 1))
                        setQrOrderCode(null)
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{item.quantity}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCartItems((prev) => updateCartItemQuantity(prev, item.menuItemId, item.quantity + 1))
                        setQrOrderCode(null)
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          ))}

          {cartItems.length > 0 && (
            <>
              <TextField
                size="small"
                label={t('restaurants.orderNote')}
                value={cartOrderNote}
                onChange={(event) => {
                  setCartOrderNote(event.target.value)
                  setQrOrderCode(null)
                }}
                multiline
                minRows={2}
              />

              <Button
                variant="contained"
                onClick={handleCreateQrCode}
                disabled={createPublicCartOrderMutation.isPending}
              >
                {createPublicCartOrderMutation.isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  t('restaurants.generateQr')
                )}
              </Button>
            </>
          )}

          {cartError && <Alert severity="error">{cartError}</Alert>}

          {qrOrderCode && (
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1.5 }}>
              <Stack spacing={1.5} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t('restaurants.orderCode')}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontWeight: 700 }}>
                  {qrOrderCode}
                </Typography>
                <Box
                  role="img"
                  aria-label={t('restaurants.qrCodeAlt')}
                  sx={{ width: 240, height: 240, bgcolor: 'background.paper', p: 1 }}
                >
                  <QRCode
                    value={qrOrderCode}
                    size={224}
                    style={{ width: '100%', height: '100%' }}
                  />
                </Box>
              </Stack>
            </Paper>
          )}
        </Stack>
      </Drawer>
    </>
  )
}
