'use client'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import InventoryIcon from '@mui/icons-material/Inventory'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import TableRestaurantOutlinedIcon from '@mui/icons-material/TableRestaurantOutlined'
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import {
  alpha,
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
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'

import { useShopDashboard } from '../hooks/use-shop-dashboard'
import type {
  ShopDashboardLowStockDto,
  ShopDashboardLowStockTone,
  ShopDashboardMetricUnit,
  ShopDashboardSalesChannelId,
} from '../types/shop-dashboard'

const VISIBLE_ITEM_LIMIT = 5

const CATEGORY_COLORS = ['#20b486', '#3b82f6', '#8b5cf6', '#f59e0b', '#94a3b8'] as const

const SALES_CHANNEL_ORDER: ShopDashboardSalesChannelId[] = [
  'TABLE_SERVICE',
  'TAKEAWAY',
  'DELIVERY',
  'ONLINE',
]

const salesChannelMeta: Record<ShopDashboardSalesChannelId, { color: string; labelKey: string }> = {
  TABLE_SERVICE: { color: '#20b486', labelKey: 'dashboard.shop.salesChannels.tableService' },
  TAKEAWAY: { color: '#3b82f6', labelKey: 'dashboard.shop.salesChannels.takeaway' },
  DELIVERY: { color: '#f59e0b', labelKey: 'dashboard.shop.salesChannels.delivery' },
  ONLINE: { color: '#fb7185', labelKey: 'dashboard.shop.salesChannels.online' },
}

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

interface ShopDashboardMetricDelta {
  value: number
  unit: 'percent' | 'count'
  direction: 'up' | 'down' | 'neutral'
  comparisonLabel: string
}

interface ShopDashboardMetricProgress {
  value: number
  label: string
  color: string
}

interface ShopDashboardMetric {
  id: 'dailyRevenue' | 'averageCheck' | 'activeTables' | 'cancelRate'
  label: string
  value: number | string
  unit: ShopDashboardMetricUnit
  delta?: ShopDashboardMetricDelta
  progress?: ShopDashboardMetricProgress
}

interface ShopDashboardLowStockItem {
  id: string
  name: string
  remainingLabel: string
  progress: number
  statusLabel: string
  tone: ShopDashboardLowStockTone
}

const metricStyles: Record<
  ShopDashboardMetric['id'],
  { icon: ReactNode; accent: string; iconBg: string; iconColor: string }
> = {
  dailyRevenue: {
    icon: <TrendingUpRoundedIcon />,
    accent: '#20b486',
    iconBg: 'rgba(32, 180, 134, 0.12)',
    iconColor: '#0f766e',
  },
  averageCheck: {
    icon: <ShoppingBagOutlinedIcon />,
    accent: '#3b82f6',
    iconBg: 'rgba(59, 130, 246, 0.12)',
    iconColor: '#1d4ed8',
  },
  activeTables: {
    icon: <TableRestaurantOutlinedIcon />,
    accent: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.14)',
    iconColor: '#d97706',
  },
  cancelRate: {
    icon: <LocalOfferOutlinedIcon />,
    accent: '#8b5cf6',
    iconBg: 'rgba(139, 92, 246, 0.12)',
    iconColor: '#7c3aed',
  },
}

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

function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPercent(value: number, locale: string) {
  return `%${new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)}`
}

function formatSignedPercent(value: number, locale: string) {
  const absValue = Math.abs(value)
  const formatted = `%${new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(absValue)}`

  return value > 0 ? `+${formatted}` : value < 0 ? `-${formatted}` : formatted
}

function formatValueByUnit(value: number | string, unit: ShopDashboardMetricUnit, locale: string) {
  if (typeof value === 'string') {
    return value
  }

  if (unit === 'currency') {
    return formatCurrency(value, locale)
  }

  if (unit === 'percent') {
    return formatPercent(value, locale)
  }

  return formatCount(value, locale)
}

function formatShortCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'TRY',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function formatTrendLabel(value: string, locale: string) {
  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
  }).format(date)
}

function toUnitAbbreviation(unitType: string | null, locale: string) {
  if (!unitType) {
    return ''
  }

  const isTurkish = locale === 'tr-TR'

  switch (unitType) {
    case 'PIECE':
      return isTurkish ? 'adet' : 'pc'
    case 'GRAM':
      return 'g'
    case 'KILOGRAM':
      return 'kg'
    case 'MILLILITER':
      return 'ml'
    case 'LITER':
      return isTurkish ? 'lt' : 'l'
    default:
      return unitType.toLowerCase()
  }
}

function toLowStockItem(
  stock: ShopDashboardLowStockDto,
  locale: string,
  t: (key: string, params?: Record<string, string | number>) => string,
): ShopDashboardLowStockItem {
  const safeThreshold = stock.reorderThreshold > 0 ? stock.reorderThreshold : 1
  const ratio = stock.quantity / safeThreshold
  const progress = Math.max(0, Math.min(100, Math.round(ratio * 100)))
  const tone: ShopDashboardLowStockTone = ratio <= 0.35 ? 'critical' : 'warning'
  const unit = toUnitAbbreviation(stock.unitType, locale)

  return {
    id: stock.stockResourceId,
    name: stock.name,
    remainingLabel: t('dashboard.shop.lowStock.remainingLabel', {
      quantity: formatNumber(stock.quantity, locale),
      threshold: formatNumber(stock.reorderThreshold, locale),
      unit,
    }),
    progress,
    statusLabel:
      tone === 'critical'
        ? t('dashboard.shop.lowStock.criticalStatus')
        : t('dashboard.shop.lowStock.warningStatus'),
    tone,
  }
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
    <Stack spacing={3}>
      <Skeleton variant="rounded" height={96} />
      <Grid container spacing={2}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Skeleton variant="rounded" height={148} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Skeleton variant="rounded" height={340} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Skeleton variant="rounded" height={340} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" height={300} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" height={300} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" height={300} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Skeleton variant="rounded" height={320} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Skeleton variant="rounded" height={320} />
        </Grid>
      </Grid>
    </Stack>
  )
}

function MetricCard({ metric, locale }: { metric: ShopDashboardMetric; locale: string }) {
  const style = metricStyles[metric.id]
  const delta = metric.delta

  if (metric.id === 'cancelRate') {
    return (
      <Card
        variant="outlined"
        sx={{
          borderRadius: 4,
          borderColor: 'rgba(148, 163, 184, 0.24)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 16px 32px rgba(15, 23, 42, 0.04)',
          minHeight: { xs: 140, sm: 180 },
          height: '100%',
        }}
      >
        <Box sx={{ position: 'absolute', insetInline: 0, top: 0, height: 4, background: style.accent }} />
        <CardContent sx={{ p: { xs: 1.75, sm: 2.5 }, minHeight: { xs: 140, sm: 180 } }} />
      </Card>
    )
  }

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 4,
        borderColor: 'rgba(148, 163, 184, 0.24)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 16px 32px rgba(15, 23, 42, 0.04)',
        height: '100%',
        transition: 'border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
        '&:hover': {
          borderColor: alpha(style.accent, 0.7),
          boxShadow: `0 18px 36px ${alpha(style.accent, 0.12)}`,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box sx={{ position: 'absolute', insetInline: 0, top: 0, height: 4, background: style.accent }} />
      <CardContent
        sx={{
          p: { xs: 1.75, sm: 2.5 },
          minHeight: { xs: 140, sm: 180 },
          height: '100%',
          display: 'flex',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%' }}>
          <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 0.75,
                minHeight: { xs: 36, sm: 44 },
                display: 'flex',
                alignItems: 'flex-start',
                fontSize: { xs: 13, sm: 14 },
              }}
            >
              {metric.label}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                letterSpacing: -0.8,
                fontSize: { xs: 'clamp(1.4rem, 6.2vw, 1.95rem)', sm: '2.125rem' },
                lineHeight: 1.05,
                whiteSpace: 'nowrap',
              }}
            >
              {formatValueByUnit(metric.value, metric.unit, locale)}
            </Typography>

            <Box
              sx={{
                mt: metric.progress ? 1.5 : 'auto',
                pt: { xs: 1, sm: 1.35 },
                minHeight: delta ? { xs: 34, sm: 42 } : 0,
                display: 'flex',
                alignItems: 'flex-start',
              }}
            >
              {delta ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  {delta.direction === 'up' ? (
                    <TrendingUpRoundedIcon sx={{ fontSize: 16, color: 'success.main', mt: 0.15 }} />
                  ) : delta.direction === 'down' ? (
                    <TrendingDownRoundedIcon sx={{ fontSize: 16, color: 'error.main', mt: 0.15 }} />
                  ) : (
                    <AutorenewRoundedIcon sx={{ fontSize: 15, color: 'text.disabled', mt: 0.15 }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.45,
                      fontSize: { xs: 11, sm: 12 },
                      color:
                        delta.direction === 'neutral'
                          ? 'text.secondary'
                          : delta.direction === 'up'
                            ? 'success.main'
                            : 'error.main',
                    }}
                  >
                    {delta.direction === 'neutral'
                      ? delta.comparisonLabel
                      : `${formatValueByUnit(
                          delta.value,
                          delta.unit === 'percent' ? 'percent' : 'count',
                          locale,
                        )} ${delta.comparisonLabel}`}
                  </Typography>
                </Box>
              ) : null}
            </Box>
            {metric.progress ? (
              <Box sx={{ mt: 1.5 }}>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: 'rgba(148, 163, 184, 0.18)',
                    overflow: 'hidden',
                    mb: 0.75,
                  }}
                >
                  <Box
                    sx={{
                      width: `${metric.progress.value}%`,
                      height: '100%',
                      borderRadius: 999,
                      backgroundColor: metric.progress.color,
                    }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {metric.progress.label}
                </Typography>
              </Box>
            ) : null}
          </Box>
          <Box
            sx={{
              width: { xs: 44, sm: 56 },
              height: { xs: 44, sm: 56 },
              borderRadius: { xs: 2.5, sm: 3 },
              background: style.iconBg,
              color: style.iconColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {style.icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

function TrendTooltip({
  active,
  payload,
  label,
  locale,
}: {
  active?: boolean
  payload?: Array<{ dataKey?: string; value?: number; color?: string; name?: string }>
  label?: string
  locale: string
}) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(148, 163, 184, 0.28)',
        backgroundColor: 'rgba(255,255,255,0.96)',
        p: 1.5,
        boxShadow: '0 16px 32px rgba(15, 23, 42, 0.08)',
      }}
    >
      <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
        {label}
      </Typography>
      <Stack spacing={0.75}>
        {payload.map((item) => (
          <Box key={item.dataKey} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '999px',
                backgroundColor: item.color ?? '#94a3b8',
                flexShrink: 0,
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
              {item.name}
            </Typography>
            <Typography variant="caption" fontWeight={700}>
              {typeof item.value === 'number' ? formatCurrency(item.value, locale) : '-'}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

function LowStockCard({ item }: { item: ShopDashboardLowStockItem }) {
  const toneColor = item.tone === 'critical' ? '#ef4444' : '#f59e0b'
  const toneBg = item.tone === 'critical' ? 'rgba(239, 68, 68, 0.10)' : 'rgba(245, 158, 11, 0.12)'

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(148, 163, 184, 0.24)',
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 54,
            height: 54,
            borderRadius: 2.5,
            backgroundColor: 'rgba(148, 163, 184, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b',
            flexShrink: 0,
          }}
        >
          <LocalCafeOutlinedIcon />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {item.name}
            </Typography>
            <Chip
              label={item.statusLabel}
              size="small"
              sx={{
                height: 24,
                borderRadius: 2,
                backgroundColor: toneBg,
                color: toneColor,
                fontWeight: 700,
              }}
            />
          </Box>
          <Box
            sx={{
              height: 8,
              borderRadius: 999,
              backgroundColor: 'rgba(148, 163, 184, 0.18)',
              overflow: 'hidden',
              my: 1,
            }}
          >
            <Box
              sx={{
                width: `${item.progress}%`,
                height: '100%',
                borderRadius: 999,
                backgroundColor: toneColor,
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {item.remainingLabel}
          </Typography>
        </Box>
      </Box>
    </Box>
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

  if (isLoading || !data) {
    return <DashboardSkeleton />
  }

  const dailyRevenue = data.dailyRevenue ?? 0
  const averageCheck = data.averageCheck ?? 0
  const activeTableCount = data.activeTableCount ?? 0
  const totalTableCount = data.totalTableCount ?? 0
  const rawSalesChannels = data.salesChannels ?? []
  const rawCategorySales = data.categorySales ?? []
  const rawTopProducts = data.topProducts ?? []
  const rawTrend = data.trend ?? []
  const rawLowStock = data.lowStock ?? []

  const salesChannelMap = new Map<
    ShopDashboardSalesChannelId,
    { value: number; percentage: number }
  >(rawSalesChannels.map((item) => [item.channelId, { value: item.value, percentage: item.percentage }]))
  const salesChannels = SALES_CHANNEL_ORDER.map((channelId) => {
    const source = salesChannelMap.get(channelId)
    const meta = salesChannelMeta[channelId]

    return {
      channelId,
      label: t(meta.labelKey),
      color: meta.color,
      value: source?.value ?? 0,
      percentage: source?.percentage ?? 0,
    }
  })

  const totalChannelOrders = salesChannels.reduce((sum, item) => sum + item.value, 0)

  const sortedCategorySales = [...rawCategorySales].sort((a, b) => b.revenue - a.revenue)
  const visibleCategorySales = sortedCategorySales.slice(0, VISIBLE_ITEM_LIMIT)
  const hasMoreCategorySales = sortedCategorySales.length > VISIBLE_ITEM_LIMIT
  const maxCategorySales = Math.max(1, ...visibleCategorySales.map((item) => item.revenue))

  const sortedTopProducts = [...rawTopProducts].sort((a, b) => {
    if (b.soldCount !== a.soldCount) {
      return b.soldCount - a.soldCount
    }

    return b.revenue - a.revenue
  })
  const visibleTopProducts = sortedTopProducts.slice(0, VISIBLE_ITEM_LIMIT)
  const hasMoreTopProducts = sortedTopProducts.length > VISIBLE_ITEM_LIMIT

  const occupancyRate = totalTableCount > 0 ? (activeTableCount / totalTableCount) * 100 : 0

  const metrics: ShopDashboardMetric[] = [
    {
      id: 'dailyRevenue',
      label: t('dashboard.shop.metrics.dailyRevenue'),
      value: dailyRevenue,
      unit: 'currency',
    },
    {
      id: 'averageCheck',
      label: t('dashboard.shop.metrics.averageCheck'),
      value: averageCheck,
      unit: 'currency',
    },
    {
      id: 'activeTables',
      label: t('dashboard.shop.metrics.activeTables'),
      value: `${formatCount(activeTableCount, intlLocale)} / ${formatCount(totalTableCount, intlLocale)}`,
      unit: 'text',
      progress: {
        value: Math.max(0, Math.min(100, Math.round(occupancyRate))),
        label: t('dashboard.shop.metrics.occupancyLabel', {
          value: formatPercent(occupancyRate, intlLocale),
        }),
        color: '#f59e0b',
      },
    },
    {
      id: 'cancelRate',
      label: t('dashboard.shop.metrics.cancelRate'),
      value: '',
      unit: 'text',
    },
  ]

  const trendData = rawTrend.map((item) => ({
    ...item,
    label: formatTrendLabel(item.label, intlLocale),
  }))

  const performanceItems = [
    {
      id: 'totalRevenue',
      label: t('dashboard.shop.performance.totalRevenue'),
      value: data.performance?.totalRevenue ?? 0,
      unit: 'currency' as const,
      delta: data.performance?.totalRevenueDeltaPercentage,
    },
    {
      id: 'averageCheck',
      label: t('dashboard.shop.performance.averageCheck'),
      value: data.performance?.averageCheck ?? 0,
      unit: 'currency' as const,
      delta: data.performance?.averageCheckDeltaPercentage,
    },
    {
      id: 'tableServiceCount',
      label: t('dashboard.shop.performance.tableServiceCount'),
      value: data.performance?.totalTableServiceCount ?? 0,
      unit: 'count' as const,
      delta: data.performance?.totalTableServiceCountDeltaPercentage,
    },
    {
      id: 'satisfaction',
      label: t('dashboard.shop.performance.customerSatisfaction'),
      value:
        data.performance?.customerSatisfaction == null
          ? t('dashboard.shop.performance.satisfactionPlaceholder')
          : `${formatNumber(data.performance.customerSatisfaction, intlLocale)} / 5`,
      unit: 'text' as const,
      delta: null,
    },
  ]

  const lowStockItems = rawLowStock.map((item) => toLowStockItem(item, intlLocale, t))

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          p: { xs: 2, md: 2.5 },
          boxShadow: (theme) =>
            theme.palette.mode === 'dark' ? '0 10px 20px rgba(2, 6, 23, 0.22)' : '0 8px 18px rgba(15, 23, 42, 0.06)',
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          fontWeight={700}
          sx={{
            letterSpacing: -0.5,
            lineHeight: 1.2,
            color: 'text.primary',
          }}
        >
          {selectedShopName}
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {metrics.map((metric) => (
          <Grid key={metric.id} size={{ xs: 6, sm: 6, lg: 3 }}>
            <MetricCard metric={metric} locale={intlLocale} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <SectionCard
            title={t('dashboard.shop.trend.title')}
            subtitle={t('dashboard.shop.trend.subtitle')}
            action={<Chip label={t('dashboard.shop.rangeLast7Days')} variant="outlined" sx={{ borderRadius: 3 }} />}
          >
            <Stack direction="row" spacing={2.5} sx={{ mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 28, height: 3, borderRadius: 99, backgroundColor: '#20b486' }} />
                <Typography variant="caption" color="text.secondary">
                  {t('dashboard.shop.trend.revenueLegend')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 28, height: 3, borderRadius: 99, backgroundColor: '#3b82f6' }} />
                <Typography variant="caption" color="text.secondary">
                  {t('dashboard.shop.trend.averageCheckLegend')}
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.24)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="revenue"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => formatShortCurrency(value, intlLocale)}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="check"
                    orientation="right"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => formatCurrency(value, intlLocale)}
                    axisLine={false}
                    tickLine={false}
                    width={72}
                  />
                  <RechartsTooltip content={<TrendTooltip locale={intlLocale} />} />
                  <Line
                    yAxisId="revenue"
                    type="monotone"
                    dataKey="revenue"
                    name={t('dashboard.shop.trend.revenueSeriesName')}
                    stroke="#20b486"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#20b486', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="check"
                    type="monotone"
                    dataKey="averageCheck"
                    name={t('dashboard.shop.trend.averageCheckSeriesName')}
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <SectionCard
            title={t('dashboard.shop.channels.title')}
            subtitle={t('dashboard.shop.channels.subtitle')}
            action={<Chip label={t('dashboard.shop.today')} variant="outlined" sx={{ borderRadius: 3 }} />}
          >
            <Stack
              direction="column"
              spacing={2}
              alignItems="stretch"
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: { xs: 210, sm: 240 },
                  alignSelf: 'center',
                  flexShrink: 0,
                }}
              >
                <Box sx={{ width: '100%', aspectRatio: '1 / 1' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesChannels}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={56}
                        outerRadius={84}
                        paddingAngle={2}
                        strokeWidth={0}
                      >
                        {salesChannels.map((item) => (
                          <Cell key={item.channelId} fill={item.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Typography
                    variant="h3"
                    fontWeight={800}
                    sx={{ lineHeight: 1, fontSize: { xs: '1.7rem', sm: '2rem' } }}
                  >
                    {formatCount(totalChannelOrders, intlLocale)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('dashboard.shop.channels.totalOrders')}
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={1} sx={{ width: '100%', minWidth: 0 }}>
                {salesChannels.map((item) => (
                  <Box key={item.channelId} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 11,
                        height: 11,
                        borderRadius: '999px',
                        backgroundColor: item.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      sx={{ flexShrink: 0, whiteSpace: 'nowrap', fontSize: { xs: 12, sm: 14 } }}
                    >
                      {`${formatCount(item.value, intlLocale)} (${formatPercent(item.percentage, intlLocale)})`}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        gap: 2,
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        {item.categoryName}
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {formatCurrency(item.revenue, intlLocale)}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.25, mb: 0.75 }}
                    >
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
                          width: `${Math.round((item.revenue / maxCategorySales) * 100)}%`,
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

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
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

        <Grid size={{ xs: 12, md: 12, lg: 4 }}>
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
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 1.5,
                      }}
                    >
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

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard
            title={t('dashboard.shop.performance.title')}
            subtitle={t('dashboard.shop.performance.subtitle', { shopName: selectedShopName })}
            action={<Chip label={t('dashboard.shop.performance.periodLabel')} variant="outlined" sx={{ borderRadius: 3 }} />}
          >
            <Stack divider={<Divider flexItem />} spacing={0}>
              {performanceItems.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    py: 1.25,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <PointOfSaleOutlinedIcon sx={{ fontSize: 18, color: '#0f766e' }} />
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" fontWeight={700}>
                      {formatValueByUnit(item.value, item.unit, intlLocale)}
                    </Typography>
                    {item.delta != null ? (
                      <Typography
                        variant="caption"
                        sx={{
                          color: item.delta >= 0 ? 'success.main' : 'error.main',
                          fontWeight: 700,
                        }}
                      >
                        {formatSignedPercent(item.delta, intlLocale)}
                      </Typography>
                    ) : null}
                  </Box>
                </Box>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard
            title={t('dashboard.shop.lowStockTitle')}
            subtitle={t('dashboard.shop.lowStock.subtitle')}
            action={
              <Chip
                icon={<Inventory2OutlinedIcon sx={{ fontSize: '16px !important' }} />}
                label={t('dashboard.shop.lowStock.viewAllStocks')}
                variant="outlined"
                sx={{ borderRadius: 3 }}
                onClick={() => router.push(withLocale(locale, ROUTES.stock) as Route)}
              />
            }
          >
            {lowStockItems.length > 0 ? (
              <Stack spacing={1.4}>
                {lowStockItems.map((item) => (
                  <LowStockCard key={item.id} item={item} />
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('dashboard.shop.lowStock.emptyState')}
              </Typography>
            )}
          </SectionCard>
        </Grid>
      </Grid>

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
