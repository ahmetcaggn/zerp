import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'
import type { RaListParams, RaListResult } from '@/core/api/resource-types'
import { toRaQueryString } from '@/core/api/resource-types'

import type {
  PermissionActionHierarchyMap,
  PermissionCreateRequestDto,
  PermissionResponseDto,
} from '../types/permission'

const base = createResourceClient<
  PermissionResponseDto,
  PermissionResponseDto,
  PermissionCreateRequestDto,
  PermissionCreateRequestDto,
  number
>('/user/permissions')

const DEFAULT_LIST_PARAMS: RaListParams = {
  pagination: { page: 1, perPage: 200 },
  sort: { field: 'id', order: 'ASC' },
}

export const permissionClient = {
  ...base,

  getActions: (): Promise<PermissionActionHierarchyMap> =>
    httpClient.get<PermissionActionHierarchyMap>('/user/permissions/actions'),

  getAssignableActions: (): Promise<PermissionActionHierarchyMap> =>
    httpClient.get<PermissionActionHierarchyMap>('/user/permissions/actions-assignable'),

  listByUserId: (
    userId: string,
    params: RaListParams = {},
  ): Promise<RaListResult<PermissionResponseDto>> => {
    const mergedParams: RaListParams = {
      ...DEFAULT_LIST_PARAMS,
      ...params,
      filter: {
        'userId.eq': userId,
        ...(params.filter ?? {}),
      },
    }

    return httpClient.requestList<PermissionResponseDto>(
      `/user/permissions?${toRaQueryString(mergedParams)}`,
    )
  },
}
