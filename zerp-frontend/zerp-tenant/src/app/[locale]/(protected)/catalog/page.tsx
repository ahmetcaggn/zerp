import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { CatalogOverviewPage } from '@/modules/tenant/ui/sale/catalog/catalog-overview-page'

export const metadata: Metadata = buildMetadata({ title: 'Catalog' })

export default function CatalogPage() {
  return <CatalogOverviewPage />
}
