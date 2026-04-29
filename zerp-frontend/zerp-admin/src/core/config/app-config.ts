import { getClientEnv } from '@/core/config/env.client'
import type { AppRole } from '@/core/types/common'

export const appConfig = (() => {
  const env = getClientEnv()

  return {
    app: {
      name: 'ZERP',
      baseUrl: env.baseUrl,
    },
    locale: {
      defaultLocale: env.defaultLocale,
      supportedLocales: env.supportedLocales,
    },
    auth: {
      sessionPoolingInterval: env.sessionPoolingInterval,
    },
    api: {
      browserBasePath: '/api',
    },
    access: {
      dashboardRoles: ['admin_super', 'admin_operator'] as AppRole[],
    },
    seo: {
      titleTemplate: '%s | ZERP',
      description:
        'ZERP multi-tenant ERP platform template with tenant, client, and admin frontends.',
    },
  }
})()
