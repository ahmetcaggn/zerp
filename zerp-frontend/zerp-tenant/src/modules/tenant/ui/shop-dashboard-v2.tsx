'use client'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import InventoryIcon from '@mui/icons-material/Inventory'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import SendIcon from '@mui/icons-material/Send'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import TableRestaurantOutlinedIcon from '@mui/icons-material/TableRestaurantOutlined'
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import {
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { Route } from 'next'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
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

import { shopDashboardMockShops } from '../api/mock-shop-dashboard-data'
import { useShopDashboard } from '../hooks/use-shop-dashboard'
import type {
  ShopDashboardLowStockItem,
  ShopDashboardMetric,
  ShopDashboardMetricUnit,
  ShopDashboardPerformanceItem,
  ShopDashboardQuickAction,
} from '../types/shop-dashboard'

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

const quickActionStyles: Record<
  ShopDashboardQuickAction['id'],
  { icon: ReactNode; bg: string; color: string }
> = {
  'add-employee': {
    icon: <PersonAddIcon sx={{ fontSize: 18 }} />,
    bg: 'rgba(32, 180, 134, 0.12)',
    color: '#0f766e',
  },
  'send-notification': {
    icon: <SendIcon sx={{ fontSize: 18 }} />,
    bg: 'rgba(59, 130, 246, 0.12)',
    color: '#1d4ed8',
  },
  'new-ticket': {
    icon: <ConfirmationNumberIcon sx={{ fontSize: 18 }} />,
    bg: 'rgba(139, 92, 246, 0.12)',
    color: '#7c3aed',
  },
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

function formatPercent(value: number, locale: string) {
  return `%${new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value)}`
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
  return `₺${new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
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
      <Skeleton variant="rounded" height={220} />
    </Stack>
  )
}

function MetricCard({ metric, locale }: { metric: ShopDashboardMetric; locale: string }) {
  const style = metricStyles[metric.id]
  const delta = metric.delta

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
                sx={{ mb: 0.75, minHeight: { xs: 36, sm: 44 }, display: 'flex', alignItems: 'flex-start', fontSize: { xs: 13, sm: 14 } }}
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
              {metric.secondaryLabel ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 0.5, minHeight: { xs: 18, sm: 20 }, fontSize: { xs: 11, sm: 12 } }}
                >
                  {metric.secondaryLabel}
                </Typography>
              ) : null}
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
                    <TrendingDownRoundedIcon sx={{ fontSize: 16, color: 'success.main', mt: 0.15 }} />
                  ) : (
                    <AutorenewRoundedIcon sx={{ fontSize: 15, color: 'text.disabled', mt: 0.15 }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.45,
                      fontSize: { xs: 11, sm: 12 },
                      color: delta.direction === 'neutral' ? 'text.secondary' : 'success.main',
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
              {typeof item.value === 'number'
                ? item.dataKey === 'revenue'
                  ? formatCurrency(item.value, locale)
                  : formatCurrency(item.value, locale)
                : '-'}
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

export function ShopDashboardV2() {
  const { locale } = useI18n()
  const theme = useTheme()
  const router = useRouter()
  const { scope } = useShopScope()
  const intlLocale = resolveIntlLocale(locale)
  const isDarkMode = theme.palette.mode === 'dark'
  const selectedShopId =
    scope.mode === 'SHOP' ? scope.shopId : shopDashboardMockShops[0]?.id
  const selectedShopName =
    scope.mode === 'SHOP' ? scope.shopName : shopDashboardMockShops[0]?.name ?? 'Mağaza'
  const { data, isLoading } = useShopDashboard(selectedShopId)

  if (isLoading || !data) {
    return <DashboardSkeleton />
  }

  const heroBorderColor = isDarkMode ? alpha('#67e8f9', 0.2) : 'rgba(191, 219, 254, 0.5)'
  const heroBackground = isDarkMode
    ? 'radial-gradient(circle at top left, rgba(32, 180, 134, 0.18), transparent 28%), linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(17, 24, 39, 0.96) 55%, rgba(30, 41, 59, 0.92) 100%)'
    : 'radial-gradient(circle at top left, rgba(32, 180, 134, 0.14), transparent 30%), linear-gradient(135deg, #ffffff 0%, #f8fbff 52%, #f5fffb 100%)'
  const totalChannelOrders = data.salesChannels.reduce((sum, item) => sum + item.value, 0)
  const maxCategorySales = Math.max(1, ...data.categorySales.map((item) => item.sales))

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          borderRadius: 5,
          border: `1px solid ${heroBorderColor}`,
          background: heroBackground,
          p: { xs: 2.5, md: 3 },
          boxShadow: isDarkMode
            ? '0 24px 48px rgba(2, 6, 23, 0.34)'
            : '0 24px 48px rgba(15, 23, 42, 0.04)',
        }}
      >
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', lg: 'center' }}
          spacing={2}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                background: 'rgba(32, 180, 134, 0.12)',
                color: '#0f766e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <StorefrontOutlinedIcon sx={{ fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -1 }}>
                {selectedShopName}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
                {data.subtitle}
              </Typography>
            </Box>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <Chip
              icon={<CalendarTodayOutlinedIcon sx={{ fontSize: '18px !important' }} />}
              label={data.reportDateLabel}
              sx={{
                height: 42,
                borderRadius: 3,
                backgroundColor: isDarkMode ? alpha(theme.palette.common.white, 0.06) : 'rgba(255,255,255,0.88)',
              }}
            />
            <Chip
              label={`Son güncelleme: ${formatLastUpdated(data.lastUpdatedAt, intlLocale)}`}
              variant="outlined"
              sx={{
                height: 42,
                borderRadius: 3,
                borderColor: isDarkMode ? alpha(theme.palette.common.white, 0.18) : undefined,
              }}
            />
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        {data.metrics.map((metric) => (
          <Grid key={metric.id} size={{ xs: 6, sm: 6, lg: 3 }}>
            <MetricCard metric={metric} locale={intlLocale} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <SectionCard
            title="Ciro ve Adisyon Trendi"
            subtitle="Son 7 güne ait mağaza satış ritmi"
            action={<Chip label={data.rangeLabel} variant="outlined" sx={{ borderRadius: 3 }} />}
          >
            <Stack direction="row" spacing={2.5} sx={{ mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 28, height: 3, borderRadius: 99, backgroundColor: '#20b486' }} />
                <Typography variant="caption" color="text.secondary">
                  Ciro (₺)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 28, height: 3, borderRadius: 99, backgroundColor: '#3b82f6' }} />
                <Typography variant="caption" color="text.secondary">
                  Ortalama Adisyon (₺)
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.trend} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.24)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="revenue" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => formatShortCurrency(value, intlLocale)} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="check" orientation="right" tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => formatCurrency(value, intlLocale)} axisLine={false} tickLine={false} width={72} />
                  <RechartsTooltip content={<TrendTooltip locale={intlLocale} />} />
                  <Line yAxisId="revenue" type="monotone" dataKey="revenue" name="Ciro" stroke="#20b486" strokeWidth={2.5} dot={{ r: 4, fill: '#20b486', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="check" type="monotone" dataKey="averageCheck" name="Ortalama Adisyon" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <SectionCard
            title="Satış Kanalları"
            subtitle="Talep durumu yerine satış dağılımı"
            action={<Chip label="Bugün" variant="outlined" sx={{ borderRadius: 3 }} />}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Box sx={{ position: 'relative', width: 240, alignSelf: 'center' }}>
                <PieChart width={240} height={240}>
                  <Pie
                    data={data.salesChannels}
                    dataKey="value"
                    nameKey="label"
                    cx={120}
                    cy={120}
                    innerRadius={62}
                    outerRadius={94}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {data.salesChannels.map((item) => (
                      <Cell key={item.label} fill={item.color} />
                    ))}
                  </Pie>
                </PieChart>
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
                  <Typography variant="h3" fontWeight={800} sx={{ lineHeight: 1 }}>
                    {formatCount(totalChannelOrders, intlLocale)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Sipariş
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={1.25} sx={{ flex: 1, width: '100%' }}>
                {data.salesChannels.map((item) => (
                  <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                    <Box
                      sx={{
                        width: 11,
                        height: 11,
                        borderRadius: '999px',
                        backgroundColor: item.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {`${item.value} (%${item.percentage.toFixed(1).replace('.0', '')})`}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard
            title="Kategorilere Göre Ciro"
            subtitle="Şube satışlarının kategori dağılımı"
            action={<Chip label="Bugün" variant="outlined" sx={{ borderRadius: 3 }} />}
          >
            <Stack spacing={1.65}>
              {data.categorySales.map((item) => (
                <Box key={item.id}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {formatCurrency(item.sales, intlLocale)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25, mb: 0.75 }}>
                    %{item.percentage}
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
                        width: `${Math.round((item.sales / maxCategorySales) * 100)}%`,
                        height: '100%',
                        borderRadius: 999,
                        backgroundColor: item.color,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard
            title="En Çok Satan Ürünler"
            subtitle="Şubedeki en güçlü ürünler"
            action={<Chip label="Bugün" variant="outlined" sx={{ borderRadius: 3 }} />}
          >
            <Stack divider={<Divider flexItem />} spacing={0}>
              {data.topProducts.map((product, index) => (
                <Box
                  key={product.id}
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
                    {product.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {`${formatCount(product.soldCount, intlLocale)} adet`}
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {formatCurrency(product.revenue, intlLocale)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard
            title="Hızlı İşlemler"
            subtitle="Şube operasyonu için çalışan kısayollar"
          >
            <Stack spacing={1.1}>
              {data.quickActions.map((action) => {
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
                            {action.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {action.description}
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
            title="Mağaza Performansı"
            subtitle={`${selectedShopName} için öne çıkan operasyon metrikleri`}
            action={<Chip label="Bu Ay" variant="outlined" sx={{ borderRadius: 3 }} />}
          >
            <Stack divider={<Divider flexItem />} spacing={0}>
              {data.performance.map((item: ShopDashboardPerformanceItem) => (
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
                    {item.deltaText ? (
                      <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700 }}>
                        {item.deltaText}
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
            title="Azalan Stoktaki Ürünler"
            subtitle="Servisi etkileyebilecek kritik malzeme uyarıları"
            action={
              <Chip
                icon={<Inventory2OutlinedIcon sx={{ fontSize: '16px !important' }} />}
                label="Tüm Stokları Görüntüle"
                variant="outlined"
                sx={{ borderRadius: 3 }}
                onClick={() => router.push(withLocale(locale, ROUTES.stock) as Route)}
              />
            }
          >
            <Stack spacing={1.4}>
              {data.lowStock.map((item) => (
                <LowStockCard key={item.id} item={item} />
              ))}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <Box
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(191, 219, 254, 0.5)',
          backgroundColor: 'rgba(248, 250, 252, 0.75)',
          p: 2,
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} justifyContent="space-between">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningAmberRoundedIcon sx={{ color: '#0f766e', fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              Şube seçimi `shop scope` üzerinden geliyor. Gerçek mağaza verisi yoksa dropdown yalnızca mock şubelerle dolduruluyor; gerçek veri geldiğinde bu fallback kendiliğinden devreden çıkacak.
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Veri kaynağı: `modules/tenant/api/mock-shop-dashboard-data.ts`
          </Typography>
        </Stack>
      </Box>
    </Stack>
  )
}
