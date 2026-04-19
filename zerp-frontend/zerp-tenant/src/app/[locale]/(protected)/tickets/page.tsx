import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { TicketList } from '@/modules/tenant/ui/ticket-list'

export const metadata: Metadata = buildMetadata({ title: 'Support Tickets' })

export default function TicketsPage() {
  return <TicketList />
}
