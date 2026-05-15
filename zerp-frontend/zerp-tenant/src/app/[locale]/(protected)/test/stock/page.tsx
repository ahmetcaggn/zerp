import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { StockManagementView } from '@/modules/tenant/ui/stock/stock-management-view'

export const metadata: Metadata = buildMetadata({ title: 'Stock Management' })

export default function StockPage() {
  return <StockManagementView />
}
