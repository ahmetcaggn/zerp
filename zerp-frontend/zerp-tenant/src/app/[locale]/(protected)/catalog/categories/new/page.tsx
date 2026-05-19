import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { CategoryFormPage } from '@/modules/tenant/ui/sale/catalog/category-form-page'

export const metadata: Metadata = buildMetadata({ title: 'Create Category' })

export default async function CreateCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ menuId?: string }>
}) {
  const { menuId } = await searchParams
  return <CategoryFormPage mode="create" initialMenuId={menuId} />
}
