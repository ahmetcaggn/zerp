import { describe, expect, it } from 'vitest'

import { getCountryLabel, getCountryOptions, resolveCountryCode } from '@/core/data/countries'

describe('getCountryOptions', () => {
  it('keeps Turkey first and sorts the rest alphabetically in Turkish', () => {
    const options = getCountryOptions('tr')

    expect(options[0]?.label).toBe('Türkiye')

    const restLabels = options.slice(1).map((option) => option.label)
    const sortedRestLabels = [...restLabels].sort((left, right) => left.localeCompare(right, 'tr', { sensitivity: 'base' }))

    expect(restLabels).toEqual(sortedRestLabels)
  })

  it('falls back to the Turkish list when the locale bucket is empty', () => {
    const options = getCountryOptions('en')

    expect(options[0]?.code).toBe('TR')
    expect(options[0]?.label.length).toBeGreaterThan(0)
  })

  it('resolves legacy labels to ISO country codes', () => {
    expect(resolveCountryCode('tr', 'Türkiye')).toBe('TR')
    expect(resolveCountryCode('tr', 'United States')).toBe('US')
    expect(resolveCountryCode('tr', 'TR')).toBe('TR')
    expect(getCountryLabel('tr', 'United States')).toBe('Amerika Birleşik Devletleri')
  })
})
