import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { MenuCategoriesPageV2 } from '@/modules/tenant/ui/sale/catalog/menu-categories-page-v2'

export const metadata: Metadata = buildMetadata({ title: 'Menu Categories' })

export default async function MenuCategoriesRoute({ params }: { params: Promise<{ menuId: string }> }) {
  const { menuId } = await params
  return <MenuCategoriesPageV2 menuId={menuId} />
}
