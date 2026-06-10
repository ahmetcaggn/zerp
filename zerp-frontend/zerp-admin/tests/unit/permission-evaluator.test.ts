import { describe, expect, it } from 'vitest'

import { createPermissionEvaluator, TENANT_ROOT_ID } from '@/core/permissions/permission-evaluator'

const tenantId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const ticketId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
const teamId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
const userId = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'
const commentId = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'

describe('createPermissionEvaluator', () => {
  it('keeps action-level checks exact', () => {
    const evaluator = createPermissionEvaluator([
      { action: 'ADMIN', targetType: 'TENANT', targetId: tenantId },
    ])

    expect(evaluator.hasAction('ADMIN')).toBe(true)
    expect(evaluator.hasAction('READ_TICKET')).toBe(false)
  })

  it('treats tenant root admin as an action-level override', () => {
    const evaluator = createPermissionEvaluator([
      { action: 'ADMIN', targetType: 'TENANT_ROOT', targetId: TENANT_ROOT_ID },
    ])

    expect(evaluator.hasAction('READ_USER')).toBe(true)
    expect(evaluator.hasAnyAction(['READ_USER', 'READ_TEAM'])).toBe(true)
    expect(evaluator.hasAllActions(['READ_USER', 'READ_TEAM'])).toBe(true)
  })

  it('grants ticket access from exact ticket, tenant, team, user, and root grants', () => {
    const target = {
      ticketId,
      tenantId,
      assignedTeamId: teamId,
      assignedAgentId: userId,
    }

    expect(
      createPermissionEvaluator([
        { action: 'UPDATE_TICKET', targetType: 'TICKET', targetId: ticketId },
      ]).hasTicketPermission('UPDATE_TICKET', target),
    ).toBe(true)

    expect(
      createPermissionEvaluator([
        { action: 'UPDATE_TICKET', targetType: 'TENANT', targetId: tenantId },
      ]).hasTicketPermission('UPDATE_TICKET', target),
    ).toBe(true)

    expect(
      createPermissionEvaluator([
        { action: 'UPDATE_TICKET', targetType: 'TEAM', targetId: teamId },
      ]).hasTicketPermission('UPDATE_TICKET', target),
    ).toBe(true)

    expect(
      createPermissionEvaluator([
        { action: 'UPDATE_TICKET', targetType: 'USER', targetId: userId },
      ]).hasTicketPermission('UPDATE_TICKET', target),
    ).toBe(true)

    expect(
      createPermissionEvaluator([
        { action: 'UPDATE_TICKET', targetType: 'TENANT_ROOT', targetId: TENANT_ROOT_ID },
      ]).hasTicketPermission('UPDATE_TICKET', target),
    ).toBe(true)
  })

  it('grants ticket child access from child, ticket, and tenant grants', () => {
    const target = {
      ticketId,
      tenantId,
      childTargetType: 'TICKET_COMMENT',
      childId: commentId,
    }

    expect(
      createPermissionEvaluator([
        { action: 'READ_TICKET_COMMENT', targetType: 'TICKET_COMMENT', targetId: commentId },
      ]).hasTicketPermission('READ_TICKET_COMMENT', target),
    ).toBe(true)

    expect(
      createPermissionEvaluator([
        { action: 'READ_TICKET_COMMENT', targetType: 'TICKET', targetId: ticketId },
      ]).hasTicketPermission('READ_TICKET_COMMENT', target),
    ).toBe(true)

    expect(
      createPermissionEvaluator([
        { action: 'READ_TICKET_COMMENT', targetType: 'TENANT', targetId: tenantId },
      ]).hasTicketPermission('READ_TICKET_COMMENT', target),
    ).toBe(true)
  })

  it('uses tenant and root admin grants as target-level overrides', () => {
    expect(
      createPermissionEvaluator([
        { action: 'ADMIN', targetType: 'TENANT', targetId: tenantId },
      ]).hasTicketPermission('DELETE_TICKET', { ticketId, tenantId }),
    ).toBe(true)

    expect(
      createPermissionEvaluator([
        { action: 'ADMIN', targetType: 'TENANT_ROOT', targetId: TENANT_ROOT_ID },
      ]).hasTicketPermission('DELETE_TICKET', { ticketId, tenantId }),
    ).toBe(true)
  })

  it('does not grant unrelated targets', () => {
    const evaluator = createPermissionEvaluator([
      {
        action: 'UPDATE_TICKET',
        targetType: 'TICKET',
        targetId: 'ffffffff-ffff-4fff-8fff-ffffffffffff',
      },
    ])

    expect(evaluator.hasTicketPermission('UPDATE_TICKET', { ticketId, tenantId })).toBe(false)
  })
})
