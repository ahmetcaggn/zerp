import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { AnnouncementCreatePage } from '@/modules/tenant/ui/announcement-create-page'

export const metadata: Metadata = buildMetadata({ title: 'Create Announcement' })

export default function AnnouncementCreateRoutePage() {
  return <AnnouncementCreatePage />
}
