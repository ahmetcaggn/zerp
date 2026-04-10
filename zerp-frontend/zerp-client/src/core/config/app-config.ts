import { getClientEnv } from '@/core/config/env.client'
import { VARIANT_ALLOWED_ROLES } from '@/core/constants/roles'

export const appConfig = (() => {
  const env = getClientEnv()

  return {
    app: {
      name: 'ZERP',
      variant: env.appVariant,
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
      dashboardRoles: VARIANT_ALLOWED_ROLES[env.appVariant],
    },
    seo: {
      titleTemplate: '%s | ZERP',
      description:
        'ZERP multi-tenant ERP platform template with tenant, client, and admin frontends.',
    },
  }
})()
