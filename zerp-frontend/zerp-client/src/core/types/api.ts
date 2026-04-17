export interface ApiMeta {
  timestamp?: string
  traceId?: string
  version?: string
  durationMs?: number
}

export interface ApiEnvelope<T> {
  success: boolean
  statusCode: number
  message: string
  data: T
  meta?: ApiMeta
}

export interface ApiErrorPayload {
  success?: boolean
  statusCode?: number
  message?: string
  error?: string
}

export class ApiError extends Error {
  readonly statusCode: number
  readonly payload?: ApiErrorPayload

  constructor(message: string, statusCode: number, payload?: ApiErrorPayload) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.payload = payload
  }
}
