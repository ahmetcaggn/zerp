import { enMessages } from '@/core/i18n/dictionaries/en'
import { trMessages } from '@/core/i18n/dictionaries/tr'
import type { Locale } from '@/core/types/common'

export interface MessageDictionary {
  common: {
    appName: string
    loading: string
    unauthorized: string
    back: string
    cancel: string
    save: string
    add: string
    send: string
    all: string
    actions: string
    details: string
    create: string
    edit: string
    delete: string
  }
  nav: {
    home: string
    login: string
    register: string
    dashboard: string
    logout: string
    language: string
    menu: string
    sale: string
    stock: string
    employees: string
    tickets: string
    notifications: string
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
    // status labels
    statusActive: string
    statusProbation: string
    statusOnLeave: string
    statusSuspended: string
    statusTerminated: string
    statusRetired: string
    // detail page sections
    employmentSection: string
    hireDateLabel: string
    terminationDateLabel: string
    salaryLabel: string
    managerLabel: string
    personalInfoSection: string
    emailLabel: string
    nationalIdLabel: string
    dateOfBirthLabel: string
    employeeIdLabel: string
    contactInfoSection: string
    createdAtLabel: string
    updatedAtLabel: string
    // list columns
    fullNameColumnHeader: string
    emailColumnHeader: string
    phoneColumnHeader: string
    statusColumnHeader: string
    // form fields
    usernameField: string
    usernameChecking: string
    usernameAvailable: string
    usernameUnavailable: string
    usernameError: string
    usernameMinLength: string
    tempPasswordField: string
    firstNameField: string
    lastNameField: string
    emailField: string
    hireDateField: string
    dateOfBirthField: string
    phoneField: string
    nationalIdField: string
    statusField: string
    salaryField: string
    managerField: string
    addContactButton: string
    contactTypeLabel: string
    contactValueField: string
    // toasts
    employeeDeletedToast: string
    employeeRestoredToast: string
    requiredFieldsWarning: string
    employeeCreatedToast: string
    employeeUpdatedToast: string
  }
    tickets: {
        title: string
        createButton: string
        emptyState: string
        addComment: string
        closeTicket: string
        commentPlaceholder: string
        // buttons
        editButton: string
        deleteButton: string
        assignButton: string
        reassignButton: string
        removeAssignmentButton: string
        // labels
        statusLabel: string
        priorityLabel: string
        typeLabel: string
        assignmentLabel: string
        unassignedLabel: string
        // form fields
        teamIdField: string
        agentIdField: string
        titleField: string
        descriptionField: string
        // SLA
        slaTrackingLabel: string
        firstResponseTarget: string
        resolutionTarget: string
        breachedLabel: string
        // comments
        commentsLabel: string
        unknownAuthor: string
        // dialogs
        editDialogTitle: string
        deleteDialogTitle: string
        deleteConfirmText: string
        // list
        listSearchPlaceholder: string
        searchButton: string
        clearFiltersButton: string
        titleColumnHeader: string
        createdAtColumnHeader: string
        detailTooltip: string
        rowsPerPageLabel: string
        // toasts
        commentAddedToast: string
        ticketClosedToast: string
        statusUpdatedToast: string
        priorityUpdatedToast: string
        assignmentCreatedToast: string
        assignmentRemovedToast: string
        titleRequiredWarning: string
        ticketUpdatedToast: string
        ticketDeletedToast: string
        ticketCreatedToast: string
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
