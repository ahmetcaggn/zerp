import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { PermissionGroupList } from '@/modules/tenant/ui/permission-group-list'

export const metadata: Metadata = buildMetadata({ title: 'Permission Groups' })

export default function PermissionGroupsPage() {
  return <PermissionGroupList />
}
