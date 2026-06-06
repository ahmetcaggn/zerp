import { httpClient } from '@/core/api/http-client'
import type { RaListParams, RaListResult } from '@/core/api/resource-types'
import { toRaQueryString } from '@/core/api/resource-types'

import type {
  AnnouncementResponseDto,
  CreateAnnouncementRequestDto,
} from '../types/announcement'

export const announcementClient = {
  getList: (params: RaListParams = {}): Promise<RaListResult<AnnouncementResponseDto>> =>
    httpClient.requestList<AnnouncementResponseDto>(
      `/notification/announcements?${toRaQueryString(params)}`,
    ),

  getOne: (id: string): Promise<AnnouncementResponseDto> =>
    httpClient.get<AnnouncementResponseDto>(`/notification/announcements/${encodeURIComponent(id)}`),

  create: (body: CreateAnnouncementRequestDto): Promise<AnnouncementResponseDto> =>
    httpClient.post<AnnouncementResponseDto>('/notification/announcements', body),
}
