'use client'

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import { useRouter } from 'next/navigation'
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

type PublicImageSize = 'SMALL' | 'ORIGINAL'

function buildPublicMenuItemImageUrl(imageId: string, size: PublicImageSize = 'SMALL'): string {
  const encodedImageId = encodeURIComponent(imageId)
  return `/api/sale/public/images/${encodedImageId}?size=${size}`
}

export function MenuItemList({ restaurantId }: MenuItemListProps) {
  const { t, locale } = useI18n()
  const requestedMenuLanguage: MenuLanguage = locale === 'tr' ? 'TR' : 'EN'
  const router = useRouter()
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(ALL_CATEGORY_ID)
  const [page, setPage] = useState(1)

  const [cartItems, setCartItems] = useState<CartItemState[]>([])
  const [cartOrderNote, setCartOrderNote] = useState('')
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [qrOrderCode, setQrOrderCode] = useState<string | null>(null)
  const [cartError, setCartError] = useState<string | null>(null)
  const [isCartCountPulsing, setIsCartCountPulsing] = useState(false)
  const cartButtonRef = useRef<HTMLButtonElement | null>(null)
  const cartPulseTimeoutRef = useRef<number | null>(null)

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
  const tenantValue = restaurant?.tenantName ?? restaurant?.tenantId

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
      borderRadius: '14px',
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
      <Stack spacing={4}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Stack spacing={0.5}>
            {tenantValue && (
              <Typography variant="overline" color="text.secondary">
                {tenantValue}
              </Typography>
            )}
            <Typography variant="h4" fontWeight="bold">
              {restaurant?.name ?? t('restaurants.title')} - {t('restaurants.productsTitle')}
            </Typography>
          </Stack>
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

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 4 } }}>
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
            <Paper elevation={0} sx={{ borderRadius: 1.5, border: (theme) => `1px solid ${theme.palette.divider}` }}>
              <Box
                component="nav"
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'row', md: 'column' },
                  gap: 1,
                  p: 1.5,
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
                        borderRadius: 999,
                        px: 0.5,
                        py: 0.25,
                        fontWeight: selected ? 700 : 500,
                        flexShrink: 0,
                        transition: 'all 0.2s ease',
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
              <Stack spacing={3}>
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
                  <Stack spacing={2.5}>
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
                            p: { xs: 2, md: 2.5 },
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
                                <Grid container spacing={2}>
                                  {previewMenuItems.map((menuItem) => (
                                    <Grid size={{ xs: 6, sm: 6, lg: 6 }} key={menuItem.id}>
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
              <Stack spacing={4}>
                <Box sx={{ scrollMarginTop: 80 }}>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                    {selectedCategoryName}
                  </Typography>

                  {isLoadingDetailMenuItems && <Typography color="text.secondary">{t('common.loading')}</Typography>}
                  {isDetailMenuItemsError && <Typography color="error">{t('restaurants.loadFailed')}</Typography>}

                  {!isLoadingDetailMenuItems && !isDetailMenuItemsError && (
                    <Grid container spacing={2}>
                      {detailMenuItems.map((menuItem) => (
                        <Grid size={{ xs: 6, md: 6 }} key={menuItem.id}>
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
      >
        <Stack spacing={2} sx={{ width: { xs: 320, sm: 400 }, p: 2.5 }}>
          <Typography variant="h6" fontWeight={700}>
            {t('restaurants.cartTitle')}
          </Typography>

          {cartItems.length === 0 && (
            <Typography color="text.secondary">{t('restaurants.cartEmpty')}</Typography>
          )}

          {cartItems.map((item) => (
            <Paper key={item.menuItemId} variant="outlined" sx={{ p: 1.5 }}>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                  <Typography fontWeight={600}>{item.name}</Typography>
                  <Typography color="primary.main" fontWeight={700}>
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
                    <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</Typography>
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
            <Paper variant="outlined" sx={{ p: 1.5 }}>
              <Stack spacing={1.5} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t('restaurants.orderCode')}
                </Typography>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
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
