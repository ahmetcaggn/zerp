'use client'

import { AuthProvider } from '@/core/auth/client/auth-provider'
import { I18nProvider } from '@/core/i18n/i18n-provider'
import type { MessageDictionary } from '@/core/i18n/messages'
import { CurrentUserPermissionsProvider } from '@/core/permissions/use-permissions'
import { MuiEmotionCacheProvider } from '@/core/providers/mui-emotion-cache-provider'
import { AppQueryProvider } from '@/core/providers/query-provider'
import { AppThemeProvider } from '@/core/providers/theme-provider'
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
      <MuiEmotionCacheProvider>
        <AuthProvider>
          <CurrentUserPermissionsProvider>
            <I18nProvider locale={locale} messages={messages}>
              <AppThemeProvider>
                <ToastProvider>{children}</ToastProvider>
              </AppThemeProvider>
            </I18nProvider>
          </CurrentUserPermissionsProvider>
        </AuthProvider>
      </MuiEmotionCacheProvider>
    </AppQueryProvider>
  )
}
