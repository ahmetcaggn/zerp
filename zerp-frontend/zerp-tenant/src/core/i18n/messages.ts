import { enMessages } from '@/core/i18n/dictionaries/en'
import { trMessages } from '@/core/i18n/dictionaries/tr'
import type { Locale } from '@/core/types/common'

export interface MessageDictionary {
  common: {
    appName: string
    loading: string
    unauthorized: string
  }
  nav: {
    home: string
    login: string
    register: string
    dashboard: string
    logout: string
    language: string
    menu: string
  }
  home: {
    title: string
    description: string
    cta: string
  }
  auth: {
    loginTitle: string
    registerTitle: string
    redirecting: string
  }
  dashboard: {
    title: string
    subtitle: string
    totalEmployees: string
    totalTickets: string
    openTickets: string
    recentEmployeesTitle: string
    quickActionsTitle: string
    addEmployeeAction: string
    sendNotificationAction: string
    newTicketAction: string
  }
  employees: {
    title: string
    createButton: string
    editButton: string
    deleteButton: string
    emptyState: string
    searchPlaceholder: string
    deletedTitle: string
    restoreButton: string
  }
  tickets: {
    title: string
    createButton: string
    emptyState: string
  }
  notifications: {
    title: string
    sendButton: string
    recipientsLabel: string
    subjectLabel: string
    bodyLabel: string
    sentSuccess: string
    htmlModeLabel: string
    htmlBodyLabel: string
    recipientPlaceholder: string
  }
}

export const messagesByLocale: Record<Locale, MessageDictionary> = {
  tr: trMessages,
  en: enMessages,
}

export function getMessages(locale: Locale): MessageDictionary {
  return messagesByLocale[locale] ?? trMessages
}
