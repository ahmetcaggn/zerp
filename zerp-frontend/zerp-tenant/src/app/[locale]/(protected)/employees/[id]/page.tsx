import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { EmployeeDetail } from '@/modules/tenant/ui/employee-detail'

export const metadata: Metadata = buildMetadata({ title: 'Employee Detail' })

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EmployeeDetail id={Number(id)} />
}
