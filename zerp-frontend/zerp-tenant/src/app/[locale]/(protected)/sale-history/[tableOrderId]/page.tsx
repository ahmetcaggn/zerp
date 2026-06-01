import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { SaleHistoryDetailPage } from '@/modules/tenant/ui/sale-history/sale-history-pages'

export const metadata: Metadata = buildMetadata({ title: 'Sale Detail' })

export default async function SaleHistoryDetailRoute({
  params,
}: {
  params: Promise<{ tableOrderId: string }>
}) {
  const { tableOrderId } = await params
  return <SaleHistoryDetailPage tableOrderId={tableOrderId} />
}
