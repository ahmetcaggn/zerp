import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { ShopManagementView } from '@/modules/tenant/ui/shop-management-view'

export const metadata: Metadata = buildMetadata({ title: 'Shop Management' })

export default function ShopsPage() {
  return <ShopManagementView />
}
