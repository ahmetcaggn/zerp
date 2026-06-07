'use client'

import ErrorIcon from '@mui/icons-material/Error'
import { Box, Skeleton, Stack, Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import * as echarts from 'echarts'
import { useEffect, useMemo, useRef } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'

import { usePrometheusMetric } from '../hooks/use-prometheus-metric'
import type {
  PrometheusChartPoint,
  PrometheusMetricConfig,
  PrometheusMetricSeries,
  PrometheusMetricUnit,
} from '../types/prometheus'

const CONTAINERS_METRIC: PrometheusMetricConfig = {
  id: 'docker.containersInfo',
  title: 'Konteyner',
  caption: '',
  color: '#64748b',
  unit: 'count',
}

const UPTIME_METRIC: PrometheusMetricConfig = {
  id: 'docker.uptime',
  title: 'Konteyner Durumu',
  caption: '',
  color: '#10b981',
  unit: 'count',
}

const CPU_METRIC: PrometheusMetricConfig = {
  id: 'docker.cpu',
  title: 'CPU',
  caption: '',
  color: '#0f766e',
  unit: 'cores',
}

const MEMORY_METRIC: PrometheusMetricConfig = {
  id: 'docker.memoryUsage',
  title: 'Bellek',
  caption: '',
  color: '#2563eb',
  unit: 'bytes',
}

const NETWORK_RECEIVED_METRIC: PrometheusMetricConfig = {
  id: 'docker.networkReceived',
  title: 'Gelen',
  caption: '',
  color: '#0891b2',
  unit: 'bytesPerSecond',
}

const NETWORK_SENT_METRIC: PrometheusMetricConfig = {
  id: 'docker.networkSent',
  title: 'Giden',
  caption: '',
  color: '#db2777',
  unit: 'bytesPerSecond',
}

const IO_READS_METRIC: PrometheusMetricConfig = {
  id: 'docker.ioReads',
  title: 'Okuma',
  caption: '',
  color: '#d97706',
  unit: 'bytesPerSecond',
}

const IO_WRITES_METRIC: PrometheusMetricConfig = {
  id: 'docker.ioWrites',
  title: 'Yazma',
  caption: '',
  color: '#dc2626',
  unit: 'bytesPerSecond',
}

export type ChartSeries = {
  color?: string
  data?: PrometheusMetricSeries
  name: string
  unit: PrometheusMetricUnit
}

export const CHART_COLORS = [
  '#2563eb', '#db2777', '#d97706', '#0f766e', '#8b5cf6',
  '#ec4899', '#f59e0b', '#10b981', '#6366f1', '#f43f5e',
  '#14b8a6', '#f97316', '#64748b', '#84cc16', '#06b6d4'
]

export function formatMetricValue(value: number | undefined, unit: PrometheusMetricUnit) {
  if (value === undefined) {
    return '-'
  }

  if (unit === 'bytes' || unit === 'bytesPerSecond') {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let nextValue = value
    let unitIndex = 0

    while (Math.abs(nextValue) >= 1024 && unitIndex < units.length - 1) {
      nextValue /= 1024
      unitIndex += 1
    }

    return `${nextValue.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} ${units[unitIndex]}${
      unit === 'bytesPerSecond' ? '/s' : ''
    }`
  }

  if (unit === 'cores') {
    return `${value.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} core`
  }

  if (unit === 'percent') {
    return `%${value.toLocaleString('tr-TR', { maximumFractionDigits: 1 })}`
  }

  if (unit === 'megabytes') {
    return `${value.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} MB`
  }

  return value.toLocaleString('tr-TR', { maximumFractionDigits: 0 })
}

function formatTime(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function mergeTimestamps(series: ChartSeries[]) {
  const timestamps = new Set<number>()

  series.forEach((item) => {
    item.data?.points.forEach((point) => timestamps.add(point.timestamp))
  })

  return Array.from(timestamps).sort((a, b) => a - b)
}

function mapValuesByTimestamp(points: PrometheusChartPoint[]) {
  const values = new Map<number, number>()

  points.forEach((point) => {
    values.set(point.timestamp, point.value)
  })

  return values
}

function getLatestValue(data: PrometheusMetricSeries | undefined) {
  return data?.points.at(-1)?.value
}

function MetricSummary({
  isLoading,
  label,
  value,
}: {
  isLoading: boolean
  label: string
  value: string
}) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        minHeight: 92,
        p: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography color="text.secondary" fontWeight={700} variant="caption">
        {label}
      </Typography>
      {isLoading ? (
        <Skeleton variant="text" width="58%" sx={{ mt: 1 }} />
      ) : (
        <Typography sx={{ lineHeight: 1.1, mt: 1 }} variant="h3">
          {value}
        </Typography>
      )}
    </Box>
  )
}

export function TimeSeriesPanel({
  height = 278,
  isError,
  isLoading,
  series,
  title,
  isLineRace = false,
  isStateChart = false,
}: {
  height?: number
  isError: boolean
  isLoading: boolean
  series: ChartSeries[]
  title: string
  isLineRace?: boolean
  isStateChart?: boolean
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { t } = useI18n()
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)

  const timestamps = useMemo(() => mergeTimestamps(series), [series])
  const units = useMemo(() => Array.from(new Set(series.map((item) => item.unit))), [series])
  const hasData = timestamps.length > 0

  useEffect(() => {
    if (!chartRef.current || !hasData) {
      return undefined
    }

    const chart = echarts.init(chartRef.current)
    chartInstanceRef.current = chart

    const resizeObserver = new ResizeObserver(() => {
      chart.resize()
    })
    resizeObserver.observe(chartRef.current)

    return () => {
      resizeObserver.disconnect()
      chart.dispose()
      chartInstanceRef.current = null
    }
  }, [hasData])

  useEffect(() => {
    const chart = chartInstanceRef.current

    if (!chart || !hasData) {
      return
    }

    const textColor = theme.palette.text.secondary
    const divider = theme.palette.divider
    const tooltipBg =
      theme.palette.mode === 'dark' ? alpha('#020617', 0.94) : alpha('#ffffff', 0.98)

    const option: echarts.EChartsOption = {
      animationDuration: 260,
      color: series.every((s) => s.color) ? series.map((item) => item.color as string) : CHART_COLORS,
      grid: {
        bottom: 34,
        containLabel: true,
        left: 8,
        right: isLineRace ? (isMobile ? 54 : 120) : 18,
        top: 18,
      },
      legend:
        series.length > 1
          ? {
              type: 'scroll',
              bottom: 0,
              icon: 'roundRect',
              itemHeight: 8,
              itemWidth: 18,
              textStyle: {
                color: textColor,
                fontFamily: theme.typography.fontFamily,
                fontSize: 11,
              },
            }
          : undefined,
      series: series.map((item) => {
        const valuesByTimestamp = mapValuesByTimestamp(item.data?.points ?? [])

        return {
          areaStyle:
            series.length === 1 && !isStateChart
              ? {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { color: alpha(item.color as string, 0.22), offset: 0 },
                    { color: alpha(item.color as string, 0.02), offset: 1 },
                  ]),
                }
              : undefined,
          data: timestamps.map((timestamp) => {
            const val = valuesByTimestamp.get(timestamp)
            if (isStateChart) {
              return val !== undefined ? 1 : 0
            }
            return val ?? null
          }),
          step: isStateChart ? 'end' : undefined,
          lineStyle: {
            color: item.color,
            width: 2,
          },
          name: item.name,
          showSymbol: false,
          smooth: 0.28,
          type: 'line',
          yAxisIndex: Math.max(0, units.indexOf(item.unit)),
          ...(isLineRace
            ? {
                endLabel: {
                  show: true,
                  formatter: '{a}',
                  color: 'inherit',
                  fontSize: isMobile ? 8 : 10,
                  distance: isMobile ? 4 : 8,
                },
                labelLayout: {
                  moveOverlap: 'shiftY',
                },
                emphasis: {
                  focus: 'series',
                },
              }
            : {}),
        }
      }),
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: divider,
        borderWidth: 1,
        confine: true,
        padding: [8, 10],
        order: isLineRace ? 'valueDesc' : 'seriesAsc',
        textStyle: {
          color: theme.palette.text.primary,
          fontFamily: theme.typography.fontFamily,
          fontSize: 12,
        },
        trigger: 'axis',
        formatter: (params) => {
          const items = Array.isArray(params) ? params : [params]
          const axisLabel = (items[0] as { axisValueLabel?: string } | undefined)?.axisValueLabel ?? ''
          const rows = items
            .map((item) => {
              const seriesIndex = typeof item.seriesIndex === 'number' ? item.seriesIndex : 0
              const metric = series[seriesIndex]
              const value = typeof item.value === 'number' ? item.value : undefined
              const displayValue = isStateChart
                ? (value === 1 ? 'Up' : value === 0 ? 'Down' : 'Down')
                : formatMetricValue(value, metric?.unit ?? 'count')

              return `<div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:4px;">
                <span>${item.marker ?? ''}${metric?.name ?? item.seriesName}</span>
                <strong>${displayValue}</strong>
              </div>`
            })
            .join('')

          return `<div style="min-width:150px;">
            <div style="color:${textColor};font-size:11px;margin-bottom:4px;">${axisLabel}</div>
            ${rows}
          </div>`
        },
      },
      xAxis: {
        axisLabel: {
          color: textColor,
          fontFamily: theme.typography.fontFamily,
          fontSize: 10,
          hideOverlap: true,
        },
        axisLine: { lineStyle: { color: divider } },
        axisTick: { show: false },
        data: timestamps.map(formatTime),
        splitLine: { show: false },
        type: 'category',
      },
      yAxis: units.map((unit, index) => ({
        axisLabel: {
          color: textColor,
          fontFamily: theme.typography.fontFamily,
          fontSize: 10,
          formatter: isStateChart
            ? (val: number) => (val === 1 ? 'Up' : val === 0 ? 'Down' : '')
            : (value: number) => formatMetricValue(value, unit),
        },
        min: isStateChart ? -0.1 : undefined,
        max: isStateChart ? 1.1 : undefined,
        interval: isStateChart ? 1 : undefined,
        position: index === 0 ? 'left' : 'right',
        splitLine: {
          show: index === 0,
          lineStyle: {
            color: divider,
            type: 'dashed',
          },
        },
        type: 'value',
      })),
    }

    chart.setOption(option, true)
    chart.resize()
  }, [hasData, series, theme, timestamps, units])

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        minHeight: height + 70,
        p: 2,
        width: '100%',
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={800} variant="subtitle2">
          {title}
        </Typography>
        {isError && (
          <Tooltip title={t('dashboard.docker.errorTooltip')} placement="top">
            <ErrorIcon color="error" fontSize="small" sx={{ cursor: 'pointer' }} />
          </Tooltip>
        )}
      </Box>
      {isLoading ? (
        <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 1, mt: 2 }} />
      ) : isError ? (
        <Box
          sx={{
            alignItems: 'center',
            color: 'text.secondary',
            display: 'flex',
            height,
            justifyContent: 'center',
            mt: 2,
          }}
        >
          <Typography variant="body2">{t('dashboard.docker.errorData')}</Typography>
        </Box>
      ) : !hasData ? (
        <Box
          sx={{
            alignItems: 'center',
            color: 'text.secondary',
            display: 'flex',
            height,
            justifyContent: 'center',
            mt: 2,
          }}
        >
          <Typography variant="body2">{t('dashboard.docker.noData')}</Typography>
        </Box>
      ) : (
        <Box ref={chartRef} sx={{ height, mt: 2, width: '100%' }} />
      )}
    </Box>
  )
}

export function DockerInfrastructureDashboard({
  durationMs,
  refetchInterval,
}: {
  durationMs: number
  refetchInterval: number | false
}) {
  const theme = useTheme()
  const { t } = useI18n()
  const containers = usePrometheusMetric(CONTAINERS_METRIC, durationMs, refetchInterval)
  const cpu = usePrometheusMetric(CPU_METRIC, durationMs, refetchInterval)
  const memory = usePrometheusMetric(MEMORY_METRIC, durationMs, refetchInterval)
  const networkReceived = usePrometheusMetric(NETWORK_RECEIVED_METRIC, durationMs, refetchInterval)
  const networkSent = usePrometheusMetric(NETWORK_SENT_METRIC, durationMs, refetchInterval)
  const ioReads = usePrometheusMetric(IO_READS_METRIC, durationMs, refetchInterval)
  const ioWrites = usePrometheusMetric(IO_WRITES_METRIC, durationMs, refetchInterval)
  const uptime = usePrometheusMetric(UPTIME_METRIC, durationMs, refetchInterval)

  const containerItems = containers.data?.containers ?? []
  const isSummaryLoading = containers.isLoading || cpu.isLoading || memory.isLoading

  const uptimeSeries = useMemo(() => {
    if (!uptime.data?.multiSeries) return []
    return uptime.data.multiSeries.map((s, idx) => ({
      color: CHART_COLORS[idx % CHART_COLORS.length],
      data: {
        points: s.points,
        seriesCount: 1,
      } as PrometheusMetricSeries,
      name: s.name,
      unit: 'count' as PrometheusMetricUnit,
    }))
  }, [uptime.data])

  const cpuSeries = useMemo(() => {
    if (!cpu.data?.multiSeries) return []
    return cpu.data.multiSeries.map((s, idx) => ({
      color: CHART_COLORS[idx % CHART_COLORS.length],
      data: {
        points: s.points.map((p) => ({ timestamp: p.timestamp, value: p.value * 100 })),
        seriesCount: 1,
      } as PrometheusMetricSeries,
      name: s.name,
      unit: 'percent' as PrometheusMetricUnit,
    }))
  }, [cpu.data])

  const memorySeries = useMemo(() => {
    if (!memory.data?.multiSeries) return []
    return memory.data.multiSeries.map((s, idx) => ({
      color: CHART_COLORS[idx % CHART_COLORS.length],
      data: {
        points: s.points.map((p) => ({ timestamp: p.timestamp, value: p.value / (1024 * 1024) })),
        seriesCount: 1,
      } as PrometheusMetricSeries,
      name: s.name,
      unit: 'megabytes' as PrometheusMetricUnit,
    }))
  }, [memory.data])

  const currentUpCount = useMemo(() => {
    if (!uptime.data?.multiSeries) return 0
    let maxTimestamp = 0
    uptime.data.multiSeries.forEach((s) => {
      const lastPoint = s.points.at(-1)
      if (lastPoint && lastPoint.timestamp > maxTimestamp) {
        maxTimestamp = lastPoint.timestamp
      }
    })

    if (maxTimestamp === 0) return 0

    let upCount = 0
    uptime.data.multiSeries.forEach((s) => {
      const lastPoint = s.points.at(-1)
      if (lastPoint && lastPoint.timestamp === maxTimestamp && lastPoint.value === 1) {
        upCount++
      }
    })
    return upCount
  }, [uptime.data])

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.08 : 0.04),
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          p: 1.5,
        }}
      >
        <MetricSummary
          isLoading={isSummaryLoading}
          label={t('dashboard.docker.containerUp')}
          value={String(currentUpCount)}
        />
        <MetricSummary
          isLoading={isSummaryLoading}
          label={t('dashboard.docker.totalCpu')}
          value={formatMetricValue(
            cpu.data?.points?.at(-1)?.value !== undefined ? cpu.data.points.at(-1)!.value * 100 : undefined,
            'percent'
          )}
        />
        <MetricSummary
          isLoading={isSummaryLoading}
          label={t('dashboard.docker.totalMemory')}
          value={formatMetricValue(getLatestValue(memory.data), MEMORY_METRIC.unit)}
        />
      </Box>

      <TimeSeriesPanel
        height={300}
        isError={cpu.isError}
        isLoading={cpu.isLoading}
        series={cpuSeries}
        title={t('dashboard.docker.cpuUsageTitle')}
        isLineRace
      />

      <TimeSeriesPanel
        height={300}
        isError={memory.isError}
        isLoading={memory.isLoading}
        series={memorySeries}
        title={t('dashboard.docker.memoryUsageTitle')}
        isLineRace
      />

      <TimeSeriesPanel
        height={250}
        isError={uptime.isError}
        isLoading={uptime.isLoading}
        series={uptimeSeries}
        title={t('dashboard.docker.containerStatusTitle')}
        isLineRace
        isStateChart
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        }}
      >
        <TimeSeriesPanel
          isError={networkReceived.isError || networkSent.isError}
          isLoading={networkReceived.isLoading || networkSent.isLoading}
          series={[
            {
              color: NETWORK_RECEIVED_METRIC.color,
              data: networkReceived.data,
              name: t('dashboard.docker.networkReceived'),
              unit: NETWORK_RECEIVED_METRIC.unit,
            },
            {
              color: NETWORK_SENT_METRIC.color,
              data: networkSent.data,
              name: t('dashboard.docker.networkSent'),
              unit: NETWORK_SENT_METRIC.unit,
            },
          ]}
          title={t('dashboard.docker.networkTitle')}
        />
        <TimeSeriesPanel
          isError={ioReads.isError || ioWrites.isError}
          isLoading={ioReads.isLoading || ioWrites.isLoading}
          series={[
            {
              color: IO_READS_METRIC.color,
              data: ioReads.data,
              name: t('dashboard.docker.diskIoRead'),
              unit: IO_READS_METRIC.unit,
            },
            {
              color: IO_WRITES_METRIC.color,
              data: ioWrites.data,
              name: t('dashboard.docker.diskIoWrite'),
              unit: IO_WRITES_METRIC.unit,
            },
          ]}
          title={t('dashboard.docker.diskIoTitle')}
        />
      </Box>

    </Stack>
  )
}
