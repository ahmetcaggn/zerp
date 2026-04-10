import type { MetadataRoute } from 'next'

import { appConfig } from '@/core/config/app-config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/tr',
        disallow: ['/tr/dashboard/', '/en/dashboard/'],
      },
    ],
    sitemap: `${appConfig.app.baseUrl}/sitemap.xml`,
  }
}
