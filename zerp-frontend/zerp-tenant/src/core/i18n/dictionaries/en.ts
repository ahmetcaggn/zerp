export const enMessages = {
  common: {
    appName: 'ZERP',
    loading: 'Loading...',
    unauthorized: 'You are not allowed to access this area.',
  },
  nav: {
    home: 'Home',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    logout: 'Logout',
    language: 'Language',
    menu: 'Menu',
  },
  home: {
    title: 'ZERP Frontend Template',
    description:
      'Scalable Next.js + MUI template infrastructure for tenant, client, and admin applications.',
    cta: 'Open Dashboard',
  },
  auth: {
    loginTitle: 'Login',
    registerTitle: 'Register',
    redirecting: 'Redirecting to identity provider...',
  },
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Modular panel view based on the active variant',
  },
  employees: {
    title: 'Employees',
    createButton: 'Add Employee',
    editButton: 'Edit',
    deleteButton: 'Delete',
    emptyState: 'No employees found.',
    searchPlaceholder: 'Search by name or email...',
    deletedTitle: 'Deleted Employees',
    restoreButton: 'Restore',
  },
  tickets: {
    title: 'Support Tickets',
    createButton: 'New Ticket',
    emptyState: 'No support tickets yet.',
    addComment: 'Add Comment',
    closeTicket: 'Close Ticket',
    commentPlaceholder: 'Write your comment...',
  },
  teams: {
    title: 'Teams',
    emptyState: 'No teams found.',
    membersLabel: 'Members',
  },
  notifications: {
    title: 'Notifications',
    sendButton: 'Send',
    recipientsLabel: 'Recipients',
    subjectLabel: 'Subject',
    bodyLabel: 'Message',
    sentSuccess: 'Notification sent successfully.',
  },
} as const
