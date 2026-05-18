import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { TenantList } from '@/modules/admin/ui/tenant-list'

export const metadata: Metadata = buildMetadata({ title: 'Tenants' })

export default function TenantsPage() {
  return <TenantList />
}
