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
  
  // TODO backend filter yapisi type safe olmadigi icin simdilik alttaki kisim yorum satiri olarak birakildi.

  // getList: (params: RaListParams = {}): Promise<RaListResult<EmployeeListResponseDto>> => {
  //   const merged: RaListParams = {
  //     ...params,
  //     filter: { 'deleted.eq': 'true', ...params.filter },
  //   }
  //   return base.getList(merged)
  // },

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

  deleted: (): Promise<EmployeeListResponseDto[]> =>
    httpClient.get<EmployeeListResponseDto[]>('/employee/deleted'),

  deletedPaginated: async (
    params: RaListParams = {},
  ): Promise<RaListResult<EmployeeListResponseDto>> => {
    const qs = toRaQueryString(params)
    const page = await httpClient.get<PageEmployeeListResponseDto>(
      `/employee/deleted/paginated?${qs}`,
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
