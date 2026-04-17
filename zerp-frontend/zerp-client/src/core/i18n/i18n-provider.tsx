'use client'

import { createContext, useContext, useMemo } from 'react'

import type { Locale } from '@/core/types/common'

import type { MessageDictionary } from './messages'

interface I18nContextValue {
  locale: Locale
  messages: MessageDictionary
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function resolveMessage(
  dictionary: MessageDictionary,
  key: string,
  params?: Record<string, string | number>,
): string {
  const chunks = key.split('.')
  let current: unknown = dictionary

  for (const chunk of chunks) {
    if (!current || typeof current !== 'object') {
      return key
    }

    current = (current as Record<string, unknown>)[chunk]
  }

  let message = typeof current === 'string' ? current : key

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      message = message.replaceAll(`{${k}}`, String(v))
    }
  }

  return message
}

export function I18nProvider({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode
  locale: Locale
  messages: MessageDictionary
}) {
  const value = useMemo(
    () => ({
      locale,
      messages,
      t: (key: string, params?: Record<string, string | number>) => resolveMessage(messages, key, params),
    }),
    [locale, messages],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }

  return context
}
