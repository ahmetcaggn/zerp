import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { ProductEditorPage } from '@/modules/tenant/ui/sale/catalog/product-editor-page'

export const metadata: Metadata = buildMetadata({ title: 'Product Detail' })

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProductEditorPage mode="edit" productId={id} />
}
