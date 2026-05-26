'use client'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import InventoryIcon from '@mui/icons-material/Inventory'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { Route } from 'next'
import { useRouter } from 'next/navigation'
import { type ReactNode, useState } from 'react'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'

import { useShopDashboard } from '../hooks/use-shop-dashboard'

const VISIBLE_ITEM_LIMIT = 5
const CATEGORY_COLORS = ['#20b486', '#3b82f6', '#8b5cf6', '#f59e0b', '#94a3b8'] as const

const MOCK_LOW_STOCK_PRODUCTS = [
  { id: 'p-1', name: 'Espresso Çekirdeği', remaining: 1.4, threshold: 3, unit: 'kg' },
  { id: 'p-2', name: 'Tam Yağlı Süt', remaining: 6, threshold: 12, unit: 'lt' },
  { id: 'p-3', name: 'Cheesecake Dilimi', remaining: 4, threshold: 10, unit: 'adet' },
]

const quickActionStyles = {
  'view-stock': {
    icon: <InventoryIcon sx={{ fontSize: 18 }} />,
    bg: 'rgba(245, 158, 11, 0.14)',
    color: '#d97706',
  },
  'open-cashier': {
    icon: <PointOfSaleIcon sx={{ fontSize: 18 }} />,
    bg: 'rgba(15, 23, 42, 0.08)',
    color: '#0f172a',
  },
} as const

const quickActions = [
  {
    id: 'view-stock' as const,
    href: ROUTES.stock,
    labelKey: 'dashboard.viewStockAction',
    descriptionKey: 'dashboard.shop.quickActions.viewStockDescription',
  },
  {
    id: 'open-cashier' as const,
    href: ROUTES.sale,
    labelKey: 'dashboard.openCashierAction',
    descriptionKey: 'dashboard.shop.quickActions.openCashierDescription',
  },
]

function resolveIntlLocale(locale: string) {
  return locale === 'tr' ? 'tr-TR' : 'en-US'
}

function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCount(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPercent(value: number, locale: string) {
  return `%${new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)}`
}

function formatLastUpdated(value: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function SectionCard({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 4,
        borderColor: 'rgba(148, 163, 184, 0.24)',
        boxShadow: '0 18px 45px rgba(15, 23, 42, 0.04)',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.1 }}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {action}
        </Box>
        {children}
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <Stack spacing={2}>
      <Skeleton variant="rounded" height={96} />
      <Grid container spacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <Skeleton variant="rounded" height={100} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Grid key={index} size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rounded" height={300} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}

export function ShopDashboard() {
  const { t, locale } = useI18n()
  const router = useRouter()
  const { scope } = useShopScope()
  const intlLocale = resolveIntlLocale(locale)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isTopProductsModalOpen, setIsTopProductsModalOpen] = useState(false)

  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const selectedShopName = scope.mode === 'SHOP' ? scope.shopName : t('dashboard.shop.fallbackName')
  const { data, isLoading } = useShopDashboard(selectedShopId)

  const sortedCategorySales = [...(data?.categorySales ?? [])].sort((a, b) => b.revenue - a.revenue)

  const sortedTopProducts = [...(data?.topProducts ?? [])].sort((a, b) => {
    if (b.soldCount !== a.soldCount) return b.soldCount - a.soldCount
    return b.revenue - a.revenue
  })

  const visibleCategorySales = sortedCategorySales.slice(0, VISIBLE_ITEM_LIMIT)
  const visibleTopProducts = sortedTopProducts.slice(0, VISIBLE_ITEM_LIMIT)
  const hasMoreCategorySales = sortedCategorySales.length > VISIBLE_ITEM_LIMIT
  const hasMoreTopProducts = sortedTopProducts.length > VISIBLE_ITEM_LIMIT

  const maxCategoryRevenue = Math.max(1, ...visibleCategorySales.map((item) => item.revenue))
  const metricCards = [
    {
      id: 'dailyRevenue',
      label: t('dashboard.shop.metrics.dailyRevenue'),
      value: formatCurrency(data?.dailyRevenue ?? 0, intlLocale),
    },
    {
      id: 'averageCheck',
      label: t('dashboard.shop.metrics.averageCheck'),
      value: formatCurrency(data?.averageCheck ?? 0, intlLocale),
    },
    {
      id: 'activeTables',
      label: t('dashboard.shop.metrics.activeTables'),
      value: `${formatCount(data?.activeTableCount ?? 0, intlLocale)} / ${formatCount(data?.totalTableCount ?? 0, intlLocale)}`,
    },
  ]

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700}>
          {selectedShopName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {t('dashboard.shop.subtitle')}
        </Typography>
        {data?.lastUpdatedAt ? (
          <Chip
            label={t('dashboard.shop.lastUpdated', {
              value: formatLastUpdated(data.lastUpdatedAt, intlLocale),
            })}
            size="small"
            variant="outlined"
            sx={{ mt: 1.25, borderRadius: 2 }}
          />
        ) : null}
      </Box>

      <Grid container spacing={2}>
        {metricCards.map((metric) => (
          <Grid key={metric.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderColor: 'rgba(148, 163, 184, 0.24)',
                boxShadow: '0 16px 32px rgba(15, 23, 42, 0.04)',
              }}
            >
              <CardContent sx={{ p: 2.25, minHeight: 102 }}>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
                <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                  {metric.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              borderColor: 'rgba(148, 163, 184, 0.24)',
              boxShadow: '0 16px 32px rgba(15, 23, 42, 0.04)',
            }}
          >
            <CardContent sx={{ p: 2.25, minHeight: 102 }} />
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard
            title={t('dashboard.shop.categoryRevenueTitle')}
            subtitle={t('dashboard.shop.categoryRevenueSubtitle')}
            action={
              hasMoreCategorySales ? (
                <Chip
                  label={t('dashboard.shop.viewAll')}
                  variant="outlined"
                  sx={{ borderRadius: 3, cursor: 'pointer' }}
                  onClick={() => setIsCategoryModalOpen(true)}
                />
              ) : (
                <Chip label={t('dashboard.shop.today')} variant="outlined" sx={{ borderRadius: 3 }} />
              )
            }
          >
            {visibleCategorySales.length > 0 ? (
              <Stack spacing={1.65}>
                {visibleCategorySales.map((item, index) => (
                  <Box key={item.categoryId}>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {item.categoryName}
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {formatCurrency(item.revenue, intlLocale)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25, mb: 0.75 }}>
                      {formatPercent(item.percentage, intlLocale)}
                    </Typography>
                    <Box
                      sx={{
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: 'rgba(148, 163, 184, 0.18)',
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${Math.round((item.revenue / maxCategoryRevenue) * 100)}%`,
                          height: '100%',
                          borderRadius: 999,
                          backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('dashboard.shop.emptyState')}
              </Typography>
            )}
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard
            title={t('dashboard.shop.topProductsTitle')}
            subtitle={t('dashboard.shop.topProductsSubtitle')}
            action={
              hasMoreTopProducts ? (
                <Chip
                  label={t('dashboard.shop.viewAll')}
                  variant="outlined"
                  sx={{ borderRadius: 3, cursor: 'pointer' }}
                  onClick={() => setIsTopProductsModalOpen(true)}
                />
              ) : (
                <Chip label={t('dashboard.shop.today')} variant="outlined" sx={{ borderRadius: 3 }} />
              )
            }
          >
            {visibleTopProducts.length > 0 ? (
              <Stack divider={<Divider flexItem />} spacing={0}>
                {visibleTopProducts.map((product, index) => (
                  <Box
                    key={product.menuItemId}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '28px 1fr auto auto',
                      gap: 1.25,
                      alignItems: 'center',
                      py: 1.15,
                    }}
                  >
                    <Typography variant="body2" fontWeight={800}>
                      {index + 1}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {product.menuItemName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {`${formatCount(product.soldCount, intlLocale)} ${t('dashboard.shop.itemsUnit')}`}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {formatCurrency(product.revenue, intlLocale)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('dashboard.shop.emptyState')}
              </Typography>
            )}
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard
            title={t('dashboard.shop.quickActionsTitle')}
            subtitle={t('dashboard.shop.quickActionsSubtitle')}
          >
            <Stack spacing={1.1}>
              {quickActions.map((action) => {
                const actionStyle = quickActionStyles[action.id]

                return (
                  <Box
                    key={action.id}
                    onClick={() => router.push(withLocale(locale, action.href) as Route)}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid rgba(148, 163, 184, 0.24)',
                      p: 1.5,
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      '&:hover': {
                        borderColor: '#20b486',
                        backgroundColor: 'rgba(32, 180, 134, 0.04)',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: 2,
                            backgroundColor: actionStyle.bg,
                            color: actionStyle.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {actionStyle.icon}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={700}>
                            {t(action.labelKey)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {t(action.descriptionKey)}
                          </Typography>
                        </Box>
                      </Box>
                      <ArrowForwardRoundedIcon sx={{ fontSize: 18, color: '#64748b', flexShrink: 0 }} />
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <WarningAmberRoundedIcon color="warning" />
            <Typography variant="h6" fontWeight={600}>
              {t('dashboard.shop.lowStockTitle')}
            </Typography>
          </Box>
          <Stack spacing={1}>
            {MOCK_LOW_STOCK_PRODUCTS.map((product) => (
              <Box
                key={product.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  px: 1.5,
                  py: 1,
                }}
              >
                <Typography fontWeight={500}>{product.name}</Typography>
                <Chip
                  color="warning"
                  variant="outlined"
                  label={`${product.remaining} ${product.unit} / ${t('dashboard.shop.thresholdLabel')} ${product.threshold} ${product.unit}`}
                  size="small"
                />
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('dashboard.shop.categoryRevenueModalTitle')}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            {sortedCategorySales.map((item, index) => (
              <Box
                key={item.categoryId}
                sx={{
                  border: '1px solid rgba(148, 163, 184, 0.24)',
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  #{index + 1}
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {item.categoryName}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
                  <Typography variant="body2">{formatCurrency(item.revenue, intlLocale)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatPercent(item.percentage, intlLocale)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={isTopProductsModalOpen} onClose={() => setIsTopProductsModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('dashboard.shop.topProductsModalTitle')}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={1.5}>
            {sortedTopProducts.map((item, index) => (
              <Box
                key={item.menuItemId}
                sx={{
                  border: '1px solid rgba(148, 163, 184, 0.24)',
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  #{index + 1}
                </Typography>
                <Typography variant="body2" fontWeight={700}>
                  {item.menuItemName}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
                  <Typography variant="body2">
                    {`${formatCount(item.soldCount, intlLocale)} ${t('dashboard.shop.itemsUnit')}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(item.revenue, intlLocale)}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  )
}
