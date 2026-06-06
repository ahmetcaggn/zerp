import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { AnnouncementList } from '@/modules/tenant/ui/announcement-list'

export const metadata: Metadata = buildMetadata({ title: 'Announcements' })

export default function AnnouncementsPage() {
  return <AnnouncementList />
}
