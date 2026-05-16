import { httpClient } from '@/core/api/http-client'
import type { RaListParams, RaListResult } from '@/core/api/resource-types'
import { toRaQueryString } from '@/core/api/resource-types'

import type { PermissionTargetType, PermittableResponseDto } from '../types/permission'

const DEFAULT_LIST_PARAMS: RaListParams = {
  pagination: { page: 1, perPage: 100 },
  sort: { field: 'id', order: 'ASC' },
}

interface PermittableListQuery {
  targetType: PermissionTargetType
  parentId?: string
  keyword?: string
  params?: RaListParams
}

export const permittableClient = {
  list: async ({
    targetType,
    parentId,
    keyword,
    params = {},
  }: PermittableListQuery): Promise<RaListResult<PermittableResponseDto>> => {
    const mergedParams: RaListParams = {
      ...DEFAULT_LIST_PARAMS,
      ...params,
      filter: {
        targetType,
        ...(parentId ? { parentId } : {}),
        ...(keyword && keyword.trim().length > 0 ? { q: keyword.trim() } : {}),
        ...(params.filter ?? {}),
      },
    }

    return httpClient.requestList<PermittableResponseDto>(
      `/user/permittables?${toRaQueryString(mergedParams)}`,
    )
  },
}
