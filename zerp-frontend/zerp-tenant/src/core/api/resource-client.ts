import { httpClient } from '@/core/api/http-client'
import type { RaListParams, RaListResult, RaManyReferenceParams } from './resource-types'
import { toRaQueryString } from './resource-types'

export interface ResourceClient<T, LT, C, U, ID extends string | number> {
  getList(params?: RaListParams): Promise<RaListResult<LT>>
  getMany(ids: ID[]): Promise<T[]>
  getManyReference(params: RaManyReferenceParams): Promise<RaListResult<LT>>
  getOne(id: ID): Promise<T>
  create(data: C): Promise<T>
  patch(id: ID, fields: Record<string, unknown>): Promise<T>
  update(id: ID, data: U): Promise<T>
  delete(id: ID): Promise<void>
  patchMany(ids: ID[], fields: Record<string, unknown>): Promise<ID[]>
  deleteMany(ids: ID[]): Promise<ID[]>
}

export function createResourceClient<
  T,
  LT,
  C,
  U,
  ID extends string | number,
>(basePath: string): ResourceClient<T, LT, C, U, ID> {
  return {
    getList: (params = {}) =>
      httpClient.requestList<LT>(`${basePath}?${toRaQueryString(params)}`),

    getMany: (ids) => {
      const qs = ids.map((id) => `id=${encodeURIComponent(id)}`).join('&')
      return httpClient.get<T[]>(`${basePath}/many?${qs}`)
    },

    getManyReference: ({ target, targetId, ...params }) =>
      httpClient.requestList<LT>(
        `${basePath}/of/${encodeURIComponent(target)}/${encodeURIComponent(targetId)}?${toRaQueryString(params)}`,
      ),

    getOne: (id) => httpClient.get<T>(`${basePath}/${id}`),

    create: (data) => httpClient.post<T>(basePath, data),

    patch: (id, fields) => httpClient.patch<T>(`${basePath}/${id}`, fields),

    update: (id, data) => httpClient.put<T>(`${basePath}/${id}`, data),

    delete: (id) => httpClient.del<void>(`${basePath}/${id}`),

    patchMany: (ids, fields) => {
      const qs = ids.map((id) => `id=${encodeURIComponent(id)}`).join('&')
      return httpClient.patch<ID[]>(`${basePath}?${qs}`, fields)
    },

    deleteMany: (ids) => {
      const qs = ids.map((id) => `id=${encodeURIComponent(id)}`).join('&')
      return httpClient.del<ID[]>(`${basePath}?${qs}`)
    },
  }
}
