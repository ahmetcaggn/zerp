export type PrometheusMetricUnit = 'bytes' | 'bytesPerSecond' | 'cores' | 'count' | 'percent' | 'megabytes'

export interface PrometheusMetricConfig {
  caption: string
  color: string
  id: string
  title: string
  unit: PrometheusMetricUnit
}

export interface PrometheusQueryRangeParams {
  durationMs: number
  metricId: string
  step: string
}

export interface PrometheusQueryRangeResponse {
  data: {
    result: PrometheusQueryRangeResult[]
    resultType: 'matrix' | string
  }
  status: 'success' | 'error'
}

export interface PrometheusQueryRangeResult {
  metric: Record<string, string>
  values: [number, string][]
}

export interface PrometheusChartPoint {
  timestamp: number
  value: number
}

export interface PrometheusMultiSeries {
  name: string
  points: PrometheusChartPoint[]
}

export interface PrometheusMetricSeries {
  points: PrometheusChartPoint[]
  seriesCount: number
  containers?: { name: string; image: string }[]
  multiSeries?: PrometheusMultiSeries[]
}
