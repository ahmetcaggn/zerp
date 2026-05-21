'use client'

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined'
import InventoryIcon from '@mui/icons-material/Inventory'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PointOfSaleIcon from '@mui/icons-material/PointOfSale'
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import SendIcon from '@mui/icons-material/Send'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
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
  Area,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ROUTES, withLocale } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'

import { useSalesDashboard } from '../hooks/use-sales-dashboard'
import type {
  SalesDashboardInsightItem,
  SalesDashboardMetric,
  SalesDashboardSummaryItem,
} from '../types/sales-dashboard'

const metricStyles: Record<
  SalesDashboardMetric['id'],
  { accent: string; iconBg: string; iconColor: string; icon: ReactNode }
> = {
  totalSales: {
    accent: '#20b486',
    iconBg: 'rgba(32, 180, 134, 0.12)',
    iconColor: '#0f766e',
    icon: <PointOfSaleOutlinedIcon />,
  },
  averageBasket: {
    accent: '#3b82f6',
    iconBg: 'rgba(59, 130, 246, 0.12)',
    iconColor: '#1d4ed8',
    icon: <ShoppingBagOutlinedIcon />,
  },
  totalOrders: {
    accent: '#8b5cf6',
    iconBg: 'rgba(139, 92, 246, 0.12)',
    iconColor: '#7c3aed',
    icon: <LocalOfferOutlinedIcon />,
  },
  conversionRate: {
    accent: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.14)',
    iconColor: '#d97706',
    icon: <TrendingUpRoundedIcon />,
  },
  totalStores: {
    accent: '#2563eb',
    iconBg: 'rgba(37, 99, 235, 0.12)',
    iconColor: '#1d4ed8',
    icon: <StorefrontOutlinedIcon />,
  },
}

const summaryIcons: Record<string, ReactNode> = {
  'summary-total-sales': <PointOfSaleOutlinedIcon sx={{ fontSize: 18 }} />,
  'summary-total-orders': <ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} />,
  'summary-average-order': <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />,
  'summary-top-product': <LocalOfferOutlinedIcon sx={{ fontSize: 18 }} />,
  'summary-top-store': <StorefrontOutlinedIcon sx={{ fontSize: 18 }} />,
}

const insightStyles: Record<
  SalesDashboardInsightItem['tone'],
  { icon: ReactNode; bg: string; color: string }
> = {
  positive: {
    icon: <TrendingUpRoundedIcon sx={{ fontSize: 18 }} />,
    bg: 'rgba(32, 180, 134, 0.12)',
    color: '#0f766e',
  },
  info: {
    icon: <InsightsOutlinedIcon sx={{ fontSize: 18 }} />,
    bg: 'rgba(59, 130, 246, 0.12)',
    color: '#1d4ed8',
  },
  warning: {
    icon: <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />,
    bg: 'rgba(245, 158, 11, 0.14)',
    color: '#b45309',
  },
  report: {
    icon: <DownloadRoundedIcon sx={{ fontSize: 18 }} />,
    bg: 'rgba(139, 92, 246, 0.12)',
    color: '#7c3aed',
  },
}

const quickActionStyles: Record<
  string,
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
    maximumFractionDigits: 2,
  }).format(value)}`
}

function formatMetricValue(metric: SalesDashboardMetric | SalesDashboardSummaryItem, locale: string) {
  if (typeof metric.value === 'string') {
    return metric.value
  }

  if (metric.unit === 'currency') {
    return formatCurrency(metric.value, locale)
  }

  if (metric.unit === 'percent') {
    return formatPercent(metric.value, locale)
  }

  return formatCount(metric.value, locale)
}

function formatCompactCurrency(value: number, locale: string) {
  return `₺${new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)}`
}

function formatCompactCount(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
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
      <Skeleton variant="rounded" height={140} />
      <Grid container spacing={2}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 2.4 }}>
            <Skeleton variant="rounded" height={144} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Skeleton variant="rounded" height={360} />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <Skeleton variant="rounded" height={360} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" height={320} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" height={320} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Skeleton variant="rounded" height={320} />
        </Grid>
      </Grid>
    </Stack>
  )
}

function MetricCard({ metric, locale }: { metric: SalesDashboardMetric; locale: string }) {
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
          minHeight: { xs: 132, sm: 168 },
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
                fontSize: { xs: 'clamp(1.45rem, 6.5vw, 2rem)', sm: '2.125rem' },
                lineHeight: 1.05,
                whiteSpace: 'nowrap',
              }}
            >
              {formatMetricValue(metric, locale)}
            </Typography>
            <Box
              sx={{
                mt: 'auto',
                pt: { xs: 1, sm: 1.5 },
                minHeight: { xs: 34, sm: 44 },
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
                        delta.direction === 'up'
                          ? 'success.main'
                          : delta.direction === 'down'
                            ? 'error.main'
                            : 'text.secondary',
                    }}
                  >
                    {delta.direction === 'neutral'
                      ? delta.comparisonLabel
                      : `${formatMetricValue(
                          {
                            ...metric,
                            value: delta.value,
                            unit: delta.unit === 'percent' ? 'percent' : 'count',
                          },
                          locale,
                        )} ${delta.comparisonLabel}`}
                  </Typography>
                </Box>
              ) : null}
            </Box>
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

function SalesTooltip({
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
        {payload.map((item) => {
          const isSales = item.dataKey === 'sales'
          return (
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
                  ? isSales
                    ? formatCurrency(item.value, locale)
                    : formatCount(item.value, locale)
                  : '-'}
              </Typography>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}

export function TenantDashboardV2() {
  const { locale } = useI18n()
  const router = useRouter()
  const theme = useTheme()
  const { data, isLoading } = useSalesDashboard()
  const intlLocale = resolveIntlLocale(locale)
  const isDarkMode = theme.palette.mode === 'dark'

  if (isLoading || !data) {
    return <DashboardSkeleton />
  }

  const totalStores = data.cityDistribution.reduce((sum, item) => sum + item.storeCount, 0)
  const maxStoreSales = Math.max(1, ...data.storePerformance.map((item) => item.sales))
  const heroBorderColor = isDarkMode ? alpha('#67e8f9', 0.2) : 'rgba(191, 219, 254, 0.5)'
  const heroBackground = isDarkMode
    ? 'radial-gradient(circle at top left, rgba(32, 180, 134, 0.18), transparent 26%), linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(17, 24, 39, 0.96) 55%, rgba(6, 78, 59, 0.88) 100%)'
    : 'radial-gradient(circle at top left, rgba(32, 180, 134, 0.14), transparent 28%), linear-gradient(135deg, #ffffff 0%, #f8fbff 52%, #f5fffb 100%)'
  const heroChipBackground = isDarkMode ? alpha(theme.palette.common.white, 0.06) : 'rgba(255,255,255,0.88)'
  const heroOutlinedChipBackground = isDarkMode ? alpha(theme.palette.common.white, 0.04) : 'rgba(255,255,255,0.75)'

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
        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', xl: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', xl: 'center' }}
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
                <InsightsOutlinedIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -1 }}>
                  {data.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75, maxWidth: 680 }}>
                  {data.subtitle}
                </Typography>
              </Box>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap">
              <Chip
                icon={<StorefrontOutlinedIcon sx={{ fontSize: '18px !important' }} />}
                label={data.scopeLabel}
                sx={{
                  height: 42,
                  borderRadius: 3,
                  backgroundColor: heroChipBackground,
                  border: `1px solid ${alpha(theme.palette.common.white, isDarkMode ? 0.08 : 0)}`,
                }}
              />
              <Chip
                icon={<CalendarTodayOutlinedIcon sx={{ fontSize: '18px !important' }} />}
                label={data.reportDateLabel}
                sx={{
                  height: 42,
                  borderRadius: 3,
                  backgroundColor: heroChipBackground,
                  border: `1px solid ${alpha(theme.palette.common.white, isDarkMode ? 0.08 : 0)}`,
                }}
              />
              <Chip
                icon={<DownloadRoundedIcon sx={{ fontSize: '18px !important' }} />}
                label="Dışa Aktar"
                variant="outlined"
                sx={{
                  height: 42,
                  borderRadius: 3,
                  backgroundColor: heroOutlinedChipBackground,
                  borderColor: isDarkMode ? alpha(theme.palette.common.white, 0.18) : undefined,
                }}
              />
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.25}
            useFlexGap
            flexWrap="wrap"
            justifyContent="space-between"
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} useFlexGap flexWrap="wrap">
              <Chip label={`Kapsam: ${data.scopeLabel}`} variant="outlined" sx={{ borderRadius: 3 }} />
              <Chip label={`Periyot: ${data.rangeLabel}`} variant="outlined" sx={{ borderRadius: 3 }} />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Son güncelleme: {formatLastUpdated(data.lastUpdatedAt, intlLocale)}
            </Typography>
          </Stack>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        {data.metrics.map((metric) => (
          <Grid key={metric.id} size={{ xs: 6, sm: 6, lg: 2.4 }}>
            <MetricCard metric={metric} locale={intlLocale} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <SectionCard
            title="Satış İstatistikleri"
            subtitle="Son 6 aya ait toplam satış ve sipariş performansı"
            action={<Chip label={data.rangeLabel} variant="outlined" sx={{ borderRadius: 3 }} />}
          >
            <Stack direction="row" spacing={2.5} sx={{ mb: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 28, height: 3, borderRadius: 99, backgroundColor: '#20b486' }} />
                <Typography variant="caption" color="text.secondary">
                  Toplam Satış (₺)
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 28, height: 3, borderRadius: 99, backgroundColor: '#3b82f6' }} />
                <Typography variant="caption" color="text.secondary">
                  Sipariş Sayısı
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ height: 290 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.trend} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="sales-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#20b486" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#20b486" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.24)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="sales"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => formatCompactCurrency(value, intlLocale)}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    yAxisId="orders"
                    orientation="right"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => formatCompactCount(value, intlLocale)}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip content={<SalesTooltip locale={intlLocale} />} />
                  <Area
                    yAxisId="sales"
                    type="monotone"
                    dataKey="sales"
                    name="Toplam Satış"
                    stroke="#20b486"
                    strokeWidth={2.5}
                    fill="url(#sales-fill)"
                    dot={{ r: 4, fill: '#20b486', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="orders"
                    type="monotone"
                    dataKey="orders"
                    name="Sipariş Sayısı"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <SectionCard
            title="Mağazaların Şehirlere Göre Dağılımı"
            subtitle={`Toplam ${formatCount(totalStores, intlLocale)} mağaza`}
            action={<Chip label="Şehirlere Göre" variant="outlined" sx={{ borderRadius: 3 }} />}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'flex-start', md: 'center' }}
            >
              <Box sx={{ position: 'relative', width: 240, alignSelf: 'center' }}>
                <PieChart width={240} height={240}>
                  <Pie
                    data={data.cityDistribution}
                    dataKey="storeCount"
                    nameKey="city"
                    cx={120}
                    cy={120}
                    innerRadius={64}
                    outerRadius={96}
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {data.cityDistribution.map((item) => (
                      <Cell key={item.city} fill={item.color} />
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
                    {formatCount(totalStores, intlLocale)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Mağaza
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={1.25} sx={{ flex: 1, width: '100%' }}>
                {data.cityDistribution.map((item) => (
                  <Box
                    key={item.city}
                    sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}
                  >
                    <Box
                      sx={{
                        width: 11,
                        height: 11,
                        borderRadius: '999px',
                        backgroundColor: item.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }}>
                      {item.city}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {`${item.storeCount} (%${item.percentage.toFixed(1).replace('.0', '')})`}
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
            title="Mağazalara Göre Toplam Satışlar"
            subtitle="Bu aya ait toplam satış performansı"
            action={<Chip label="Bu Ay" variant="outlined" sx={{ borderRadius: 3 }} />}
          >
            <Stack spacing={2}>
              {data.storePerformance.map((store) => (
                <Box key={store.storeId}>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {store.storeName}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {formatCurrency(store.sales, intlLocale)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25, mb: 0.75 }}>
                    {`${formatCount(store.orderCount, intlLocale)} sipariş`}
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
                        width: `${Math.round((store.sales / maxStoreSales) * 100)}%`,
                        height: '100%',
                        borderRadius: 999,
                        background: 'linear-gradient(90deg, #20b486 0%, #67e8f9 100%)',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard title="Aylık Satış Özeti" subtitle="Bu aya ait özet bilgiler">
            <Stack divider={<Divider flexItem />} spacing={0}>
              {data.summary.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    py: 1.35,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 2,
                        backgroundColor: 'rgba(32, 180, 134, 0.10)',
                        color: '#0f766e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {summaryIcons[item.id] ?? <ReceiptLongOutlinedIcon sx={{ fontSize: 18 }} />}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700} textAlign="right">
                    {formatMetricValue(item, intlLocale)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <SectionCard title="Hızlı İşlemler" subtitle="Satış operasyonları için kısayollar">
            <Stack spacing={1.1}>
              {data.quickActions.map((action) => {
                const actionStyle = quickActionStyles[action.id] ?? {
                  icon: <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />,
                  bg: 'rgba(32, 180, 134, 0.12)',
                  color: '#0f766e',
                }

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
                            {action.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {action.description}
                          </Typography>
                        </Box>
                      </Box>
                      <ArrowForwardRoundedIcon
                        sx={{ fontSize: 18, color: '#64748b', flexShrink: 0 }}
                      />
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>

      <SectionCard
        title="Son İçgörüler"
        subtitle="Satış ve operasyon tarafındaki son hareketler"
        action={<Typography variant="body2" sx={{ color: '#0f766e', fontWeight: 700 }}>Tümünü Gör</Typography>}
      >
        <Grid container spacing={2}>
          {data.insights.map((insight) => {
            const style = insightStyles[insight.tone]
            return (
              <Grid key={insight.id} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Box
                  sx={{
                    borderRadius: 3,
                    border: '1px solid rgba(148, 163, 184, 0.24)',
                    p: 2,
                    height: '100%',
                    transition: 'border-color 0.18s ease',
                    '&:hover': {
                      borderColor: style.color,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2.5,
                        backgroundColor: style.bg,
                        color: style.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {style.icon}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={700}>
                        {insight.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {insight.timestampLabel}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {insight.description}
                  </Typography>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </SectionCard>

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
            <LocationOnOutlinedIcon sx={{ color: '#0f766e', fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary">
              Mock veri kaynağı ayrı bir dosyadan geliyor; gerçek backend geldiğinde sadece dashboard client içindeki veri kaynağını değiştirerek devam edebiliriz.
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Veri kaynağı: `modules/tenant/api/mock-sales-dashboard-data.ts`
          </Typography>
        </Stack>
      </Box>
    </Stack>
  )
}
