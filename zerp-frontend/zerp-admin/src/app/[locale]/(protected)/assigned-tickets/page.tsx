import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { TeamTicketList } from '@/modules/admin/ui/team-ticket-list'

export const metadata: Metadata = buildMetadata({ title: 'Assigned Tickets' })

export default function AssignedTicketsPage() {
  return <TeamTicketList scope="assigned" />
}
