import type { MetadataRoute } from 'next'

import { appConfig } from '@/core/config/app-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = appConfig.app.baseUrl

  return appConfig.locale.supportedLocales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}/login`,
      changeFrequency: 'weekly',
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/${locale}/register`,
      changeFrequency: 'weekly',
      priority: 0.7,
      lastModified: new Date(),
    },
  ])
}
