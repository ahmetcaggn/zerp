export interface RaListParams {
  pagination?: { page: number; perPage: number }
  sort?: { field: string; order: 'ASC' | 'DESC' }
  filter?: Record<string, string>
  embed?: string
}

export interface RaListResult<T> {
  data: T[]
  total: number
}

export interface RaManyReferenceParams extends RaListParams {
  target: string
  targetId: string | number
}

export function toRaQueryString(params: RaListParams): string {
  const {
    pagination = { page: 1, perPage: 10 },
    sort = { field: 'id', order: 'ASC' },
    filter = {},
    embed,
  } = params

  const _start = (pagination.page - 1) * pagination.perPage
  const _end = pagination.page * pagination.perPage

  const qs = new URLSearchParams({
    _start: String(_start),
    _end: String(_end),
    _sort: sort.field,
    _order: sort.order,
    ...filter,
  })

  if (embed) qs.set('_embed', embed)

  return qs.toString()
}
