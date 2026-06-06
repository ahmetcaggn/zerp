import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { AnnouncementDetail } from '@/modules/tenant/ui/announcement-detail'

export const metadata: Metadata = buildMetadata({ title: 'Announcement Detail' })

export default async function AnnouncementDetailRoutePage({
  params,
}: {
  params: Promise<{ announcementId: string }>
}) {
  const { announcementId } = await params
  return <AnnouncementDetail id={announcementId} />
}
