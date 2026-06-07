import { describe, expect, it } from 'vitest'

import {
  canTransitionTicketStatus,
  TICKET_STATUS_TRANSITIONS,
  type TicketStatusString,
} from '@/modules/admin/types/ticket'

const TICKET_STATUSES: TicketStatusString[] = [
  'OPEN',
  'IN_PROGRESS',
  'WAITING_CUSTOMER',
  'RESOLVED',
  'CLOSED',
  'CANCELLED',
]

describe('canTransitionTicketStatus', () => {
  it('allows only configured ticket status transitions', () => {
    for (const currentStatus of TICKET_STATUSES) {
      for (const newStatus of TICKET_STATUSES) {
        expect(canTransitionTicketStatus(currentStatus, newStatus)).toBe(
          TICKET_STATUS_TRANSITIONS[currentStatus].includes(newStatus),
        )
      }
    }
  })

  it('does not allow unchanged or unknown current statuses', () => {
    for (const status of TICKET_STATUSES) {
      expect(canTransitionTicketStatus(status, status)).toBe(false)
    }

    expect(canTransitionTicketStatus(undefined, 'OPEN')).toBe(false)
    expect(canTransitionTicketStatus('UNKNOWN' as TicketStatusString, 'OPEN')).toBe(false)
  })

  it('does not allow transitions from terminal statuses', () => {
    for (const status of TICKET_STATUSES) {
      expect(canTransitionTicketStatus('RESOLVED', status)).toBe(false)
      expect(canTransitionTicketStatus('CLOSED', status)).toBe(false)
      expect(canTransitionTicketStatus('CANCELLED', status)).toBe(false)
    }
  })
})
