import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { PermissionGroupDetail } from '@/modules/admin/ui/permission-group-detail'

export const metadata: Metadata = buildMetadata({ title: 'Permission Group Detail' })

export default async function TenantPermissionGroupDetailPage({
  params,
}: {
  params: Promise<{ id: string; groupKey: string }>
}) {
  const { id, groupKey } = await params
  return <PermissionGroupDetail tenantId={id} groupKey={groupKey} />
}
