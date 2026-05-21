import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { CategoryFormPage } from '@/modules/tenant/ui/sale/catalog/category-form-page'

export const metadata: Metadata = buildMetadata({ title: 'Edit Category' })

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>
}) {
  const { categoryId } = await params
  return <CategoryFormPage mode="edit" categoryId={categoryId} />
}
