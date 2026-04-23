import { httpClient } from '@/core/api/http-client'
import type {
  EmailListHtmlRequestDto,
  EmailListRequestDto,
  EmailSingleRequestDto,
} from '../types/notification'

export const notificationClient = {
  sendSingle: (body: EmailSingleRequestDto): Promise<object> =>
    httpClient.post<object>('/notification/email/sendSingle', body),

  sendToList: (body: EmailListRequestDto): Promise<object> =>
    httpClient.post<object>('/notification/email/sendToList', body),

  sendToListHtml: (body: EmailListHtmlRequestDto): Promise<object> =>
    httpClient.post<object>('/notification/email/sendToListHtml', body),
}
