import { httpClient } from '@/core/api/http-client'
import { createResourceClient } from '@/core/api/resource-client'
import type { RaListParams, RaListResult } from '@/core/api/resource-types'
import { toRaQueryString } from '@/core/api/resource-types'

import type {
  CreateEmployeeRequestDto,
  EmployeeListResponseDto,
  EmployeeResponseDto,
  PageEmployeeListResponseDto,
  UpdateEmployeeRequestDto,
} from '../types/employee'

const base = createResourceClient<
  EmployeeResponseDto,
  EmployeeListResponseDto,
  CreateEmployeeRequestDto,
  UpdateEmployeeRequestDto,
  string
>('/employee')

export const employeeClient = {
  ...base,

  search: async (
    keyword: string,
    params: RaListParams = {},
  ): Promise<RaListResult<EmployeeListResponseDto>> => {
    const qs = toRaQueryString(params)
    const page = await httpClient.get<PageEmployeeListResponseDto>(
      `/employee/search?keyword=${encodeURIComponent(keyword)}&${qs}`,
    )
    return {
      data: page.content ?? [],
      total: page.totalElements ?? 0,
    }
  },

  checkUsername: (username: string): Promise<{ available: boolean }> =>
    httpClient.get<{ available: boolean }>(
      `/user/usernames/check?username=${encodeURIComponent(username)}`,
    ),
}
