import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { TeamDetail } from '@/modules/tenant/ui/team-detail'

export const metadata: Metadata = buildMetadata({ title: 'Team Detail' })

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <TeamDetail id={id} />
}
