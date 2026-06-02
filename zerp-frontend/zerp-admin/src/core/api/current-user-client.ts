import type { CurrentUserEmployeeProfile } from '@/core/types/user'

import { httpClient } from './http-client'

export const currentUserClient = {
  getProfile: (): Promise<CurrentUserEmployeeProfile> =>
    httpClient.get<CurrentUserEmployeeProfile>('/user/me'),
}
