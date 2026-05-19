import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { CategoryMenuItemsPage } from '@/modules/tenant/ui/sale/catalog/category-menu-items-page'

export const metadata: Metadata = buildMetadata({ title: 'Category Menu Items' })

export default async function CategoryMenuItemsRoute({
  params,
}: {
  params: Promise<{ categoryId: string }>
}) {
  const { categoryId } = await params
  return <CategoryMenuItemsPage categoryId={categoryId} />
}
