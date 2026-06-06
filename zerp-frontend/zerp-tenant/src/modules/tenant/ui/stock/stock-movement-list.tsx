'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'
import { PermissionActions, useCurrentUserPermissions } from '@/core/permissions/use-permissions'
import { useShopScope } from '@/core/providers/shop-scope-provider'
import { formatDate } from '@/core/utils/date-formatter'

import {
  useStockMovementDrillDown,
  useStockMovementTimeline,
} from '../../hooks/use-stock-movements'
import { useStockOverview, useStockResources } from '../../hooks/use-stock-resources'
import type {
  StockMovementResponseDto,
  StockMovementTimelineBucket,
  StockMovementTimelineBucketResponseDto,
} from '../../types/stock'
import { StockMovementFormDialog } from './stock-movement-form-dialog'

const ALL_STOCK_TYPES = 'ALL'
const MIN_CHART_WIDTH = 920
const CHART_HEIGHT = 340

function toNumber(value: number | string | null | undefined): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function roundQuantity(value: number, precision = 6): number {
  if (!Number.isFinite(value)) return 0
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

function getSignedMovement(movement: StockMovementResponseDto): number {
  const quantity = toNumber(movement.quantity)
  if (movement.direction === 'IN') return roundQuantity(quantity)
  if (movement.direction === 'OUT') return roundQuantity(-quantity)

  if (movement.type === 'PURCHASE' || movement.type === 'RETURN') return roundQuantity(quantity)
  if (movement.type === 'SALE' || movement.type === 'WASTE' || movement.type === 'TRANSFER')
    return roundQuantity(-quantity)

  return roundQuantity(toNumber(movement.newQuantity) - toNumber(movement.previousQuantity))
}

function formatSignedQuantity(value: number, localeCode: string): string {
  const normalized = roundQuantity(value)
  if (normalized === 0) {
    return '0'
  }
  const formatted = new Intl.NumberFormat(localeCode, { maximumFractionDigits: 6 }).format(
    Math.abs(normalized),
  )
  return normalized > 0 ? `+${formatted}` : `-${formatted}`
}

function formatQuantity(value: number | string | null | undefined, localeCode: string): string {
  return new Intl.NumberFormat(localeCode, { maximumFractionDigits: 6 }).format(
    roundQuantity(toNumber(value)),
  )
}

function formatDateTime(value: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function toApiLocalDateTime(value: Date): string {
  const y = value.getFullYear()
  const m = String(value.getMonth() + 1).padStart(2, '0')
  const d = String(value.getDate()).padStart(2, '0')
  const h = String(value.getHours()).padStart(2, '0')
  const min = String(value.getMinutes()).padStart(2, '0')
  const s = String(value.getSeconds()).padStart(2, '0')
  return `${y}-${m}-${d}T${h}:${min}:${s}`
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
}

function startOfWeek(date: Date): Date {
  const day = date.getDay()
  const diffToMonday = day === 0 ? 6 : day - 1
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - diffToMonday, 0, 0, 0, 0)
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0)
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function addMonths(date: Date, months: number): Date {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}

function getPeriodRange(
  period: StockMovementTimelineBucket,
  cursor: Date,
): { from: Date; to: Date } {
  if (period === 'DAY') {
    const from = startOfDay(cursor)
    return { from, to: addDays(from, 1) }
  }
  if (period === 'WEEK') {
    const from = startOfWeek(cursor)
    return { from, to: addDays(from, 7) }
  }
  const from = startOfMonth(cursor)
  return { from, to: addDays(from, 28) }
}

function shiftCursor(period: StockMovementTimelineBucket, cursor: Date, direction: -1 | 1): Date {
  if (period === 'DAY') return addDays(cursor, direction)
  if (period === 'WEEK') return addDays(cursor, direction * 7)
  return addMonths(cursor, direction)
}

function formatDateInputValue(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatMonthInputValue(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

function parseDateInputValue(value: string): Date | null {
  if (!value) return null
  const parsed = new Date(`${value}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function parseMonthInputValue(value: string): Date | null {
  if (!value) return null
  const parsed = new Date(`${value}-01T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function resolveTimelineBucket(period: StockMovementTimelineBucket): StockMovementTimelineBucket {
  if (period === 'MONTH') return 'WEEK'
  return 'DAY'
}

function formatBucketLabel(
  bucket: StockMovementTimelineBucketResponseDto,
  period: StockMovementTimelineBucket,
  locale: 'tr' | 'en',
): string {
  const start = new Date(bucket.bucketStart)
  if (period === 'MONTH') {
    return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
      month: 'short',
      year: 'numeric',
    }).format(start)
  }
  if (period === 'WEEK') {
    const end = new Date(bucket.bucketEnd)
    const endInclusive = new Date(end.getTime() - 1)
    const dayMonth = new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
      day: '2-digit',
      month: 'short',
    })
    const endWithYear = new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    })
    if (start.getFullYear() !== endInclusive.getFullYear()) {
      return `${endWithYear.format(start)} - ${endWithYear.format(endInclusive)}`
    }
    return `${dayMonth.format(start)} - ${endWithYear.format(endInclusive)}`
  }
  return formatDate(start, locale)
}

function formatBucketLabelParts(
  bucket: StockMovementTimelineBucketResponseDto,
  bucketType: StockMovementTimelineBucket,
  locale: 'tr' | 'en',
): { top: string; bottom: string } {
  const localeCode = locale === 'tr' ? 'tr-TR' : 'en-US'
  const start = new Date(bucket.bucketStart)
  const end = new Date(bucket.bucketEnd)
  const endInclusive = new Date(end.getTime() - 1)

  if (bucketType === 'DAY') {
    const dayName = new Intl.DateTimeFormat(localeCode, { weekday: 'short' }).format(start)
    const dayDate = new Intl.DateTimeFormat(localeCode, { day: '2-digit', month: 'short' }).format(
      start,
    )
    return { top: dayName, bottom: dayDate }
  }

  const top = `${String(start.getDate()).padStart(2, '0')}-${String(endInclusive.getDate()).padStart(2, '0')}`
  const bottom = new Intl.DateTimeFormat(localeCode, { month: 'short', year: '2-digit' }).format(
    start,
  )
  return { top, bottom }
}

interface StockMovementListProps {
  mode?: 'movement' | 'tracking'
}

export function StockMovementList({ mode = 'movement' }: StockMovementListProps) {
  const { t, locale } = useI18n()
  const { scope } = useShopScope()
  const selectedShopId = scope.mode === 'SHOP' ? scope.shopId : undefined
  const { hasShopPermission } = useCurrentUserPermissions()
  const canReadResources = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.READ_STOCK_RESOURCE, selectedShopId),
  )
  const canReadMovements = Boolean(
    selectedShopId && hasShopPermission(PermissionActions.READ_STOCK_MOVEMENT, selectedShopId),
  )
  const canCreateMovement = Boolean(
    selectedShopId &&
    (hasShopPermission(PermissionActions.CREATE_STOCK_MOVEMENT, selectedShopId) ||
      hasShopPermission(PermissionActions.CREATE_STOCK_WASTE, selectedShopId) ||
      hasShopPermission(PermissionActions.CREATE_STOCK_RETURN, selectedShopId)),
  )
  const isTrackingMode = mode === 'tracking'

  const [period, setPeriod] = useState<StockMovementTimelineBucket>('WEEK')
  const [selectedStockType, setSelectedStockType] = useState<string>(ALL_STOCK_TYPES)
  const [cursorDate, setCursorDate] = useState<Date>(() => new Date())
  const [selectedBucketStart, setSelectedBucketStart] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formOpen, setFormOpen] = useState(false)

  const periodRange = useMemo(() => getPeriodRange(period, cursorDate), [period, cursorDate])
  const rangeFromIso = toApiLocalDateTime(periodRange.from)
  const rangeToIso = toApiLocalDateTime(periodRange.to)
  const timelineBucket = useMemo(() => resolveTimelineBucket(period), [period])
  const selectedStockResourceId =
    selectedStockType === ALL_STOCK_TYPES ? undefined : selectedStockType

  const { data: resourcesData } = useStockResources(
    {
      pagination: { page: 1, perPage: 300 },
      sort: { field: 'name', order: 'ASC' },
      ...(selectedShopId ? { filter: { 'shop.id': selectedShopId } } : {}),
    },
    { enabled: canReadResources },
  )
  const { data: overviewData } = useStockOverview(selectedShopId, { enabled: canReadResources })

  const {
    data: timeline,
    isLoading: isLoadingTimeline,
    isFetching: isFetchingTimeline,
  } = useStockMovementTimeline({
    shopId: selectedShopId,
    stockResourceId: selectedStockResourceId,
    from: rangeFromIso,
    to: rangeToIso,
    bucket: timelineBucket,
    enabled: canReadMovements,
  })

  const selectedBucket = useMemo(
    () => timeline?.buckets.find((bucket) => bucket.bucketStart === selectedBucketStart),
    [selectedBucketStart, timeline?.buckets],
  )

  const drillDownFrom = selectedBucket?.bucketStart ?? rangeFromIso
  const drillDownTo = selectedBucket?.bucketEnd ?? rangeToIso

  const {
    data: drillDownMovements,
    isLoading: isLoadingDrillDown,
    isFetching: isFetchingDrillDown,
  } = useStockMovementDrillDown({
    shopId: selectedShopId,
    stockResourceId: selectedStockResourceId,
    from: drillDownFrom,
    to: drillDownTo,
    limit: 1000,
    enabled: canReadMovements,
  })

  const { data: chartRangeMovements, isLoading: isLoadingChartRangeMovements } =
    useStockMovementDrillDown({
      shopId: selectedShopId,
      stockResourceId: selectedStockResourceId,
      from: rangeFromIso,
      to: rangeToIso,
      limit: 3000,
      enabled: canReadMovements,
    })

  useEffect(() => {
    setSelectedBucketStart(null)
  }, [period, selectedStockType, cursorDate])

  useEffect(() => {
    setPage(0)
  }, [rowsPerPage, selectedBucketStart, period, selectedStockType])

  const chartPoints = timeline?.buckets ?? []
  const chartPointsWithFlows = useMemo(() => {
    const points = chartPoints.map((point) => ({
      ...point,
      inflow: 0,
      outflow: 0,
    }))
    const sourceMovements = chartRangeMovements ?? []
    if (!points.length || !sourceMovements.length) {
      return points
    }

    const ranges = points.map((point) => ({
      startMs: new Date(point.bucketStart).getTime(),
      endMs: new Date(point.bucketEnd).getTime(),
    }))

    for (const movement of sourceMovements) {
      if (!movement.createdAt) continue
      const createdAtMs = new Date(movement.createdAt).getTime()
      if (!Number.isFinite(createdAtMs)) continue

      const bucketIndex = ranges.findIndex(
        (range) => createdAtMs >= range.startMs && createdAtMs < range.endMs,
      )
      if (bucketIndex < 0) continue

      const signed = getSignedMovement(movement)
      if (signed >= 0) {
        points[bucketIndex].inflow = roundQuantity(points[bucketIndex].inflow + signed)
      } else {
        points[bucketIndex].outflow = roundQuantity(points[bucketIndex].outflow + Math.abs(signed))
      }
    }

    return points
  }, [chartPoints, chartRangeMovements])
  const chartWidth = useMemo(() => {
    const points = Math.max(1, chartPoints.length)
    const pointSpacing = timelineBucket === 'DAY' ? 112 : 156
    const dynamicWidth = points * pointSpacing + 140
    return Math.max(MIN_CHART_WIDTH, dynamicWidth)
  }, [chartPointsWithFlows.length, timelineBucket])

  const yMinMax = useMemo(() => {
    if (!chartPointsWithFlows.length) return { min: -1, max: 1 }
    const values = chartPointsWithFlows.flatMap((point) => [point.inflow, -point.outflow, 0])
    let min = Math.min(...values)
    let max = Math.max(...values)
    if (min === max) {
      min -= 1
      max += 1
    }
    return { min, max }
  }, [chartPointsWithFlows])

  const chartLayout = useMemo(() => {
    const padding = { top: 24, right: 20, bottom: 74, left: 58 }
    const plotWidth = chartWidth - padding.left - padding.right
    const plotHeight = CHART_HEIGHT - padding.top - padding.bottom
    const pointCount = chartPointsWithFlows.length
    const scaleY = (value: number) =>
      padding.top + ((yMinMax.max - value) / (yMinMax.max - yMinMax.min)) * plotHeight
    const scaleX = (index: number) =>
      pointCount <= 1
        ? padding.left + plotWidth / 2
        : padding.left + (index / (pointCount - 1)) * plotWidth

    return { padding, plotWidth, plotHeight, pointCount, scaleX, scaleY }
  }, [chartPointsWithFlows.length, chartWidth, yMinMax.max, yMinMax.min])

  const yTicks = useMemo(() => {
    const steps = 4
    const values: number[] = []
    for (let i = 0; i <= steps; i += 1) {
      const ratio = i / steps
      values.push(yMinMax.max - (yMinMax.max - yMinMax.min) * ratio)
    }
    return values
  }, [yMinMax.max, yMinMax.min])

  const handlePeriodChange = (
    _: React.MouseEvent<HTMLElement>,
    nextValue: StockMovementTimelineBucket | null,
  ) => {
    if (nextValue) {
      setPeriod(nextValue)
    }
  }

  const handleStockTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedStockType(event.target.value)
  }

  const movements = drillDownMovements ?? []
  const pagedMovements = useMemo(() => {
    const start = page * rowsPerPage
    return movements.slice(start, start + rowsPerPage)
  }, [movements, page, rowsPerPage])

  const localeCode = locale === 'tr' ? 'tr-TR' : 'en-US'
  const isLoading = isLoadingTimeline || isLoadingDrillDown
  const isFetching = isFetchingTimeline || isFetchingDrillDown
  const isLoadingChart = isLoadingTimeline || isLoadingChartRangeMovements

  const listRangeLabel = selectedBucket
    ? `${formatDate(new Date(selectedBucket.bucketStart), locale)} - ${formatDate(new Date(new Date(selectedBucket.bucketEnd).getTime() - 1), locale)}`
    : `${formatDate(new Date(rangeFromIso), locale)} - ${formatDate(new Date(rangeToIso), locale)}`

  const selectedPeriodLabel = useMemo(() => {
    if (period === 'DAY') {
      return formatDate(startOfDay(cursorDate), locale)
    }
    if (period === 'WEEK') {
      const from = startOfWeek(cursorDate)
      const to = addDays(from, 6)
      return `${formatDate(from, locale)} - ${formatDate(to, locale)}`
    }
    return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
      month: 'long',
      year: 'numeric',
    }).format(startOfMonth(cursorDate))
  }, [cursorDate, locale, period])

  const selectedOverview = useMemo(() => {
    const overview = overviewData ?? []
    if (!overview.length) {
      return { real: 0, expected: 0 }
    }
    if (selectedStockResourceId) {
      const item = overview.find((entry) => entry.stockResourceId === selectedStockResourceId)
      return {
        real: item?.realQuantity ?? 0,
        expected: item?.expectedQuantity ?? 0,
      }
    }
    return overview.reduce(
      (acc, item) => ({
        real: acc.real + Number(item.realQuantity ?? 0),
        expected: acc.expected + Number(item.expectedQuantity ?? 0),
      }),
      { real: 0, expected: 0 },
    )
  }, [overviewData, selectedStockResourceId])

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          {isTrackingMode ? t('stock.tabs.graphTracking') : t('stock.tabs.movements')}
        </Typography>
        {!isTrackingMode && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disabled={!canCreateMovement}
            onClick={() => setFormOpen(true)}
          >
            {t('stock.movement.createButton')}
          </Button>
        )}
      </Box>

      {!isTrackingMode && (
        <Alert severity="info" sx={{ mb: 2 }}>
          This ledger tracks expected changes only and does not directly update real stock.
        </Alert>
      )}

      {!canReadMovements && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('common.unauthorized')}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('stock.movement.filters.period')}
            </Typography>
            <ToggleButtonGroup size="small" exclusive value={period} onChange={handlePeriodChange}>
              <ToggleButton value="DAY">{t('stock.movement.filters.periods.DAY')}</ToggleButton>
              <ToggleButton value="WEEK">{t('stock.movement.filters.periods.WEEK')}</ToggleButton>
              <ToggleButton value="MONTH">{t('stock.movement.filters.periods.MONTH')}</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <FormControl size="small" sx={{ minWidth: 240 }}>
            <InputLabel>{t('stock.movement.filters.stockType')}</InputLabel>
            <Select
              label={t('stock.movement.filters.stockType')}
              value={selectedStockType}
              onChange={handleStockTypeChange}
            >
              <MenuItem value={ALL_STOCK_TYPES}>
                {t('stock.movement.filters.allStockTypes')}
              </MenuItem>
              {resourcesData?.data?.map((resource) => (
                <MenuItem key={resource.id} value={resource.id}>
                  {resource.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              size="small"
              onClick={() => setCursorDate((prev) => shiftCursor(period, prev, -1))}
            >
              <ChevronLeftIcon fontSize="small" />
              {t('stock.movement.filters.previous')}
            </Button>
            {period === 'MONTH' ? (
              <TextField
                size="small"
                type="month"
                label={t('stock.movement.filters.selectedMonth')}
                value={formatMonthInputValue(cursorDate)}
                onChange={(e) => {
                  const parsed = parseMonthInputValue(e.target.value)
                  if (parsed) setCursorDate(parsed)
                }}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 180 }}
              />
            ) : (
              <TextField
                size="small"
                type="date"
                label={
                  period === 'DAY'
                    ? t('stock.movement.filters.selectedDay')
                    : t('stock.movement.filters.selectedWeek')
                }
                value={formatDateInputValue(cursorDate)}
                onChange={(e) => {
                  const parsed = parseDateInputValue(e.target.value)
                  if (parsed) setCursorDate(parsed)
                }}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 170 }}
              />
            )}
            <Button
              size="small"
              onClick={() => setCursorDate((prev) => shiftCursor(period, prev, 1))}
            >
              {t('stock.movement.filters.next')}
              <ChevronRightIcon fontSize="small" />
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 180 }}>
              {selectedPeriodLabel}
            </Typography>
          </Box>
          {selectedBucket && (
            <Button size="small" onClick={() => setSelectedBucketStart(null)}>
              {t('stock.movement.drillDown.clear')}
            </Button>
          )}
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: '#f8fbf8' }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {t('stock.movement.chart.title')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {selectedStockResourceId && (
              <>
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    px: 1.25,
                    py: 0.5,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {t('stock.resource.table.realStock')}:{' '}
                    {new Intl.NumberFormat(localeCode, { maximumFractionDigits: 2 }).format(
                      selectedOverview.real,
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    px: 1.25,
                    py: 0.5,
                    bgcolor: 'background.paper',
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    {t('stock.resource.table.expectedStock')}:{' '}
                    {new Intl.NumberFormat(localeCode, { maximumFractionDigits: 2 }).format(
                      selectedOverview.expected,
                    )}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
        {isLoadingChart ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : !chartPointsWithFlows.length ? (
          <Typography variant="body2" color="text.secondary">
            {t('stock.movement.chart.emptyState')}
          </Typography>
        ) : (
          <Box
            sx={{
              width: '100%',
              overflowX: 'auto',
              borderRadius: 2,
              bgcolor: 'background.paper',
              p: 1,
            }}
          >
            <svg
              viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
              width="100%"
              role="img"
              aria-label={t('stock.movement.chart.title')}
            >
              {chartPointsWithFlows.map((point, index) => {
                const x = chartLayout.scaleX(index)
                return (
                  <line
                    key={`v-grid-${point.bucketStart}-${index}`}
                    x1={x}
                    y1={chartLayout.padding.top}
                    x2={x}
                    y2={CHART_HEIGHT - chartLayout.padding.bottom}
                    stroke="#E3EAE1"
                    strokeDasharray="4 4"
                  />
                )
              })}
              {yTicks.map((tickValue, index) => {
                const y = chartLayout.scaleY(tickValue)
                return (
                  <g key={`h-grid-${index}`}>
                    <line
                      x1={chartLayout.padding.left}
                      y1={y}
                      x2={chartWidth - chartLayout.padding.right}
                      y2={y}
                      stroke="#E3EAE1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={chartLayout.padding.left - 12}
                      y={y + 4}
                      textAnchor="end"
                      fill="#5f6f68"
                      fontSize={11}
                    >
                      {new Intl.NumberFormat(localeCode, { maximumFractionDigits: 2 }).format(
                        tickValue,
                      )}
                    </text>
                  </g>
                )
              })}
              <line
                x1={chartLayout.padding.left}
                y1={chartLayout.scaleY(0)}
                x2={chartWidth - chartLayout.padding.right}
                y2={chartLayout.scaleY(0)}
                stroke="#9AAEA4"
                strokeDasharray="4 4"
              />
              {chartPointsWithFlows.map((point, index) => {
                const x = chartLayout.scaleX(index)
                const y0 = chartLayout.scaleY(0)
                const inflow = point.inflow
                const outflow = point.outflow
                const yInflow = chartLayout.scaleY(inflow)
                const yOutflow = chartLayout.scaleY(-outflow)
                const flowBarWidth = Math.max(
                  6,
                  Math.min(16, chartLayout.plotWidth / Math.max(chartLayout.pointCount * 5.4, 18)),
                )
                const flowGap = Math.max(3, Math.min(8, flowBarWidth * 0.6))
                const leftBarX = x - flowGap / 2 - flowBarWidth
                const rightBarX = x + flowGap / 2
                const isSelected = selectedBucketStart === point.bucketStart
                const labelParts = formatBucketLabelParts(point, timelineBucket, locale)
                const inflowLabel = new Intl.NumberFormat(localeCode, {
                  maximumFractionDigits: 2,
                }).format(inflow)
                const outflowLabel = new Intl.NumberFormat(localeCode, {
                  maximumFractionDigits: 2,
                }).format(outflow)
                return (
                  <g key={`${point.bucketStart}-${index}`}>
                    <rect
                      x={x - (flowBarWidth * 2 + flowGap) / 2 - 4}
                      y={chartLayout.padding.top}
                      width={flowBarWidth * 2 + flowGap + 8}
                      height={CHART_HEIGHT - chartLayout.padding.top - chartLayout.padding.bottom}
                      fill="transparent"
                      onClick={() => setSelectedBucketStart(point.bucketStart)}
                      style={{ cursor: 'pointer' }}
                    />
                    {outflow > 0 && (
                      <>
                        <rect
                          x={leftBarX}
                          y={Math.min(y0, yOutflow)}
                          width={flowBarWidth}
                          height={Math.max(2, Math.abs(yOutflow - y0))}
                          rx={6}
                          fill="#C62828"
                          opacity={isSelected ? 0.92 : 0.78}
                        />
                        <text
                          x={leftBarX + flowBarWidth / 2}
                          y={Math.max(yOutflow + 12, y0 + 12)}
                          textAnchor="middle"
                          fill="#7a1b1b"
                          fontSize={10}
                          fontWeight={600}
                        >
                          -{outflowLabel}
                        </text>
                      </>
                    )}
                    {inflow > 0 && (
                      <>
                        <rect
                          x={rightBarX}
                          y={Math.min(y0, yInflow)}
                          width={flowBarWidth}
                          height={Math.max(2, Math.abs(yInflow - y0))}
                          rx={6}
                          fill="#2E7D32"
                          opacity={isSelected ? 0.92 : 0.78}
                        />
                        <text
                          x={rightBarX + flowBarWidth / 2}
                          y={Math.min(yInflow - 8, y0 - 8)}
                          textAnchor="middle"
                          fill="#1f5a24"
                          fontSize={10}
                          fontWeight={600}
                        >
                          +{inflowLabel}
                        </text>
                      </>
                    )}
                    <text
                      x={x}
                      y={CHART_HEIGHT - 32}
                      textAnchor="middle"
                      fill="#5f6f68"
                      fontSize={10}
                    >
                      <tspan x={x} dy="0">
                        {labelParts.top}
                      </tspan>
                      <tspan x={x} dy="12">
                        {labelParts.bottom}
                      </tspan>
                    </text>
                  </g>
                )
              })}
            </svg>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
              <Typography variant="caption" sx={{ color: '#C62828', fontWeight: 600 }}>
                {t('stock.movement.chart.legend.outflow')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 600 }}>
                {t('stock.movement.chart.legend.inflow')}
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>

      {!isTrackingMode && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {t('stock.movement.drillDown.title')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {listRangeLabel}
            </Typography>
          </Box>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              {isFetching && (
                <Typography variant="caption" color="text.secondary">
                  {t('common.loading')}
                </Typography>
              )}
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('stock.movement.date')}</TableCell>
                    <TableCell>{t('stock.resource.form.name')}</TableCell>
                    <TableCell>{t('stock.movement.type')}</TableCell>
                    <TableCell align="right">{t('stock.movement.quantity')}</TableCell>
                    <TableCell align="right">{t('stock.movement.expectedBefore')}</TableCell>
                    <TableCell align="right">{t('stock.movement.expectedAfter')}</TableCell>
                    <TableCell>{t('stock.movement.reference')}</TableCell>
                    <TableCell>{t('stock.movement.notes')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!movements.length ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        {t('stock.movement.emptyState')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagedMovements.map((movement) => {
                      const signedQuantity = getSignedMovement(movement)
                      return (
                        <TableRow key={movement.id}>
                          <TableCell>
                            {movement.createdAt ? formatDateTime(movement.createdAt, locale) : '-'}
                          </TableCell>
                          <TableCell>
                            {movement.stockResourceName || movement.stockResourceId}
                          </TableCell>
                          <TableCell>
                            {t(`stock.movement.types.${movement.type}` as any) || movement.type}
                          </TableCell>
                          <TableCell align="right">
                            {formatSignedQuantity(signedQuantity, localeCode)}
                          </TableCell>
                          <TableCell align="right">
                            {formatQuantity(movement.previousQuantity, localeCode)}
                          </TableCell>
                          <TableCell align="right">
                            {formatQuantity(movement.newQuantity, localeCode)}
                          </TableCell>
                          <TableCell>
                            {movement.referenceType
                              ? `${movement.referenceType}${movement.referenceId ? ` #${movement.referenceId}` : ''}`
                              : '-'}
                          </TableCell>
                          <TableCell>{movement.notes || '-'}</TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={movements.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10))
                  setPage(0)
                }}
              />
            </Box>
          )}
        </Paper>
      )}

      {!isTrackingMode && formOpen && (
        <StockMovementFormDialog open={formOpen} onClose={() => setFormOpen(false)} />
      )}
    </Box>
  )
}
