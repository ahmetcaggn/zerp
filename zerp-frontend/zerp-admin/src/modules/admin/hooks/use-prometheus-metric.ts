'use client'

import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/core/api/query-keys'

import { prometheusClient } from '../api/prometheus-client'
import type {
  PrometheusChartPoint,
  PrometheusMetricConfig,
  PrometheusMetricSeries,
  PrometheusQueryRangeResponse,
} from '../types/prometheus'

const DEFAULT_REFETCH_INTERVAL_MS = 15_000

function toNumber(value: string) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function aggregatePrometheusMatrix(response: PrometheusQueryRangeResponse): PrometheusMetricSeries {
  const pointsByTimestamp = new Map<number, number>()

  response.data.result.forEach((series) => {
    series.values.forEach(([timestamp, rawValue]) => {
      pointsByTimestamp.set(timestamp, (pointsByTimestamp.get(timestamp) ?? 0) + toNumber(rawValue))
    })
  })

  const points: PrometheusChartPoint[] = Array.from(pointsByTimestamp.entries())
    .map(([timestamp, value]) => ({ timestamp, value }))
    .sort((a, b) => a.timestamp - b.timestamp)

  const seenNames = new Set<string>()
  const containers: { name: string; image: string }[] = []
  
  response.data.result.forEach((series) => {
    const name = series.metric.name ?? series.metric.instance ?? ''
    const image = series.metric.image ?? ''
    if (name && !seenNames.has(name)) {
      seenNames.add(name)
      containers.push({ name, image })
    }
  })

  const multiSeries = response.data.result.map((series) => {
    const name = series.metric.name ?? series.metric.instance ?? 'unknown'
    const seriesPoints = series.values.map(([timestamp, rawValue]) => ({
      timestamp,
      value: toNumber(rawValue),
    })).sort((a, b) => a.timestamp - b.timestamp)
    return { name, points: seriesPoints }
  })

  return {
    points,
    seriesCount: response.data.result.length,
    containers,
    multiSeries,
  }
}

export function usePrometheusMetric(
  metric: PrometheusMetricConfig,
  durationMs: number = 15 * 60 * 1000,
  refetchInterval: number | false = 15_000
) {
  // Dynamically adjust step size based on duration to prevent crowded charts
  const step = durationMs <= 15 * 60 * 1000 
    ? '15s' 
    : durationMs <= 60 * 60 * 1000 
    ? '1m' 
    : '5m'

  return useQuery({
    queryKey: [
      ...queryKeys.admin.prometheusMetrics,
      metric.id,
      durationMs,
      step,
    ] as const,
    queryFn: () =>
      prometheusClient.queryRange({
        durationMs,
        metricId: metric.id,
        step,
      }),
    refetchInterval,
    staleTime: refetchInterval === false ? 0 : Math.max(0, refetchInterval - 1_000),
    select: aggregatePrometheusMatrix,
  })
}
