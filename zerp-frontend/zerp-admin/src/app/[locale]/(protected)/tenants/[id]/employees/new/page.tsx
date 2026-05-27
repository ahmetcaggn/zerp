import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { TenantEmployeeCreatePage } from '@/modules/admin/ui/tenant-employee-create-page'

export const metadata: Metadata = buildMetadata({ title: 'Create Employee' })

export default async function TenantEmployeeCreateRoutePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <TenantEmployeeCreatePage tenantId={id} />
}
