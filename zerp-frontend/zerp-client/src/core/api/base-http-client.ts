// Auth/SSO disabled temporarily. Re-enable sessionManager with the 401 handling below.
// import { sessionManager } from '@/core/auth/session-manager'
import type { ApiEnvelope, ApiErrorPayload } from '@/core/types/api'
import { ApiError } from '@/core/types/api'

interface RequestOptions extends RequestInit {
  _retry?: boolean
}

export interface ListResult<T> {
  data: T[]
  total: number
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

  private async rawFetch(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<{ payload: unknown; response: Response }> {
    // Auth/SSO disabled temporarily.
    // if (sessionManager.isSessionExpired) {
    //   throw new ApiError('Session expired', 401)
    // }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10_000)

    let response: Response
    try {
      response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers ?? {}),
        },
        signal: options.signal ?? controller.signal,
      })
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError('Request timeout', 408)
      }
      throw new ApiError('Service unavailable', 503)
    } finally {
      clearTimeout(timeoutId)
    }

    // Auth/SSO disabled temporarily.
    // if (response.status === 401 && !options._retry) {
    //   const refreshed = await this.tryRefreshSession()
    //   if (!refreshed) {
    //     sessionManager.forceLogout()
    //     throw new ApiError('Session expired', 401)
    //   }
    //
    //   return this.rawFetch(endpoint, {
    //     ...options,
    //     _retry: true,
    //   })
    // }

    const payload = await this.safeJson(response)

    if (!response.ok) {
      const apiPayload = payload as ApiErrorPayload | null
      const message = apiPayload?.message || apiPayload?.error || 'Request failed'
      throw new ApiError(message, response.status, apiPayload ?? undefined)
    }

    return { payload, response }
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { payload } = await this.rawFetch(endpoint, options)
    return parseApiEnvelope<T>(payload)
  }

  async requestList<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<ListResult<T>> {
    const { payload, response } = await this.rawFetch(endpoint, {
      ...options,
      method: 'GET',
    })

    const data = parseApiEnvelope<T[]>(payload)
    const total = Number(response.headers.get('X-Total-Count') ?? 0)
    return { data, total }
  }

  get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  put<T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  patch<T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }

  del<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
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
