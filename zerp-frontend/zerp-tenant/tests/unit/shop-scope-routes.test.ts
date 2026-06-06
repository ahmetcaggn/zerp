import { describe, expect, it } from 'vitest'
import { isGlobalOnlyPath, isShopOnlyPath } from '@/core/utils/shop-scope-routes'

describe('shop scope route helpers', () => {
  it('detects shop-only paths', () => {
    expect(isShopOnlyPath('/catalog')).toBe(true)
    expect(isShopOnlyPath('/sale')).toBe(true)
    expect(isShopOnlyPath('/employees')).toBe(false)
  })

  it('detects global-only paths', () => {
    expect(isGlobalOnlyPath('/employees')).toBe(true)
    expect(isGlobalOnlyPath('/announcements')).toBe(true)
    expect(isGlobalOnlyPath('/stock')).toBe(false)
  })
})
