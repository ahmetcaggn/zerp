'use client'

import { useState, useEffect, useRef } from 'react'
import { Box, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material'
import * as echarts from 'echarts'

import { usePrometheusMetric } from '../hooks/use-prometheus-metric'
import type {
  PrometheusChartPoint,
  PrometheusMetricConfig,
  PrometheusMetricUnit,
  PrometheusMultiSeries,
} from '../types/prometheus'

const EMPTY_SERIES: PrometheusChartPoint[] = []

function formatMetricValue(value: number | undefined, unit: PrometheusMetricUnit) {
  if (value === undefined) {
    return '-'
  }

  if (unit === 'percent') {
    return `${value.toLocaleString('tr-TR', { maximumFractionDigits: 1 })}%`
  }

  if (unit === 'megabytes') {
    const valueInMb = value / (1024 * 1024)
    return `${valueInMb.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} MB`
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
    return `${value.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} cores`
  }

  return value.toLocaleString('tr-TR', { maximumFractionDigits: 0 })
}

function formatTime(timestamp: number, showSeconds = false) {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hour12: false,
  })
}

interface MetricLineChartProps {
  color: string
  points: PrometheusChartPoint[]
  multiSeries?: PrometheusMultiSeries[]
  metricId: string
  unit: PrometheusMetricUnit
  hoveredPoint: PrometheusChartPoint | null
  setHoveredPoint: (point: PrometheusChartPoint | null) => void
}

function MetricLineChart({
  color,
  points,
  multiSeries,
  metricId,
  unit,
  setHoveredPoint,
}: MetricLineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)
  const hasMulti = multiSeries && multiSeries.length > 0

  useEffect(() => {
    if (!chartRef.current || !points.length) return

    const chartInstance = echarts.init(chartRef.current)
    chartInstanceRef.current = chartInstance

    chartInstance.on('updateAxisPointer', (event: any) => {
      const axesInfo = event.axesInfo
      if (axesInfo && axesInfo.length > 0) {
        const dataIndex = axesInfo[0].value
        const point = points[dataIndex]
        if (point) {
          setHoveredPoint(point)
        }
      } else {
        setHoveredPoint(null)
      }
    })

    const resizeObserver = new ResizeObserver(() => {
      chartInstance.resize()
    })
    resizeObserver.observe(chartRef.current)

    return () => {
      resizeObserver.disconnect()
      chartInstance.dispose()
    }
  }, [points, color, setHoveredPoint])

  useEffect(() => {
    const chartInstance = chartInstanceRef.current
    if (!chartInstance || !points.length) return

    const seriesData = hasMulti
      ? multiSeries.map((s) => ({
          name: s.name,
          type: 'line',
          data: s.points.map((p) => p.value),
          smooth: 0.35,
          showSymbol: false,
          lineStyle: {
            width: 1.8,
          },
          areaStyle: {
            opacity: 0.01,
          },
        }))
      : [
          {
            name: metricId,
            type: 'line',
            data: points.map((p) => p.value),
            smooth: 0.35,
            showSymbol: false,
            itemStyle: {
              color: color,
            },
            lineStyle: {
              width: 2.5,
              color: color,
              shadowColor: color,
              shadowBlur: 5,
              shadowOffsetY: 1,
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: color },
                { offset: 1, color: 'rgba(0, 0, 0, 0)' },
              ]),
              opacity: 0.18,
            },
          },
        ]

    const option = {
      grid: {
        left: 4,
        right: 4,
        top: hasMulti ? 26 : 8,
        bottom: 20,
        containLabel: false,
      },
      legend: hasMulti
        ? {
            show: true,
            top: 0,
            left: 'center',
            icon: 'circle',
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
              color: '#94a3b8',
              fontSize: 9,
              fontFamily: 'system-ui, sans-serif',
            },
          }
        : { show: false },
      xAxis: {
        type: 'category',
        data: points.map((p) => formatTime(p.timestamp)),
        show: true,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#94a3b8',
          fontSize: 9,
          fontFamily: 'system-ui, sans-serif',
          interval: Math.floor(points.length / 3),
        },
      },
      yAxis: {
        type: 'value',
        show: false,
        min: 'dataMin',
        max: 'dataMax',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: hasMulti ? '#64748b' : color,
            type: 'dashed',
            width: 1,
            opacity: 0.6,
          },
        },
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        padding: [8, 12],
        textStyle: {
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
        },
        formatter: (params: any) => {
          if (!params || params.length === 0) return ''
          const p0 = params[0]
          const timestamp = points[p0.dataIndex]?.timestamp
          const timeStr = timestamp ? formatTime(timestamp, true) : ''
          
          let rowsHtml = ''
          const sortedParams = [...params].sort((a, b) => b.value - a.value)
          
          sortedParams.forEach((p) => {
            const seriesName = p.seriesName ?? 'unknown'
            const valueStr = formatMetricValue(p.value, unit)
            const seriesColor = p.color
            
            rowsHtml += `
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 4px; font-family: sans-serif; font-size: 10px;">
                <span style="display: flex; align-items: center; gap: 6px; color: #cbd5e1;">
                  <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${seriesColor};"></span>
                  ${seriesName}
                </span>
                <span style="font-weight: 700; color: #f8fafc;">${valueStr}</span>
              </div>
            `
          })
          
          return `
            <div style="font-size: 9px; color: #94a3b8; font-weight: 600; font-family: sans-serif;">
              ${timeStr}
            </div>
            ${rowsHtml}
          `
        },
      },
      series: seriesData,
    }

    chartInstance.setOption(option)
  }, [points, color, unit, hasMulti, multiSeries, metricId])

  if (!points.length) {
    return (
      <Box
        sx={{
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1.5,
          border: '1px dashed',
          borderColor: 'divider',
          color: 'text.secondary',
          backgroundColor: 'action.hover',
        }}
      >
        <Typography variant="caption">Veri yok</Typography>
      </Box>
    )
  }

  return (
    <Box 
      ref={chartRef} 
      sx={{ 
        width: '100%', 
        height: 120,
        position: 'relative'
      }} 
    />
  )
}

export function PrometheusMetricCard({ metric, durationMs }: { metric: PrometheusMetricConfig; durationMs?: number }) {
  const { data, isError, isLoading } = usePrometheusMetric(metric, durationMs)
  const [hoveredPoint, setHoveredPoint] = useState<PrometheusChartPoint | null>(null)
  
  const points = data?.points ?? EMPTY_SERIES
  const latestValue = points.at(-1)?.value
  const multiSeries = data?.multiSeries ?? []

  const values = points.map((p) => p.value)
  const minVal = values.length ? Math.min(...values) : 0
  const maxVal = values.length ? Math.max(...values) : 0
  const avgVal = values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0

  const displayValue = hoveredPoint !== null ? hoveredPoint.value : latestValue
  const displayLabel = hoveredPoint !== null 
    ? `Saat: ${formatTime(hoveredPoint.timestamp, true)}`
    : isError 
    ? 'Hata oluştu' 
    : `${data?.seriesCount ?? 0} aktif metrik`

  const firstValue = points[0]?.value ?? 0
  const pctChange = firstValue !== 0 && displayValue !== undefined
    ? ((displayValue - firstValue) / firstValue) * 100 
    : 0

  const isPositive = pctChange > 0
  const isNegative = pctChange < 0
  const pctColor = isPositive ? '#10b981' : isNegative ? '#ef4444' : '#64748b'
  const pctBg = isPositive ? '#10b98115' : isNegative ? '#ef444415' : '#64748b12'
  const pctLabel = pctChange === 0 
    ? '0.0%' 
    : `${isPositive ? '▲ +' : '▼ '}${Math.abs(pctChange).toFixed(1)}%`

  if (metric.id === 'docker.containersInfo') {
    return (
      <Card 
        variant="outlined" 
        sx={{ 
          height: '100%', 
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          backgroundColor: 'background.paper',
          borderColor: 'divider',
          '&:hover': {
            borderColor: metric.color,
            boxShadow: `0 8px 24px -12px ${metric.color}25`,
          }
        }}
      >
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }} sx={{ borderRight: { md: '1px solid' }, borderColor: 'divider', pr: { md: 3 } }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ letterSpacing: '-0.01em', fontSize: '0.875rem' }}>
                      {metric.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {metric.caption}
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      px: 1, 
                      py: 0.3, 
                      borderRadius: 1, 
                      backgroundColor: `${metric.color}10`,
                      border: '1px solid',
                      borderColor: `${metric.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 5, 
                        height: 5, 
                        borderRadius: '50%', 
                        backgroundColor: metric.color,
                        boxShadow: `0 0 6px ${metric.color}`
                      }} 
                    />
                    <Typography variant="caption" fontWeight={700} sx={{ color: metric.color, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                      LİVE
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
                  <Box>
                    <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.03em', lineHeight: 1 }}>
                      {isLoading ? '-' : formatMetricValue(displayValue, metric.unit)}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      fontWeight={600}
                      sx={{ mt: 0.5, fontSize: '0.7rem' }}
                    >
                      {displayLabel}
                    </Typography>
                  </Box>
                  {!isLoading && points.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', px: 1, py: 0.5, borderRadius: 1, backgroundColor: pctBg, color: pctColor, border: '1px solid', borderColor: `${pctColor}10` }}>
                      <Typography variant="caption" fontWeight={750} sx={{ fontSize: '0.75rem', lineHeight: 1 }}>
                        {pctLabel}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {isLoading ? (
                  <Skeleton variant="rectangular" animation="wave" sx={{ height: 110, borderRadius: 1.5 }} />
                ) : (
                  <MetricLineChart 
                    color={metric.color} 
                    points={points} 
                    multiSeries={multiSeries}
                    metricId={metric.id}
                    unit={metric.unit}
                    hoveredPoint={hoveredPoint}
                    setHoveredPoint={setHoveredPoint}
                  />
                )}
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  fontWeight={700} 
                  sx={{ letterSpacing: '0.05em', display: 'block', mb: 2 }}
                >
                  AKTİF KONTEYNERLER ({data?.containers?.length ?? 0})
                </Typography>
                
                {isLoading ? (
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} variant="rectangular" height={52} sx={{ borderRadius: 1.5 }} />
                    ))}
                  </Box>
                ) : !data?.containers || data.containers.length === 0 ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexGrow: 1, border: '1px dashed', borderColor: 'divider', borderRadius: 1.5, minHeight: 120 }}>
                    <Typography variant="caption" color="text.secondary">Çalışan konteyner bulunamadı</Typography>
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                      gap: 1.5,
                      maxHeight: 180,
                      overflowY: 'auto',
                      pr: 1
                    }}
                  >
                    {data.containers.map((container) => (
                      <Box 
                        key={container.name} 
                        sx={{ 
                          p: 1.2, 
                          borderRadius: 1.5, 
                          border: '1px solid', 
                          borderColor: 'divider', 
                          backgroundColor: 'action.hover',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1,
                          transition: 'border-color 0.2s ease',
                          '&:hover': {
                            borderColor: 'text.secondary'
                          }
                        }}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" fontWeight={700} noWrap sx={{ color: 'text.primary', fontSize: '0.85rem' }}>
                            {container.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', fontSize: '0.65rem' }}>
                            {container.image}
                          </Typography>
                        </Box>
                        <Box 
                          sx={{ 
                            px: 1, 
                            py: 0.2, 
                            borderRadius: 1, 
                            backgroundColor: '#10b98115', 
                            border: '1px solid #10b98125', 
                            color: '#10b981',
                            fontSize: '0.6rem',
                            fontWeight: 800
                          }}
                        >
                          RUNNING
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        height: '100%', 
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        backgroundColor: 'background.paper',
        borderColor: 'divider',
        '&:hover': {
          borderColor: metric.color,
          boxShadow: `0 8px 24px -12px ${metric.color}25`,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography 
                variant="subtitle2" 
                fontWeight={700} 
                noWrap 
                sx={{ 
                  color: 'text.primary',
                  letterSpacing: '-0.01em',
                  fontSize: '0.875rem'
                }}
              >
                {metric.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {metric.caption}
              </Typography>
            </Box>
            <Box 
              sx={{ 
                px: 1, 
                py: 0.3, 
                borderRadius: 1, 
                backgroundColor: `${metric.color}10`,
                border: '1px solid',
                borderColor: `${metric.color}20`,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <Box 
                sx={{ 
                  width: 5, 
                  height: 5, 
                  borderRadius: '50%', 
                  backgroundColor: metric.color,
                  boxShadow: `0 0 6px ${metric.color}`
                }} 
              />
              <Typography variant="caption" fontWeight={700} sx={{ color: metric.color, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                LİVE
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
            <Box>
              <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: '-0.03em', lineHeight: 1 }}>
                {isLoading ? '-' : formatMetricValue(displayValue, metric.unit)}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary" 
                fontWeight={600}
                sx={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  mt: 0.5,
                  fontSize: '0.7rem',
                  transition: 'color 0.15s ease',
                  ...(hoveredPoint !== null && {
                    color: metric.color,
                  })
                }}
              >
                {displayLabel}
              </Typography>
            </Box>
            
            {!isLoading && points.length > 0 && (
              <Box 
                sx={{ 
                  width: 'fit-content',
                  display: 'flex', 
                  alignItems: 'center',
                  px: 1, 
                  py: 0.5, 
                  borderRadius: 1, 
                  backgroundColor: pctBg,
                  color: pctColor,
                  border: '1px solid',
                  borderColor: `${pctColor}10`
                }}
              >
                <Typography variant="caption" fontWeight={750} sx={{ fontSize: '0.75rem', lineHeight: 1 }}>
                  {pctLabel}
                </Typography>
              </Box>
            )}
          </Box>

          {isLoading ? (
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{ height: 120, borderRadius: 1.5 }}
            />
          ) : (
            <MetricLineChart 
              color={metric.color} 
              points={points} 
              multiSeries={multiSeries}
              metricId={metric.id}
              unit={metric.unit}
              hoveredPoint={hoveredPoint}
              setHoveredPoint={setHoveredPoint}
            />
          )}

          <Box 
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 1, 
              pt: 1.8, 
              borderTop: '1px solid', 
              borderColor: 'divider',
              mt: 1
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary" display="block" fontWeight={700} sx={{ fontSize: '0.625rem', letterSpacing: '0.02em', mb: 0.2 }}>
                MİNİMUM
              </Typography>
              <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ fontSize: '0.8rem' }}>
                {isLoading ? '-' : formatMetricValue(minVal, metric.unit)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" display="block" fontWeight={700} sx={{ fontSize: '0.625rem', letterSpacing: '0.02em', mb: 0.2 }}>
                ORTALAMA
              </Typography>
              <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ fontSize: '0.8rem' }}>
                {isLoading ? '-' : formatMetricValue(avgVal, metric.unit)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary" display="block" fontWeight={700} sx={{ fontSize: '0.625rem', letterSpacing: '0.02em', mb: 0.2 }}>
                MAKSİMUM
              </Typography>
              <Typography variant="body2" fontWeight={800} color="text.primary" sx={{ fontSize: '0.8rem' }}>
                {isLoading ? '-' : formatMetricValue(maxVal, metric.unit)}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
