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

export const IssueType = {
  ServiceLevel: 'SERVICE_LEVEL',
  Question: 'QUESTION',
} as const

export type IssueTypeValue = (typeof IssueType)[keyof typeof IssueType]

export const TicketType = IssueType
export type TicketTypeValue = IssueTypeValue

export type CreateTicketRequest = Omit<GeneratedCreateTicketRequest, 'tenantId' | 'type'> & {
  tenantId: string
  type?: IssueTypeValue
}
export type CommentResponse = GeneratedCommentResponse & { authorName?: string }
export type TicketResponse = Omit<GeneratedTicketResponse, 'comments' | 'type'> & {
  comments?: CommentResponse[]
  type?: IssueTypeValue
}
export type {
  CreateTicketRequestPriorityEnum as TicketPriorityValue,
  ChangeStatusRequestStatusEnum as TicketStatusValue,
} from '@/modules/generated/openapi_crm/api'
export {
  CreateTicketRequestPriorityEnum as TicketPriority,
  ChangeStatusRequestStatusEnum as TicketStatus,
} from '@/modules/generated/openapi_crm/api'

export type TicketStatusString =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_CUSTOMER'
  | 'RESOLVED'
  | 'CLOSED'
  | 'CANCELLED'

export type TicketPriorityString = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type TicketTypeString = IssueTypeValue

export interface UpdateTicketRequest {
  title?: string
  description?: string
}

export interface AddCommentRequest {
  content: string
  isInternal?: boolean
}
