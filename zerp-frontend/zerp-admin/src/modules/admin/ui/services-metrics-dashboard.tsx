'use client'

import { Box, Stack } from '@mui/material'
import { useMemo } from 'react'

import { useI18n } from '@/core/i18n/i18n-provider'

import { usePrometheusMetric } from '../hooks/use-prometheus-metric'
import type {
  PrometheusMetricConfig,
  PrometheusMetricSeries,
  PrometheusMetricUnit,
} from '../types/prometheus'
import { CHART_COLORS, ChartSeries, TimeSeriesPanel } from './docker-infrastructure-dashboard'

export const INSTANCE_TO_SERVICE: Record<string, string> = {
  'host.docker.internal:8081': 'CRM',
  'host.docker.internal:8082': 'Employee',
  'host.docker.internal:8083': 'Notification',
  'host.docker.internal:8084': 'Resource',
  'host.docker.internal:8085': 'Sale',
  'host.docker.internal:8087': 'User',
  'crm:8080': 'CRM',
  'employee:8080': 'Employee',
  'notification:8080': 'Notification',
  'resource:8080': 'Resource',
  'sale:8080': 'Sale',
  'user:8080': 'User',
}

const JVM_HEAP_METRIC: PrometheusMetricConfig = {
  id: 'services.jvmHeap',
  title: 'JVM Heap Kullanımı',
  caption: '',
  color: '#2563eb',
  unit: 'bytes',
}

const REQUEST_RATE_METRIC: PrometheusMetricConfig = {
  id: 'services.requestRate',
  title: 'HTTP İstek Oranı (RPM - Dakikada)',
  caption: '',
  color: '#10b981',
  unit: 'count', // Although RPM, we display as count visually
}

const ERROR_RATE_METRIC: PrometheusMetricConfig = {
  id: 'services.errorRate',
  title: 'HTTP 5xx Hata Oranı',
  caption: '',
  color: '#ef4444',
  unit: 'count',
}

const DB_CONNECTIONS_METRIC: PrometheusMetricConfig = {
  id: 'services.dbConnections',
  title: 'Veritabanı Açık Bağlantıları (Pool)',
  caption: '',
  color: '#d946ef',
  unit: 'count',
}

const CPU_USAGE_METRIC: PrometheusMetricConfig = {
  id: 'services.cpuUsage',
  title: 'CPU Kullanımı',
  caption: '',
  color: '#f59e0b',
  unit: 'percent', // Process CPU is 0.0-1.0, we will multiply by 100
}

const JVM_THREADS_METRIC: PrometheusMetricConfig = {
  id: 'services.jvmThreads',
  title: 'JVM Aktif Thread Sayısı',
  caption: '',
  color: '#6366f1',
  unit: 'count',
}

export function ServicesMetricsDashboard({
  durationMs,
  refetchInterval,
  selectedService,
}: {
  durationMs: number
  refetchInterval: number | false
  selectedService: string | 'ALL'
}) {
  const { t } = useI18n()
  const heap = usePrometheusMetric(JVM_HEAP_METRIC, durationMs, refetchInterval)
  const reqRate = usePrometheusMetric(REQUEST_RATE_METRIC, durationMs, refetchInterval)
  const errRate = usePrometheusMetric(ERROR_RATE_METRIC, durationMs, refetchInterval)
  const dbConns = usePrometheusMetric(DB_CONNECTIONS_METRIC, durationMs, refetchInterval)
  const cpu = usePrometheusMetric(CPU_USAGE_METRIC, durationMs, refetchInterval)
  const threads = usePrometheusMetric(JVM_THREADS_METRIC, durationMs, refetchInterval)

  // Helper to map and filter multiSeries from prometheus
  const buildSeries = (
    data: any,
    unit: PrometheusMetricUnit,
    transformValue?: (v: number) => number
  ): ChartSeries[] => {
    if (!data?.multiSeries) return []

    let filteredSeries = data.multiSeries
    if (selectedService !== 'ALL') {
      filteredSeries = filteredSeries.filter((s: any) => INSTANCE_TO_SERVICE[s.name] === selectedService)
    } else {
      // Exclude unmapped instances from the 'ALL' view
      filteredSeries = filteredSeries.filter((s: any) => INSTANCE_TO_SERVICE[s.name] !== undefined)
    }

    return filteredSeries.map((s: any, idx: number) => {
      const displayName = INSTANCE_TO_SERVICE[s.name] || s.name
      return {
        color: CHART_COLORS[idx % CHART_COLORS.length],
        data: {
          points: transformValue
            ? s.points.map((p: any) => ({ timestamp: p.timestamp, value: transformValue(p.value) }))
            : s.points,
          seriesCount: 1,
        } as PrometheusMetricSeries,
        name: displayName,
        unit,
      }
    })
  }

  const heapSeries = useMemo(() => buildSeries(heap.data, 'bytes'), [heap.data, selectedService])
  const reqRateSeries = useMemo(() => buildSeries(reqRate.data, 'count', (v) => v * 60), [reqRate.data, selectedService])
  const errRateSeries = useMemo(() => buildSeries(errRate.data, 'count', (v) => v * 60), [errRate.data, selectedService])
  const dbConnsSeries = useMemo(() => buildSeries(dbConns.data, 'count'), [dbConns.data, selectedService])
  const cpuSeries = useMemo(() => buildSeries(cpu.data, 'percent', (v) => v * 100), [cpu.data, selectedService])
  const threadsSeries = useMemo(() => buildSeries(threads.data, 'count'), [threads.data, selectedService])

  const isLineRace = selectedService === 'ALL'

  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        }}
      >
        <TimeSeriesPanel
          height={300}
          isError={reqRate.isError}
          isLoading={reqRate.isLoading}
          series={reqRateSeries}
          title={t('dashboard.services.requestRateTitle')}
          isLineRace={isLineRace}
        />
        <TimeSeriesPanel
          height={300}
          isError={errRate.isError}
          isLoading={errRate.isLoading}
          series={errRateSeries}
          title={t('dashboard.services.errorRateTitle')}
          isLineRace={isLineRace}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        }}
      >
        <TimeSeriesPanel
          height={300}
          isError={heap.isError}
          isLoading={heap.isLoading}
          series={heapSeries}
          title={t('dashboard.services.jvmHeapTitle')}
          isLineRace={isLineRace}
        />
        <TimeSeriesPanel
          height={300}
          isError={cpu.isError}
          isLoading={cpu.isLoading}
          series={cpuSeries}
          title={t('dashboard.services.cpuUsageTitle')}
          isLineRace={isLineRace}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        }}
      >
        <TimeSeriesPanel
          height={300}
          isError={dbConns.isError}
          isLoading={dbConns.isLoading}
          series={dbConnsSeries}
          title={t('dashboard.services.dbConnectionsTitle')}
          isLineRace={isLineRace}
        />
        <TimeSeriesPanel
          height={300}
          isError={threads.isError}
          isLoading={threads.isLoading}
          series={threadsSeries}
          title={t('dashboard.services.jvmThreadsTitle')}
          isLineRace={isLineRace}
        />
      </Box>
    </Stack>
  )
}
