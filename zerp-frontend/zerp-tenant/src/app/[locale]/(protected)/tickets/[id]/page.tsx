import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { TicketDetail } from '@/modules/tenant/ui/ticket-detail'

export const metadata: Metadata = buildMetadata({ title: 'Ticket Detail' })

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <TicketDetail id={Number(id)} />
}
