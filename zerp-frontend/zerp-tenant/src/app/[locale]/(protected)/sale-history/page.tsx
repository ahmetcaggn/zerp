import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { SaleHistoryListPage } from '@/modules/tenant/ui/sale-history/sale-history-pages'

export const metadata: Metadata = buildMetadata({ title: 'Sale History' })

export default function SaleHistoryRoute() {
  return <SaleHistoryListPage />
}
