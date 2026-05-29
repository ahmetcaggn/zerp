import '@/app/globals.css'
import 'leaflet/dist/leaflet.css'

import type { Metadata } from 'next'
import { DM_Sans, Space_Grotesk } from 'next/font/google'

import { buildMetadata } from '@/core/seo/metadata'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  ...buildMetadata({ title: 'ZERP' }),
  title: {
    default: 'ZERP',
    template: '%s | ZERP',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${spaceGrotesk.variable}`}>{children}</body>
    </html>
  )
}
