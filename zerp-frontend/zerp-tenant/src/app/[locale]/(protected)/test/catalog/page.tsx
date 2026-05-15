import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { SaleManagementView } from '@/modules/tenant/ui/sale/sale-management-view'

export const metadata: Metadata = buildMetadata({ title: 'Catalog' })

export default function CatalogPage() {
  return <SaleManagementView />
}
