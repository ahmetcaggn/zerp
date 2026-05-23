import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { StockManagementViewV2 } from '@/modules/tenant/ui/stock/stock-management-view-v2'

export const metadata: Metadata = buildMetadata({ title: 'Stock Management' })

export default function StockPage() {
  return <StockManagementViewV2 />
}
