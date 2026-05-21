import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { MenuCategoriesPage } from '@/modules/tenant/ui/sale/catalog/menu-categories-page'

export const metadata: Metadata = buildMetadata({ title: 'Menu Categories' })

export default async function MenuCategoriesRoute({ params }: { params: Promise<{ menuId: string }> }) {
  const { menuId } = await params
  return <MenuCategoriesPage menuId={menuId} />
}
