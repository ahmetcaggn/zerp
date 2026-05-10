'use client'
import {
  type QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type { ResourceClient } from './resource-client'
import type { RaListParams } from './resource-types'

interface QueryOptions {
  enabled?: boolean
}

export function createResourceHooks<
  T,
  LT,
  C,
  U,
  ID extends string | number,
>(baseKey: QueryKey, client: ResourceClient<T, LT, C, U, ID>) {
  const listKey = (params?: RaListParams) =>
    [...(baseKey as unknown[]), 'list', params ?? {}] as const

  const oneKey = (id: ID) =>
    [...(baseKey as unknown[]), 'detail', id] as const

  return {
    useList: (params: RaListParams = {}, options: QueryOptions = {}) =>
      useQuery({
        queryKey: listKey(params),
        queryFn: () => client.getList(params),
        enabled: options.enabled ?? true,
      }),

    useOne: (id: ID | undefined, options: QueryOptions = {}) =>
      useQuery({
        queryKey: oneKey(id as ID),
        queryFn: () => client.getOne(id as ID),
        enabled: id !== undefined && (options.enabled ?? true),
      }),

    useCreate: () => {
      const qc = useQueryClient()
      return useMutation({
        mutationFn: (data: C) => client.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: baseKey as QueryKey }),
      })
    },

    useUpdate: () => {
      const qc = useQueryClient()
      return useMutation({
        mutationFn: ({ id, data }: { id: ID; data: U }) => client.update(id, data),
        onSuccess: (_, { id }) => {
          qc.invalidateQueries({ queryKey: baseKey as QueryKey })
          qc.invalidateQueries({ queryKey: oneKey(id) })
        },
      })
    },

    usePatch: () => {
      const qc = useQueryClient()
      return useMutation({
        mutationFn: ({ id, fields }: { id: ID; fields: Record<string, unknown> }) =>
          client.patch(id, fields),
        onSuccess: (_, { id }) => {
          qc.invalidateQueries({ queryKey: baseKey as QueryKey })
          qc.invalidateQueries({ queryKey: oneKey(id) })
        },
      })
    },

    useDelete: () => {
      const qc = useQueryClient()
      return useMutation({
        mutationFn: (id: ID) => client.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: baseKey as QueryKey }),
      })
    },

    useDeleteMany: () => {
      const qc = useQueryClient()
      return useMutation({
        mutationFn: (ids: ID[]) => client.deleteMany(ids),
        onSuccess: () => qc.invalidateQueries({ queryKey: baseKey as QueryKey }),
      })
    },
  }
}
