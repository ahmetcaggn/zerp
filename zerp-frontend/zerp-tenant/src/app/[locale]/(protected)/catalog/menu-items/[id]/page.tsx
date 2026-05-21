import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { MenuItemFormPage } from '@/modules/tenant/ui/sale/catalog/menu-item-form-page'

export const metadata: Metadata = buildMetadata({ title: 'Menu Item Detail' })

export default async function MenuItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <MenuItemFormPage mode="edit" menuItemId={id} showLinkedProducts />
}
