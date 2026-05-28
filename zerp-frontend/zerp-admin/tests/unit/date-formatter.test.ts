import { describe, expect, it } from 'vitest'

import { formatDate, formatDateTime } from '@/core/utils/date-formatter'

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

describe('formatDateTime', () => {
  it('formats datetime in Turkish locale', () => {
    const output = formatDateTime('2026-05-28T19:30:08.220618', 'tr')
    expect(output.length).toBeGreaterThan(0)
  })

  it('returns fallback for invalid datetime', () => {
    const output = formatDateTime('invalid-date', 'tr')
    expect(output).toBe('—')
  })
})
