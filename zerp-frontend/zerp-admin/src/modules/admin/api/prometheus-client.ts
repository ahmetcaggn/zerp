import { httpClient } from '@/core/api/http-client'

import type { PrometheusQueryRangeParams, PrometheusQueryRangeResponse } from '../types/prometheus'

const SYSTEM_METRICS_API_PATH = '/user/admin/metrics'

export const prometheusClient = {
  queryRange({ durationMs, metricId, step }: PrometheusQueryRangeParams) {
    const end = Date.now() / 1000
    const start = end - durationMs / 1000
    const params = new URLSearchParams({
      metricId,
      start: String(Math.floor(start)),
      end: String(Math.floor(end)),
      step,
    })

    return httpClient.get<PrometheusQueryRangeResponse>(
      `${SYSTEM_METRICS_API_PATH}/query-range?${params.toString()}`,
    )
  },
}
