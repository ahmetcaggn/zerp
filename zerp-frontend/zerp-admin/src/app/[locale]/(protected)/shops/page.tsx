import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { ShopList } from '@/modules/admin/ui/shop-list'

export const metadata: Metadata = buildMetadata({ title: 'Shops' })

export default function ShopsPage() {
  return <ShopList />
}
