export const TicketStatus = {
  Open: 'OPEN',
  InProgress: 'IN_PROGRESS',
  WaitingCustomer: 'WAITING_CUSTOMER',
  Resolved: 'RESOLVED',
  Closed: 'CLOSED',
  Cancelled: 'CANCELLED',
} as const

export type TicketStatusValue = (typeof TicketStatus)[keyof typeof TicketStatus]

export const TicketPriority = {
  Low: 'LOW',
  Medium: 'MEDIUM',
  High: 'HIGH',
  Critical: 'CRITICAL',
} as const

export type TicketPriorityValue = (typeof TicketPriority)[keyof typeof TicketPriority]

export const TicketType = {
  Bug: 'BUG',
  FeatureRequest: 'FEATURE_REQUEST',
  Question: 'QUESTION',
  Incident: 'INCIDENT',
} as const

export type TicketTypeValue = (typeof TicketType)[keyof typeof TicketType]

export interface CreateTicketRequest {
  title: string
  description?: string
  priority?: TicketPriorityValue
  type?: TicketTypeValue
}

export interface UpdateTicketRequest {
  title?: string
  description?: string
}

export interface ChangeStatusRequest {
  status: TicketStatusValue
}

export interface ChangePriorityRequest {
  priority: TicketPriorityValue
}

export interface AssignTicketRequest {
  teamId: string
  agentPartyId?: string
}

export interface AddCommentRequest {
  content: string
  isInternal?: boolean
}

export interface AttachmentResponse {
  id?: string
  fileName?: string
  fileType?: string
  fileSizeBytes?: number
  fileUrl?: string
  uploadedAt?: string
}

export interface TicketAssignmentResponse {
  id?: string
  teamId?: string
  agentPartyId?: string
  active?: boolean
  assignedAt?: string
}

export interface CommentResponse {
  id?: string
  authorId?: string
  authorName?: string
  authorType?: string
  content?: string
  isInternal?: boolean
  createdAt?: string
  attachments?: AttachmentResponse[]
}

export interface WatcherResponse {
  id?: string
  watcherId?: string
  watcherType?: string
  createdAt?: string
}

export interface SlaTrackingResponse {
  firstResponseDueAt?: string
  firstResponseAt?: string
  isFirstResponseBreached?: boolean
  resolutionDueAt?: string
  resolutionAt?: string
  isResolutionBreached?: boolean
  totalPausedTimeMinutes?: number
}

export interface TicketResponse {
  id?: string
  title?: string
  description?: string
  status?: string
  priority?: string
  type?: string
  tenantId?: string
  reporterId?: string
  createdAt?: string
  updatedAt?: string
  resolvedAt?: string
  closedAt?: string
  tags?: string[]
  customAttributes?: Record<string, unknown>
  watchers?: WatcherResponse[]
  attachments?: AttachmentResponse[]
  currentAssignment?: TicketAssignmentResponse
  comments?: CommentResponse[]
  slaTracking?: SlaTrackingResponse
}

export type TicketStatusString =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_CUSTOMER'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED'

export type TicketPriorityString = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type TicketTypeString = 'BUG' | 'FEATURE_REQUEST' | 'QUESTION' | 'INCIDENT'
