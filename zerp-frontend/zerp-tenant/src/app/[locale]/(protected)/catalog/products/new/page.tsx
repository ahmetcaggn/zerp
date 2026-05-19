import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { ProductEditorPage } from '@/modules/tenant/ui/sale/catalog/product-editor-page'

export const metadata: Metadata = buildMetadata({ title: 'Create Product' })

export default function CreateProductPage() {
  return <ProductEditorPage mode="create" />
}
