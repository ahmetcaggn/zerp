import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { TenantDetail } from '@/modules/admin/ui/tenant-detail'

export const metadata: Metadata = buildMetadata({ title: 'Tenant Detail' })

export default async function TenantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <TenantDetail id={id} />
}
