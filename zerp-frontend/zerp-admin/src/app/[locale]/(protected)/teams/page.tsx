import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { TeamList } from '@/modules/admin/ui/team-list'

export const metadata: Metadata = buildMetadata({ title: 'Teams' })

export default function TeamsPage() {
  return <TeamList />
}
