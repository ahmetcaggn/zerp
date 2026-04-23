'use client'
import { useMutation } from '@tanstack/react-query'
import { notificationClient } from '../api/notification-client'
import type {
  EmailListHtmlRequestDto,
  EmailListRequestDto,
  EmailSingleRequestDto,
} from '../types/notification'

export function useSendNotification() {
  return useMutation({
    mutationFn: (body: EmailSingleRequestDto) => notificationClient.sendSingle(body),
  })
}

export function useSendBulkNotification() {
  return useMutation({
    mutationFn: (body: EmailListRequestDto) => notificationClient.sendToList(body),
  })
}

export function useSendBulkNotificationHtml() {
  return useMutation({
    mutationFn: (body: EmailListHtmlRequestDto) => notificationClient.sendToListHtml(body),
  })
}
