import { sessionManager } from '@/core/auth/session-manager'
import type { ApiEnvelope, ApiErrorPayload } from '@/core/types/api'
import { ApiError } from '@/core/types/api'

interface RequestOptions extends RequestInit {
  _retry?: boolean
}

export function parseApiEnvelope<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    'success' in payload &&
    'statusCode' in payload
  ) {
    return (payload as ApiEnvelope<T>).data
  }

  return payload as T
}

export class BaseHttpClient {
  constructor(private readonly baseUrl = '/api') {}

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    if (sessionManager.isSessionExpired) {
      throw new ApiError('Session expired', 401)
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
      },
    }).catch(() => {
      throw new ApiError('Service unavailable', 503)
    })

    if (response.status === 401 && !options._retry) {
      const refreshed = await this.tryRefreshSession()
      if (!refreshed) {
        sessionManager.forceLogout()
        throw new ApiError('Session expired', 401)
      }

      return this.request<T>(endpoint, {
        ...options,
        _retry: true,
      })
    }

    const payload = await this.safeJson(response)

    if (!response.ok) {
      const apiPayload = payload as ApiErrorPayload | null
      const message = apiPayload?.message || apiPayload?.error || 'Request failed'
      throw new ApiError(message, response.status, apiPayload ?? undefined)
    }

    return parseApiEnvelope<T>(payload)
  }

  private async safeJson(response: Response): Promise<unknown> {
    const text = await response.text()

    if (!text) {
      return null
    }

    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  private async tryRefreshSession(): Promise<boolean> {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      cache: 'no-store',
    }).catch(() => null)

    if (!response?.ok) {
      return false
    }

    const session = (await this.safeJson(response)) as { error?: string } | null
    return !session?.error
  }
}
