import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { NotificationSendForm } from '@/modules/tenant/ui/notification-send-form'

export const metadata: Metadata = buildMetadata({ title: 'Notifications' })

export default function NotificationsPage() {
  return <NotificationSendForm />
}
