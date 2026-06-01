import type { CurrentUserProfile } from '@/core/types/user'

import { httpClient } from './http-client'

export const currentUserClient = {
  getProfile: (): Promise<CurrentUserProfile> => httpClient.get<CurrentUserProfile>('/user/me'),
}
