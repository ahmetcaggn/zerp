'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { AuthProvider } from '@/core/auth/client/auth-provider'
import { I18nProvider } from '@/core/i18n/i18n-provider'
import type { MessageDictionary } from '@/core/i18n/messages'
import { AppQueryProvider } from '@/core/providers/query-provider'
import { AppThemeProvider } from '@/core/providers/theme-provider'
import { ShopScopeProvider } from '@/core/providers/shop-scope-provider'
import { ToastProvider } from '@/core/providers/toast-provider'
import type { Locale } from '@/core/types/common'

export function AppProviders({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode
  locale: Locale
  messages: MessageDictionary
}) {
  return (
    <AppQueryProvider>
      <AppRouterCacheProvider>
        <AuthProvider>
          <I18nProvider locale={locale} messages={messages}>
            <AppThemeProvider>
              <ShopScopeProvider>
                <ToastProvider>{children}</ToastProvider>
              </ShopScopeProvider>
            </AppThemeProvider>
          </I18nProvider>
        </AuthProvider>
      </AppRouterCacheProvider>
    </AppQueryProvider>
  )
}
