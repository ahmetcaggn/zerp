import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { TeamTicketDetail } from '@/modules/admin/ui/team-ticket-detail'

export const metadata: Metadata = buildMetadata({ title: 'Team Ticket Detail' })

export default async function TeamTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <TeamTicketDetail id={id} />
}
