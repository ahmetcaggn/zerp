'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import type { RaListParams } from '@/core/api/resource-types'
import { announcementClient } from '../api/announcement-client'
import type { CreateAnnouncementRequestDto } from '../types/announcement'

export function useAnnouncements(params: RaListParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.tenant.announcements, params],
    queryFn: () => announcementClient.getList(params),
  })
}

export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: [...queryKeys.tenant.announcements, id],
    queryFn: () => announcementClient.getOne(id),
    enabled: Boolean(id),
  })
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateAnnouncementRequestDto) => announcementClient.create(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.tenant.announcements })
    },
  })
}


