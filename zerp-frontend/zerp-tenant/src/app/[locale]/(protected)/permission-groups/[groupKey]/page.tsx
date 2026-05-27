import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { PermissionGroupDetail } from '@/modules/tenant/ui/permission-group-detail'

export const metadata: Metadata = buildMetadata({ title: 'Permission Group Detail' })

export default async function PermissionGroupDetailPage({
  params,
}: {
  params: Promise<{ groupKey: string }>
}) {
  const { groupKey } = await params
  return <PermissionGroupDetail groupKey={groupKey} />
}
