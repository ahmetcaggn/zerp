import type { Metadata } from 'next'

import { buildMetadata } from '@/core/seo/metadata'
import { ShopQrPage } from '@/modules/tenant/ui/shop-qr-page'

export const metadata: Metadata = buildMetadata({ title: 'Shop QR' })

export default function Page() {
  return <ShopQrPage />
}
