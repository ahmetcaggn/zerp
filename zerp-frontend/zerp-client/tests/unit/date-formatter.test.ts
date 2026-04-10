import { describe, expect, it } from 'vitest'

import { formatDate } from '@/core/utils/date-formatter'

describe('formatDate', () => {
  it('formats date in Turkish locale', () => {
    const output = formatDate('2026-01-15T00:00:00.000Z', 'tr')
    expect(output.length).toBeGreaterThan(0)
  })

  it('formats date in English locale', () => {
    const output = formatDate('2026-01-15T00:00:00.000Z', 'en')
    expect(output.length).toBeGreaterThan(0)
  })
})
