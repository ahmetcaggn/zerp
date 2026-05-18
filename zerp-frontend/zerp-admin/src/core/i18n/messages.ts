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
    crm: string
    teams: string
    teamManagement: string
    teamTickets: string
    ticketManagement: string
    assignedTickets: string
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
  }
  teams: {
    title: string
    createButton: string
    editButton: string
    deleteButton: string
    activateButton: string
    deactivateButton: string
    addMemberButton: string
    removeMemberButton: string
    emptyState: string
    membersLabel: string
    activeLabel: string
    inactiveLabel: string
    roleLeader: string
    roleMember: string
    permissionsSectionTitle: string
    permissionsSectionDescription: string
    permissionActionField: string
    permissionSearchPlaceholder: string
    permissionTargetTypeField: string
    permissionTargetField: string
    permissionNoOptions: string
    permissionAlreadyAdded: string
    permissionAddButton: string
    permissionsDialogTitle: string
    permissionsDialogSubtitle: string
    permissionsSearchField: string
    permissionsEmptyState: string
    actionsColumnLabel: string
    permissionRemoveButton: string
    closeButtonLabel: string
    permissionAssignedToast: string
    permissionRemovedToast: string
    permissionAssignPartialError: string
  }
  teamTickets: {
    title: string
    emptyState: string
    addComment: string
    closeTicket: string
    commentPlaceholder: string
  }
  assignedTickets: {
    title: string
    emptyState: string
  }
}

export const messagesByLocale: Record<Locale, MessageDictionary> = {
  tr: trMessages,
  en: enMessages,
}

export function getMessages(locale: Locale): MessageDictionary {
  return messagesByLocale[locale] ?? trMessages
}
