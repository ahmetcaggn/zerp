export type AnnouncementRecipientMode = 'all' | 'employees'

export interface AnnouncementRecipientResponseDto {
  employeeId?: string
  displayName?: string
  email?: string
}

export interface AnnouncementResponseDto {
  id?: string
  title?: string
  content?: string
  recipientMode?: AnnouncementRecipientMode
  recipients?: AnnouncementRecipientResponseDto[]
  recipientCount?: number
  senderId?: string
  sender?: string
  createdBy?: string
  createdAt?: string
}

export interface CreateAnnouncementRequestDto {
  title: string
  content: string
  recipientMode: AnnouncementRecipientMode
  employeeIds?: string[]
}
