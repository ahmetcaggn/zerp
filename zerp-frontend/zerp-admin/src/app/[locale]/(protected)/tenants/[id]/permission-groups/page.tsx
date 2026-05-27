import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { PermissionGroupList } from '@/modules/admin/ui/permission-group-list'

export const metadata: Metadata = buildMetadata({ title: 'Permission Groups' })

export default async function TenantPermissionGroupsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <PermissionGroupList tenantId={id} />
}
