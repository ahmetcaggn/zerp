import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'

import type { CreateShopRequest, ShopResponse, UpdateShopRequest } from '../types/shop'

const base = createResourceClient<ShopResponse, ShopResponse, CreateShopRequest, UpdateShopRequest, string>(
  '/sale/admin/shops',
)

export const shopClient = {
  ...base,
  checkName: (
    tenantId: string,
    name: string,
    shopId?: string,
  ): Promise<{ available: boolean }> => {
    const query = new URLSearchParams({
      tenantId,
      name,
    })

    if (shopId) {
      query.set('shopId', shopId)
    }

    return httpClient.get<{ available: boolean }>(`/sale/admin/shops/check-name?${query.toString()}`)
  },
}
