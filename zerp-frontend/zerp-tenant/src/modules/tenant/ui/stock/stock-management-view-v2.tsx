'use client'

import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import {
  alpha,
  Box,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import type { MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { useMemo, useRef, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { useI18n } from '@/core/i18n/i18n-provider'
import { useShopScope } from '@/core/providers/shop-scope-provider'

import { shopDashboardMockShops } from '../../api/mock-shop-dashboard-data'
import { useStockDashboard } from '../../hooks/use-stock-dashboard'
import type {
  StockDashboardCountRow,
  StockDashboardData,
  StockDashboardMetric,
  StockDashboardMovementType,
  StockDashboardMovementRow,
  StockDashboardQuickAction,
  StockDashboardResourceRow,
  StockDashboardTab,
} from '../../types/stock-dashboard'
import { StockCountFormDialog } from './stock-count-form-dialog'
import { StockMovementFormDialog } from './stock-movement-form-dialog'
import { StockResourceFormDialog } from './stock-resource-form-dialog'

const metricStyles: Record<
  StockDashboardMetric['id'],
  { icon: ReactNode; accent: string; iconBg: string; iconColor: string }
> = {
  resourceKinds: {
    icon: <Inventory2OutlinedIcon />,
    accent: '#20b486',
    iconBg: 'rgba(32, 180, 134, 0.12)',
    iconColor: '#0f766e',
  },
  totalQuantity: {
    icon: <Inventory2OutlinedIcon />,
    accent: '#3b82f6',
    iconBg: 'rgba(59, 130, 246, 0.12)',
    iconColor: '#1d4ed8',
  },
  inventoryValue: {
    icon: <TrendingUpRoundedIcon />,
    accent: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.14)',
    iconColor: '#d97706',
  },
  criticalResources: {
    icon: <WarningAmberRoundedIcon />,
    accent: '#ef4444',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    iconColor: '#dc2626',
  },
  pendingOrders: {
    icon: <AddRoundedIcon />,
    accent: '#8b5cf6',
    iconBg: 'rgba(139, 92, 246, 0.12)',
    iconColor: '#7c3aed',
  },
}

const quickActionIcons: Record<string, ReactNode> = {
  'add-resource': <AddRoundedIcon sx={{ fontSize: 18 }} />,
  'start-count': <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />,
  'stock-report': <TrendingUpRoundedIcon sx={{ fontSize: 18 }} />,
  'stock-movements': <ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />,
}

const movementTypeLabels: Record<StockDashboardMovementType, string> = {
  purchase: 'Satın Alma',
  sale: 'Satış',
  waste: 'İsraf',
  adjustment: 'Düzeltme',
  transfer: 'Transfer',
  return: 'İade',
  'count-adjustment': 'Sayım Düzeltmesi',
  consumption: 'Tüketim',
}

const movementFilterOptions = [
  { value: 'all', label: 'Tümü' },
  { value: 'purchase', label: 'Satın Alma' },
  { value: 'sale', label: 'Satış' },
  { value: 'waste', label: 'İsraf' },
  { value: 'adjustment', label: 'Düzeltme' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'return', label: 'İade' },
  { value: 'count-adjustment', label: 'Sayım Düzeltmesi' },
  { value: 'consumption', label: 'Tüketim' },
] as const

const calendarMonthNames = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
]

const calendarWeekdayLabels = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz']

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

function formatMetricValue(metric: StockDashboardMetric, locale: string) {
  if (typeof metric.value === 'string') {
    return metric.value
  }

  if (metric.unit === 'currency') {
    return formatCurrency(metric.value, locale)
  }

  return formatCount(metric.value, locale)
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

function normalizeDateFilterInput(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return ''
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed
  }

  const dottedMatch = trimmed.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/)
  if (dottedMatch) {
    const [, day, month, year] = dottedMatch
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  const normalizedText = trimmed
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('ş', 's')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
  const textMatch = normalizedText.match(/^(\d{1,2})\s+([a-z]+)\s+(\d{4})$/)
  if (textMatch) {
    const [, day, monthName, year] = textMatch
    const monthMap: Record<string, string> = {
      ocak: '01',
      subat: '02',
      mart: '03',
      nisan: '04',
      mayis: '05',
      haziran: '06',
      temmuz: '07',
      agustos: '08',
      eylul: '09',
      ekim: '10',
      kasim: '11',
      aralik: '12',
    }
    const month = monthMap[monthName]
    if (month) {
      return `${year}-${month}-${day.padStart(2, '0')}`
    }
  }

  return ''
}

function getCalendarMonthGrid(baseDate: Date) {
  const firstDayOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1)
  const firstWeekdayIndex = (firstDayOfMonth.getDay() + 6) % 7
  const gridStartDate = new Date(firstDayOfMonth)
  gridStartDate.setDate(firstDayOfMonth.getDate() - firstWeekdayIndex)

  return Array.from({ length: 42 }, (_, index) => {
    const nextDate = new Date(gridStartDate)
    nextDate.setDate(gridStartDate.getDate() + index)
    return nextDate
  })
}

function toIsoDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseIsoDate(value: string) {
  const normalizedValue = normalizeDateFilterInput(value)
  if (!normalizedValue) {
    return null
  }

  const [year, month, day] = normalizedValue.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatCalendarFieldValue(value: string) {
  const parsedDate = parseIsoDate(value)
  if (!parsedDate) {
    return ''
  }

  return `${String(parsedDate.getDate()).padStart(2, '0')} ${calendarMonthNames[parsedDate.getMonth()]} ${parsedDate.getFullYear()}`
}

function CalendarDateField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (nextValue: string) => void
}) {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const selectedDate = parseIsoDate(value)
  const [viewDate, setViewDate] = useState<Date>(selectedDate ?? new Date())
  const calendarDays = getCalendarMonthGrid(viewDate)
  const todayIsoDate = toIsoDateString(new Date())
  const selectedIsoDate = selectedDate ? toIsoDateString(selectedDate) : ''
  const open = Boolean(anchorEl)

  const handleOpen = (event: ReactMouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setViewDate(selectedDate ?? new Date())
  }

  const handleClose = () => setAnchorEl(null)

  const years = Array.from({ length: 9 }, (_, index) => new Date().getFullYear() - 4 + index)

  return (
    <>
      <Box sx={{ minWidth: { xs: '100%', md: 220 } }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75, px: 0.25 }}>
          {label}
        </Typography>
        <Box
          onClick={handleOpen}
          sx={{
            height: 56,
            borderRadius: 3,
            border: '1px solid rgba(148, 163, 184, 0.24)',
            px: 1.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            backgroundColor: isDarkMode ? alpha(theme.palette.common.white, 0.02) : alpha('#ffffff', 0.82),
            transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
            '&:hover': {
              borderColor: alpha('#20b486', 0.7),
              boxShadow: `0 0 0 3px ${alpha('#20b486', 0.12)}`,
            },
          }}
        >
          <Typography variant="body2" sx={{ color: value ? 'text.primary' : 'text.secondary', fontWeight: value ? 600 : 500 }}>
            {formatCalendarFieldValue(value) || 'Tarih seç'}
          </Typography>
          <CalendarTodayOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
        </Box>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 4,
              border: '1px solid rgba(148, 163, 184, 0.18)',
              backgroundColor: isDarkMode ? '#182235' : '#ffffff',
              boxShadow: isDarkMode
                ? '0 24px 48px rgba(2, 6, 23, 0.48)'
                : '0 24px 48px rgba(15, 23, 42, 0.14)',
              p: 2,
              width: 312,
            },
          },
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Stack direction="row" spacing={0.5}>
              <IconButton
                size="small"
                onClick={() => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}
                sx={{ border: '1px solid rgba(148, 163, 184, 0.18)' }}
              >
                <ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}
                sx={{ border: '1px solid rgba(148, 163, 184, 0.18)' }}
              >
                <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Select
                size="small"
                value={String(viewDate.getMonth())}
                onChange={(event) =>
                  setViewDate((current) => new Date(current.getFullYear(), Number(event.target.value), 1))
                }
                sx={{ minWidth: 116, borderRadius: 2.5 }}
              >
                {calendarMonthNames.map((month, index) => (
                  <MenuItem key={month} value={String(index)}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
              <Select
                size="small"
                value={String(viewDate.getFullYear())}
                onChange={(event) =>
                  setViewDate((current) => new Date(Number(event.target.value), current.getMonth(), 1))
                }
                sx={{ minWidth: 92, borderRadius: 2.5 }}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={String(year)}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 0.75,
            }}
          >
            {calendarWeekdayLabels.map((weekday) => (
              <Typography
                key={weekday}
                variant="caption"
                sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 700, py: 0.5 }}
              >
                {weekday}
              </Typography>
            ))}

            {calendarDays.map((day) => {
              const dayIsoDate = toIsoDateString(day)
              const isSelected = dayIsoDate === selectedIsoDate
              const isToday = dayIsoDate === todayIsoDate
              const isCurrentMonth = day.getMonth() === viewDate.getMonth()

              return (
                <Box
                  key={dayIsoDate}
                  onClick={() => {
                    onChange(dayIsoDate)
                    handleClose()
                  }}
                  sx={{
                    height: 36,
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected
                      ? '#04130f'
                      : isCurrentMonth
                        ? 'text.primary'
                        : 'text.disabled',
                    backgroundColor: isSelected
                      ? '#34d399'
                      : isToday
                        ? alpha('#34d399', 0.14)
                        : 'transparent',
                    border: isToday && !isSelected ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid transparent',
                    transition: 'all 0.18s ease',
                    '&:hover': {
                      backgroundColor: isSelected ? '#34d399' : alpha('#34d399', 0.1),
                    },
                  }}
                >
                  {day.getDate()}
                </Box>
              )
            })}
          </Box>
        </Stack>
      </Popover>
    </>
  )
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
            mb: 2.5,
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
      <Skeleton variant="rounded" height={120} />
      <Grid container spacing={2}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, xl: 2.4 }}>
            <Skeleton variant="rounded" height={138} />
          </Grid>
        ))}
      </Grid>
      <Skeleton variant="rounded" height={64} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <Skeleton variant="rounded" height={540} />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Skeleton variant="rounded" height={540} />
        </Grid>
      </Grid>
    </Stack>
  )
}

function MetricCard({ metric, locale }: { metric: StockDashboardMetric; locale: string }) {
  const style = metricStyles[metric.id]

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
      <CardContent sx={{ p: { xs: 1.75, sm: 2.5 }, minHeight: { xs: 132, sm: 148 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 0.75, minHeight: { xs: 36, sm: 40 }, fontSize: { xs: 13, sm: 14 } }}
            >
              {metric.label}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                letterSpacing: -0.8,
                fontSize: { xs: 'clamp(1.35rem, 6vw, 1.95rem)', sm: '2.125rem' },
                lineHeight: 1.05,
                whiteSpace: 'nowrap',
              }}
            >
              {formatMetricValue(metric, locale)}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 0.7, fontSize: { xs: 11, sm: 12 } }}
            >
              {metric.helperText}
            </Typography>
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

function StatusChip({ statusLabel, status }: { statusLabel: string; status: StockDashboardResourceRow['status'] }) {
  const tone =
    status === 'healthy'
      ? { bg: 'rgba(32, 180, 134, 0.12)', color: '#0f766e' }
      : status === 'low'
        ? { bg: 'rgba(245, 158, 11, 0.14)', color: '#d97706' }
        : { bg: 'rgba(239, 68, 68, 0.12)', color: '#dc2626' }

  return (
    <Chip
      label={statusLabel}
      size="small"
      sx={{
        height: 26,
        borderRadius: 2,
        backgroundColor: tone.bg,
        color: tone.color,
        fontWeight: 700,
      }}
    />
  )
}

function CountStatusChip({ label, status }: { label: string; status: StockDashboardCountRow['status'] }) {
  const tone =
    status === 'completed'
      ? { bg: 'rgba(32, 180, 134, 0.12)', color: '#0f766e' }
      : status === 'inProgress'
        ? { bg: 'rgba(59, 130, 246, 0.12)', color: '#1d4ed8' }
        : { bg: 'rgba(148, 163, 184, 0.14)', color: '#475569' }

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        height: 26,
        borderRadius: 2,
        backgroundColor: tone.bg,
        color: tone.color,
        fontWeight: 700,
      }}
    />
  )
}

function ResourceTable({
  rows,
  locale,
}: {
  rows: StockDashboardResourceRow[]
  locale: string
}) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box sx={{ minWidth: 1080 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '36px 1.3fr 0.85fr 0.65fr 0.7fr 0.95fr 0.8fr 0.85fr 0.8fr 72px',
            gap: 1,
            px: 2,
            py: 1.5,
            borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
          }}
        >
          <Checkbox size="small" sx={{ p: 0.5 }} />
          {[
            'Stok Adı',
            'Kategori',
            'Birim Türü',
            'Miktar',
            'Yeniden Sipariş Eşiği',
            'Birim Fiyat',
            'Stok Değeri',
            'Durum',
            'İşlemler',
          ].map((label) => (
            <Typography key={label} variant="caption" fontWeight={700} color="text.secondary">
              {label}
            </Typography>
          ))}
        </Box>

        {rows.map((row) => (
          <Box
            key={row.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '36px 1.3fr 0.85fr 0.65fr 0.7fr 0.95fr 0.8fr 0.85fr 0.8fr 72px',
              gap: 1,
              px: 2,
              py: 1.6,
              alignItems: 'center',
              borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
            }}
          >
            <Checkbox size="small" sx={{ p: 0.5 }} />
            <Typography variant="body2" fontWeight={600}>
              {row.name}
            </Typography>
            <Chip
              label={row.category}
              size="small"
              sx={{
                height: 26,
                borderRadius: 2,
                backgroundColor: alpha(row.categoryColor, 0.12),
                color: row.categoryColor,
                fontWeight: 700,
                justifySelf: 'start',
              }}
            />
            <Typography variant="body2">{row.unitType}</Typography>
            <Typography variant="body2">{formatCount(row.quantity, locale)}</Typography>
            <Typography variant="body2">{formatCount(row.reorderThreshold, locale)}</Typography>
            <Typography variant="body2">{formatCurrency(row.unitPrice, locale)}</Typography>
            <Typography variant="body2" fontWeight={700}>
              {formatCurrency(row.stockValue, locale)}
            </Typography>
            <StatusChip status={row.status} statusLabel={row.statusLabel} />
            <Stack direction="row" spacing={0.75} justifyContent="flex-end">
              <Chip label="Gör" size="small" variant="outlined" sx={{ borderRadius: 2 }} />
              <MoreHorizRoundedIcon sx={{ color: '#64748b', fontSize: 20 }} />
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

function MovementTable({ rows }: { rows: StockDashboardMovementRow[] }) {
  return (
    <Stack spacing={1.2}>
      {rows.map((row) => (
        <Box
          key={row.id}
          sx={{
            borderRadius: 3,
            border: '1px solid rgba(148, 163, 184, 0.18)',
            p: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 0.6 }}>
            <Typography variant="body2" fontWeight={700}>
              {row.resourceName}
            </Typography>
            <Typography variant="body2" fontWeight={700} color="primary.main">
              {row.quantityLabel}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {row.typeLabel} · {row.actor}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.6 }}>
            {row.timestampLabel}
          </Typography>
          {row.notes ? (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.35 }}>
              {row.notes}
            </Typography>
          ) : null}
        </Box>
      ))}
    </Stack>
  )
}

function PaginationBar({
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
}: {
  page: number
  rowsPerPage: number
  total: number
  onPageChange: (nextPage: number) => void
  onRowsPerPageChange: (nextRowsPerPage: number) => void
}) {
  const start = total === 0 ? 0 : page * rowsPerPage + 1
  const end = Math.min((page + 1) * rowsPerPage, total)
  const canGoBack = page > 0
  const canGoForward = end < total

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        mt: 2,
        flexWrap: 'wrap',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {`Toplam ${total} kayıt`}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1.25} useFlexGap flexWrap="wrap">
        <Typography variant="body2" color="text.secondary">
          Rows per page:
        </Typography>
        <Select
          value={String(rowsPerPage)}
          size="small"
          onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
          sx={{ minWidth: 82, borderRadius: 2 }}
        >
          {[5, 10, 20].map((value) => (
            <MenuItem key={value} value={String(value)}>
              {value}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="body2" color="text.secondary">
          {`${start}-${end} of ${total}`}
        </Typography>
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => onPageChange(page - 1)} disabled={!canGoBack}>
            <ChevronLeftRoundedIcon />
          </IconButton>
          <IconButton size="small" onClick={() => onPageChange(page + 1)} disabled={!canGoForward}>
            <ChevronRightRoundedIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  )
}

export function StockManagementViewV2() {
  const theme = useTheme()
  const { locale } = useI18n()
  const { scope } = useShopScope()
  const intlLocale = resolveIntlLocale(locale)
  const isDarkMode = theme.palette.mode === 'dark'
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : shopDashboardMockShops[0]?.id
  const { data, isLoading } = useStockDashboard(selectedShopId)

  const [activeTab, setActiveTab] = useState<StockDashboardTab>('resources')
  const [resourceSearch, setResourceSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [unitFilter, setUnitFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [movementSearch, setMovementSearch] = useState('')
  const [movementTypeFilter, setMovementTypeFilter] = useState('all')
  const [countStartDate, setCountStartDate] = useState('')
  const [countEndDate, setCountEndDate] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [resourceDialogOpen, setResourceDialogOpen] = useState(false)
  const [movementDialogOpen, setMovementDialogOpen] = useState(false)
  const [countDialogOpen, setCountDialogOpen] = useState(false)
  const stockListSectionRef = useRef<HTMLDivElement | null>(null)

  const resetPagination = () => setPage(0)

  const filteredResources = useMemo(() => {
    if (!data) return []

    return data.resources.filter((row) => {
      const normalizedSearch = resourceSearch.trim().toLocaleLowerCase('tr-TR')
      const searchMatch =
        normalizedSearch.length === 0 ||
        row.name.toLocaleLowerCase('tr-TR').includes(normalizedSearch) ||
        row.category.toLocaleLowerCase('tr-TR').includes(normalizedSearch)

      const categoryMatch =
        categoryFilter === 'all' ||
        row.category === data.categoryOptions.find((item) => item.value === categoryFilter)?.label
      const unitMatch = unitFilter === 'all' || row.unitType === unitFilter
      const statusMatch =
        statusFilter === 'all' ||
        (statusFilter === 'healthy' && row.status === 'healthy') ||
        (statusFilter === 'low' && row.status === 'low') ||
        (statusFilter === 'critical' && row.status === 'critical')

      return searchMatch && categoryMatch && unitMatch && statusMatch
    })
  }, [categoryFilter, data, resourceSearch, statusFilter, unitFilter])

  const movementTypeOptions = useMemo(() => {
    if (!data) return [{ value: 'all', label: 'Tümü' }]

    return [
      { value: 'all', label: 'Tümü' },
      ...Array.from(new Set(data.movements.map((row) => row.type))).map((type) => ({
        value: type,
        label: movementTypeLabels[type],
      })),
    ]
  }, [data])

  const filteredMovements = useMemo(() => {
    if (!data) return []

    const normalizedSearch = movementSearch.trim().toLocaleLowerCase('tr-TR')

    return data.movements.filter((row) => {
      const searchMatch =
        normalizedSearch.length === 0 ||
        row.resourceName.toLocaleLowerCase('tr-TR').includes(normalizedSearch) ||
        row.actor.toLocaleLowerCase('tr-TR').includes(normalizedSearch) ||
        row.typeLabel.toLocaleLowerCase('tr-TR').includes(normalizedSearch) ||
        row.notes?.toLocaleLowerCase('tr-TR').includes(normalizedSearch)

      const typeMatch = movementTypeFilter === 'all' || row.type === movementTypeFilter

      return searchMatch && typeMatch
    })
  }, [data, movementSearch, movementTypeFilter])

  const filteredCounts = useMemo(() => {
    if (!data) return []

    const normalizedStartDate = normalizeDateFilterInput(countStartDate)
    const normalizedEndDate = normalizeDateFilterInput(countEndDate)

    return data.counts.filter((row) => {
      const afterStart = !normalizedStartDate || row.countDate >= normalizedStartDate
      const beforeEnd = !normalizedEndDate || row.countDate <= normalizedEndDate
      return afterStart && beforeEnd
    })
  }, [countEndDate, countStartDate, data])

  const paginatedResources = useMemo(
    () => filteredResources.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredResources, page, rowsPerPage],
  )

  const paginatedMovements = useMemo(
    () => filteredMovements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredMovements, page, rowsPerPage],
  )

  const paginatedCounts = useMemo(
    () => filteredCounts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredCounts, page, rowsPerPage],
  )

  if (isLoading || !data) {
    return <DashboardSkeleton />
  }

  const heroBorderColor = isDarkMode ? alpha('#67e8f9', 0.2) : 'rgba(191, 219, 254, 0.5)'
  const heroBackground = isDarkMode
    ? 'radial-gradient(circle at top left, rgba(32, 180, 134, 0.18), transparent 28%), linear-gradient(135deg, rgba(15, 23, 42, 0.96) 0%, rgba(17, 24, 39, 0.96) 55%, rgba(30, 41, 59, 0.92) 100%)'
    : 'radial-gradient(circle at top left, rgba(32, 180, 134, 0.14), transparent 30%), linear-gradient(135deg, #ffffff 0%, #f8fbff 52%, #f5fffb 100%)'
  const distributionTotal = data.distribution.reduce((sum, item) => sum + item.count, 0)
  const handleTabChange = (tab: StockDashboardTab) => {
    setActiveTab(tab)
    resetPagination()
  }

  const handlePrimaryAction = () => {
    if (activeTab === 'resources') {
      setResourceDialogOpen(true)
      return
    }

    if (activeTab === 'movements') {
      setMovementDialogOpen(true)
      return
    }

    setCountDialogOpen(true)
  }

  const handleQuickActionClick = (action: StockDashboardQuickAction['id']) => {
    if (action === 'add-resource') {
      setActiveTab('resources')
      resetPagination()
      setResourceDialogOpen(true)
      return
    }

    if (action === 'stock-movements') {
      setActiveTab('movements')
      resetPagination()
      return
    }

    if (action === 'start-count') {
      setActiveTab('counts')
      resetPagination()
      setCountDialogOpen(true)
      return
    }

    setActiveTab('resources')
    setStatusFilter('critical')
    resetPagination()
  }

  const handleViewAllValuableResources = () => {
    setActiveTab('resources')
    resetPagination()

    window.setTimeout(() => {
      stockListSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 80)
  }

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
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: -1 }}>
              {data.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75 }}>
              {data.subtitle}
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
            <Chip
              icon={<CalendarTodayOutlinedIcon sx={{ fontSize: '18px !important' }} />}
              label={data.reportDateLabel}
              sx={{
                height: 42,
                borderRadius: 3,
                backgroundColor: isDarkMode
                  ? alpha(theme.palette.common.white, 0.06)
                  : 'rgba(255,255,255,0.88)',
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

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
          pb: 0.5,
        }}
      >
        {data.tabs.map((tab) => {
          const active = activeTab === tab.key
          return (
            <Box
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              sx={{
                px: 1.5,
                py: 1,
                borderBottom: '2px solid',
                borderColor: active ? '#20b486' : 'transparent',
                color: active ? '#0f766e' : 'text.secondary',
                cursor: 'pointer',
                fontWeight: active ? 700 : 500,
              }}
            >
              <Typography variant="body2" fontWeight="inherit">
                {tab.label}
              </Typography>
            </Box>
          )
        })}
      </Box>

      <Grid container spacing={2}>
        {data.metrics.map((metric) => (
          <Grid key={metric.id} size={{ xs: 6, sm: 6, xl: 2.4 }}>
            <MetricCard metric={metric} locale={intlLocale} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <Stack spacing={2}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 4,
                borderColor: 'rgba(148, 163, 184, 0.24)',
                boxShadow: '0 18px 45px rgba(15, 23, 42, 0.04)',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                {activeTab === 'resources' ? (
                <Stack direction={{ xs: 'column', xl: 'row' }} spacing={1.5}>
                  <TextField
                    fullWidth
                    placeholder={data.searchPlaceholder}
                    value={resourceSearch}
                    onChange={(event) => {
                      setResourceSearch(event.target.value)
                      resetPagination()
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchRoundedIcon sx={{ color: '#64748b' }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Kategori</InputLabel>
                    <Select
                      value={categoryFilter}
                      label="Kategori"
                      onChange={(event) => {
                        setCategoryFilter(event.target.value)
                        resetPagination()
                      }}
                    >
                      {data.categoryOptions.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Birim Türü</InputLabel>
                    <Select
                      value={unitFilter}
                      label="Birim Türü"
                      onChange={(event) => {
                        setUnitFilter(event.target.value)
                        resetPagination()
                      }}
                    >
                      {data.unitOptions.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Stok Durumu</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Stok Durumu"
                      onChange={(event) => {
                        setStatusFilter(event.target.value)
                        resetPagination()
                      }}
                    >
                      {data.statusOptions.map((item) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Chip
                    icon={<FilterAltOutlinedIcon sx={{ fontSize: '16px !important' }} />}
                    label="Filtrele"
                    variant="outlined"
                    sx={{ height: 40, borderRadius: 3 }}
                  />
                </Stack>
                ) : activeTab === 'movements' ? (
                  <Stack direction={{ xs: 'column', xl: 'row' }} spacing={1.5}>
                    <TextField
                      fullWidth
                      placeholder="Hareket ara..."
                      value={movementSearch}
                      onChange={(event) => {
                        setMovementSearch(event.target.value)
                        resetPagination()
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchRoundedIcon sx={{ color: '#64748b' }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <FormControl size="small" sx={{ minWidth: 220 }}>
                      <InputLabel>Düzenleme Türü</InputLabel>
                      <Select
                        value={movementTypeFilter}
                        label="Düzenleme Türü"
                        onChange={(event) => {
                          setMovementTypeFilter(event.target.value)
                          resetPagination()
                        }}
                      >
                        {movementFilterOptions.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                ) : (
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
                    <CalendarDateField
                      label="Başlangıç Tarihi"
                      value={countStartDate}
                      onChange={(nextValue) => {
                        setCountStartDate(nextValue)
                        resetPagination()
                      }}
                    />
                    <CalendarDateField
                      label="Bitiş Tarihi"
                      value={countEndDate}
                      onChange={(nextValue) => {
                        setCountEndDate(nextValue)
                        resetPagination()
                      }}
                    />
                    <TextField
                      label="Başlangıç Tarihi"
                      placeholder="15.05.2026"
                      value={countStartDate}
                      onChange={(event) => {
                        setCountStartDate(event.target.value)
                        resetPagination()
                      }}
                      sx={{ display: 'none', minWidth: { xs: '100%', md: 220 } }}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <TextField
                      label="Bitiş Tarihi"
                      placeholder="15.05.2026"
                      value={countEndDate}
                      onChange={(event) => {
                        setCountEndDate(event.target.value)
                        resetPagination()
                      }}
                      sx={{ display: 'none', minWidth: { xs: '100%', md: 220 } }}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <Chip
                      label="Temizle"
                      variant="outlined"
                      onClick={() => {
                        setCountStartDate('')
                        setCountEndDate('')
                        resetPagination()
                      }}
                      sx={{ height: 40, borderRadius: 3, alignSelf: { xs: 'stretch', md: 'center' } }}
                    />
                  </Stack>
                )}
              </CardContent>
            </Card>

            <Box ref={stockListSectionRef}>
            <SectionCard
              title={
                activeTab === 'resources'
                  ? 'Stok Listesi'
                  : activeTab === 'movements'
                    ? 'Stok Hareketleri'
                    : 'Stok Sayımları'
              }
              subtitle={
                activeTab === 'resources'
                  ? `Toplam ${formatCount(filteredResources.length, intlLocale)} stok`
                  : activeTab === 'movements'
                    ? 'Son stok hareket kayıtları'
                    : 'Yaklaşan ve tamamlanan sayımlar'
              }
              action={
                <Chip
                  icon={<AddRoundedIcon sx={{ fontSize: '16px !important' }} />}
                  label={
                    activeTab === 'resources'
                      ? 'Stok Ekle'
                      : activeTab === 'movements'
                        ? 'Hareket Ekle'
                        : 'Sayım Başlat'
                  }
                  onClick={handlePrimaryAction}
                  sx={{
                    height: 40,
                    borderRadius: 3,
                    backgroundColor: '#0f766e',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                />
              }
            >
              {activeTab === 'resources' ? (
                <>
                  <ResourceTable rows={paginatedResources} locale={intlLocale} />
                  <PaginationBar
                    page={page}
                    rowsPerPage={rowsPerPage}
                    total={filteredResources.length}
                    onPageChange={setPage}
                    onRowsPerPageChange={(value) => {
                      setRowsPerPage(value)
                      setPage(0)
                    }}
                  />
                </>
              ) : activeTab === 'movements' ? (
                <>
                  <MovementTable rows={paginatedMovements} />
                  <PaginationBar
                    page={page}
                    rowsPerPage={rowsPerPage}
                    total={filteredMovements.length}
                    onPageChange={setPage}
                    onRowsPerPageChange={(value) => {
                      setRowsPerPage(value)
                      setPage(0)
                    }}
                  />
                </>
              ) : (
                <>
                  <Stack spacing={1.2}>
                    {paginatedCounts.map((count) => (
                      <Box
                        key={count.id}
                        sx={{
                          borderRadius: 3,
                          border: '1px solid rgba(148, 163, 184, 0.18)',
                          p: 2,
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: 2,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight={700}>
                            {count.countDateLabel}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {count.responsible}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1.25} alignItems="center" useFlexGap flexWrap="wrap">
                          <Typography variant="body2" color="text.secondary">
                            {count.discrepancyLabel}
                          </Typography>
                          <CountStatusChip label={count.statusLabel} status={count.status} />
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                  <PaginationBar
                    page={page}
                    rowsPerPage={rowsPerPage}
                    total={filteredCounts.length}
                    onPageChange={setPage}
                    onRowsPerPageChange={(value) => {
                      setRowsPerPage(value)
                      setPage(0)
                    }}
                  />
                </>
              )}
            </SectionCard>
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack spacing={2}>
            <SectionCard title="Stok Durum Dağılımı">
              <Box sx={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.distribution}
                      dataKey="count"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={78}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {data.distribution.map((item) => (
                        <Cell key={item.label} fill={item.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <Box
                  sx={{
                    position: 'relative',
                    mt: '-128px',
                    mb: '88px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1 }}>
                    {formatCount(distributionTotal, intlLocale)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam
                  </Typography>
                </Box>
              </Box>
              <Stack spacing={1.1}>
                {data.distribution.map((item) => (
                  <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1.1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '999px',
                        backgroundColor: item.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {`${item.count} (%${item.percentage})`}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </SectionCard>

            <SectionCard
              title="En Değerli Stoklar"
              action={
                <Typography
                  variant="body2"
                  onClick={handleViewAllValuableResources}
                  sx={{ color: '#0f766e', fontWeight: 700, cursor: 'pointer' }}
                >
                  Tümünü Gör
                </Typography>
              }
            >
              <Stack spacing={1.2}>
                {data.valuableResources.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {formatCurrency(item.value, intlLocale)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </SectionCard>

            <SectionCard title="Hızlı İşlemler">
              <Stack spacing={1}>
                {data.quickActions.map((action) => (
                  <Box
                    key={action.id}
                    onClick={() => handleQuickActionClick(action.id)}
                    sx={{
                      borderRadius: 3,
                      border: '1px solid rgba(148, 163, 184, 0.18)',
                      px: 1.4,
                      py: 1.2,
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      '&:hover': {
                        borderColor: '#20b486',
                        backgroundColor: 'rgba(32, 180, 134, 0.04)',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.25 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.1, minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 34,
                            height: 34,
                            borderRadius: 2,
                            backgroundColor: 'rgba(32, 180, 134, 0.12)',
                            color: '#0f766e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {quickActionIcons[action.id]}
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
                ))}
              </Stack>
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 4,
          borderColor: alpha('#f59e0b', 0.24),
          backgroundColor: alpha('#f59e0b', 0.06),
          boxShadow: '0 16px 30px rgba(245, 158, 11, 0.08)',
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.5}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <WarningAmberRoundedIcon sx={{ color: '#d97706' }} />
              <Box>
                <Typography variant="body1" fontWeight={700}>
                  {data.alert.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.alert.description}
                </Typography>
              </Box>
            </Box>
            <Chip
              label={data.alert.ctaLabel}
              variant="outlined"
              sx={{
                height: 40,
                borderRadius: 3,
                borderColor: alpha('#d97706', 0.35),
                color: '#d97706',
                fontWeight: 700,
              }}
            />
          </Stack>
        </CardContent>
      </Card>

      {resourceDialogOpen ? (
        <StockResourceFormDialog
          open={resourceDialogOpen}
          onClose={() => setResourceDialogOpen(false)}
          initialData={null}
        />
      ) : null}

      {movementDialogOpen ? (
        <StockMovementFormDialog open={movementDialogOpen} onClose={() => setMovementDialogOpen(false)} />
      ) : null}

      {countDialogOpen ? (
        <StockCountFormDialog open={countDialogOpen} onClose={() => setCountDialogOpen(false)} />
      ) : null}
    </Stack>
  )
}
