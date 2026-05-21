import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { MenuFormPage } from '@/modules/tenant/ui/sale/catalog/menu-form-page'

export const metadata: Metadata = buildMetadata({ title: 'Edit Menu' })

export default async function EditMenuPage({ params }: { params: Promise<{ menuId: string }> }) {
  const { menuId } = await params
  return <MenuFormPage mode="edit" menuId={menuId} />
}
