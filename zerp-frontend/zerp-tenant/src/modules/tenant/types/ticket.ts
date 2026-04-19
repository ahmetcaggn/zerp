export type {
  TicketResponse,
  CreateTicketRequest,
  AddCommentRequest,
  ChangeStatusRequest,
  ChangePriorityRequest,
  AssignTicketRequest,
  CommentResponse,
  AttachmentResponse,
  SlaTrackingResponse,
  TicketAssignmentResponse,
  WatcherResponse,
} from '@/modules/generated/openapi_crm/api'

export {
  CreateTicketRequestPriorityEnum as TicketPriority,
  CreateTicketRequestTypeEnum as TicketType,
  ChangeStatusRequestStatusEnum as TicketStatus,
} from '@/modules/generated/openapi_crm/api'

export type {
  CreateTicketRequestPriorityEnum as TicketPriorityValue,
  CreateTicketRequestTypeEnum as TicketTypeValue,
  ChangeStatusRequestStatusEnum as TicketStatusValue,
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
