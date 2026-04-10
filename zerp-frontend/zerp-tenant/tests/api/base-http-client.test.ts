import { beforeEach, describe, expect, it, vi } from 'vitest'

import { BaseHttpClient, parseApiEnvelope } from '@/core/api/base-http-client'
import { ApiError } from '@/core/types/api'

describe('parseApiEnvelope', () => {
  it('unwraps envelope payload', () => {
    const result = parseApiEnvelope<{ id: number }>({
      success: true,
      statusCode: 200,
      message: 'ok',
      data: { id: 1 },
    })

    expect(result).toEqual({ id: 1 })
  })
})

describe('BaseHttpClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('throws ApiError when response is not ok', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ message: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const client = new BaseHttpClient('/api')

    await expect(client.request('/admin')).rejects.toBeInstanceOf(ApiError)
  })
})
