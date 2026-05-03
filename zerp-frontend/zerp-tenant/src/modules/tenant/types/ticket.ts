import type {
  AttachmentResponse,
  CommentResponse as GeneratedCommentResponse,
  CreateTicketRequest as GeneratedCreateTicketRequest,
  SlaTrackingResponse,
  TicketAssignmentResponse,
  TicketResponse as GeneratedTicketResponse,
  WatcherResponse,
} from '@/modules/generated/openapi_crm/api'

export type {
  AttachmentResponse,
  SlaTrackingResponse,
  TicketAssignmentResponse,
  WatcherResponse,
}

export type CreateTicketRequest = Omit<GeneratedCreateTicketRequest, 'tenantId'> & {
  tenantId: string
}
export type CommentResponse = GeneratedCommentResponse & { authorName?: string }
export type TicketResponse = Omit<GeneratedTicketResponse, 'comments'> & {
  comments?: CommentResponse[]
}
export type {
  CreateTicketRequestPriorityEnum as TicketPriorityValue,
  ChangeStatusRequestStatusEnum as TicketStatusValue,
  CreateTicketRequestTypeEnum as TicketTypeValue,
} from '@/modules/generated/openapi_crm/api'
export {
  CreateTicketRequestPriorityEnum as TicketPriority,
  ChangeStatusRequestStatusEnum as TicketStatus,
  CreateTicketRequestTypeEnum as TicketType,
} from '@/modules/generated/openapi_crm/api'

export type TicketStatusString =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_CUSTOMER'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED'

export type TicketPriorityString = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type TicketTypeString = 'BUG' | 'FEATURE_REQUEST' | 'QUESTION' | 'INCIDENT'

export interface UpdateTicketRequest {
  title?: string
  description?: string
}

export interface AddCommentRequest {
  content: string
  isInternal?: boolean
}
