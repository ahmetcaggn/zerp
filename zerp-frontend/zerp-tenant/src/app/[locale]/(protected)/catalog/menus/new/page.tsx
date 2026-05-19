import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { MenuFormPage } from '@/modules/tenant/ui/sale/catalog/menu-form-page'

export const metadata: Metadata = buildMetadata({ title: 'Create Menu' })

export default function CreateMenuPage() {
  return <MenuFormPage mode="create" />
}
