import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { MenuItemFormPage } from '@/modules/tenant/ui/sale/catalog/menu-item-form-page'

export const metadata: Metadata = buildMetadata({ title: 'Create Menu Item' })

export default async function CreateMenuItemPage({
  searchParams,
}: {
  searchParams: Promise<{ categoryId?: string }>
}) {
  const { categoryId } = await searchParams
  return <MenuItemFormPage mode="create" initialCategoryId={categoryId} />
}
