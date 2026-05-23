import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { CatalogOverviewPageV2 } from '@/modules/tenant/ui/sale/catalog/catalog-overview-page-v2'

export const metadata: Metadata = buildMetadata({ title: 'Catalog' })

export default function CatalogPage() {
  return <CatalogOverviewPageV2 />
}
