# Faz 1 — Implementation Plan: Generic Resource Katmanı

> Bu plan PROGRESS.md madde sırasını takip eder.
> Her madde tamamlandığında PROGRESS.md güncellenir.

---

## Ön Koşul Kontrol Listesi

Başlamadan önce şunlar doğrulanmalı:
- `zerp-tenant/` içinde `pnpm install` çalışıyor
- `pnpm typecheck` hatasız geçiyor (baseline)
- `zerp-admin/src/modules/generated/` üç klasör içeriyor: `openapi_crm`, `openapi_employee`, `openapi_notification`

---

## Madde 1.1 — Generated Client'ları Kopyala

### Ne yapılacak

`zerp-admin/src/modules/generated/` altındaki üç OpenAPI istemcisini
`zerp-tenant/src/modules/generated/` altına kopyala.

Bu dosyalar Axios ile HTTP çağrısı **yapmak** için değil, yalnızca TypeScript **tip tanımlarını
(interface + enum) import etmek** için kullanılacak. Axios API sınıfları (`EmployeeApi`,
`TeamsApi`, vb.) zerp-tenant'ta hiç çağrılmayacak.

### Terminal komutu

```bash
# zerp-frontend/ dizininden çalıştır
mkdir -p zerp-tenant/src/modules/generated
cp -r zerp-admin/src/modules/generated/openapi_crm \
      zerp-admin/src/modules/generated/openapi_employee \
      zerp-admin/src/modules/generated/openapi_notification \
      zerp-tenant/src/modules/generated/
```

### package.json güncelleme

`zerp-tenant/package.json` → `dependencies` bölümüne ekle:

```json
"axios": "^1.13.5"
```

Ardından:
```bash
cd zerp-tenant && pnpm install
```

### Doğrulama

```bash
pnpm typecheck   # hata çıkmamalı (generated dosyalar ts'e dahil oldu)
```

---

## Madde 1.2 — `src/modules/tenant/` Dizin Yapısı

### Ne yapılacak

`src/modules/tenant/` altında dört boş dizin oluştur.
Dosyalar ilerleyen maddelerde eklenecek; burada sadece yapı kurulur.

```
src/modules/tenant/
├── api/
├── hooks/
├── types/
└── ui/
```

### Terminal komutu

```bash
mkdir -p src/modules/tenant/{api,hooks,types,ui}
```

> İçi boş dizinler git'e commit edilmez; ilk dosya eklendiğinde oluşmuş sayılır.
> Bu maddeyi "tamamlandı" kabul etmek için 1.3'te `types/` altına ilk dosya yeterlidir.

---

## Madde 1.3 — `src/core/api/resource-types.ts`

### Ne yapılacak

React Admin REST sözleşmesinin TypeScript karşılığını tanımlayan yeni dosya.
Diğer tüm core ve tenant dosyaları bu tipleri kullanacak.

### Dosya: `src/core/api/resource-types.ts` (YENİ)

```typescript
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
```

### Doğrulama

```bash
pnpm typecheck   # hata yok
```

---

## Madde 1.4 — `src/core/api/base-http-client.ts` Genişletme

### Ne yapılacak

Mevcut `request<T>()` metodu **dokunulmaz**. Yeni eklentiler:

1. `private rawFetch()` — fetch + retry mantığını merkezileştirir, `{payload, response}` döner
2. `request<T>()` — mevcut imza korunur, `rawFetch` üzerine refactor edilir
3. `requestList<T>()` — `X-Total-Count` header'ı okur, `RaListResult<T>` döner
4. HTTP kısayolları: `get`, `post`, `put`, `patch`, `del`

### Neden `rawFetch` gerekiyor

Mevcut `request<T>()`, `fetch` yanıtını aldıktan hemen sonra `response` nesnesini
kaybediyor (`safeJson` ile body tüketiliyor, header erişimi kapanıyor).
`requestList<T>()` ise `X-Total-Count` header'ını **body parse öncesinde** okumalı.
`rawFetch` hem payload hem response döndürerek her ikisini mümkün kılıyor.

### Dosya: `src/core/api/base-http-client.ts` (GÜNCELLE)

Mevcut içeriği şununla **tamamen değiştir**:

```typescript
import { sessionManager } from '@/core/auth/session-manager'
import type { ApiEnvelope, ApiErrorPayload } from '@/core/types/api'
import { ApiError } from '@/core/types/api'
import type { RaListResult } from './resource-types'

interface RequestOptions extends RequestInit {
  _retry?: boolean
}

export function parseApiEnvelope<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    'success' in payload &&
    'statusCode' in payload
  ) {
    return (payload as ApiEnvelope<T>).data
  }

  return payload as T
}

export class BaseHttpClient {
  constructor(private readonly baseUrl = '/api') {}

  // ─── Temel fetch — tüm public metodlar bunu kullanır ────────────────────────

  private async rawFetch(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<{ payload: unknown; response: Response }> {
    if (sessionManager.isSessionExpired) {
      throw new ApiError('Session expired', 401)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10_000)

    let response: Response
    try {
      response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers ?? {}),
        },
        signal: options.signal ?? controller.signal,
      })
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError('Request timeout', 408)
      }
      throw new ApiError('Service unavailable', 503)
    } finally {
      clearTimeout(timeoutId)
    }

    if (response.status === 401 && !options._retry) {
      const refreshed = await this.tryRefreshSession()
      if (!refreshed) {
        sessionManager.forceLogout()
        throw new ApiError('Session expired', 401)
      }
      return this.rawFetch(endpoint, { ...options, _retry: true })
    }

    const payload = await this.safeJson(response)

    if (!response.ok) {
      const apiPayload = payload as ApiErrorPayload | null
      const message = apiPayload?.message || apiPayload?.error || 'Request failed'
      throw new ApiError(message, response.status, apiPayload ?? undefined)
    }

    return { payload, response }
  }

  // ─── Mevcut imza — geriye dönük uyumlu ──────────────────────────────────────

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { payload } = await this.rawFetch(endpoint, options)
    return parseApiEnvelope<T>(payload)
  }

  // ─── React Admin getList / getManyReference için ─────────────────────────────

  async requestList<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<RaListResult<T>> {
    const { payload, response } = await this.rawFetch(endpoint, {
      ...options,
      method: 'GET',
    })
    const data = parseApiEnvelope<T[]>(payload)
    const total = Number(response.headers.get('X-Total-Count') ?? 0)
    return { data, total }
  }

  // ─── HTTP kısayolları ────────────────────────────────────────────────────────

  get<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) })
  }

  put<T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) })
  }

  patch<T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) })
  }

  del<T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  // ─── Yardımcılar ─────────────────────────────────────────────────────────────

  private async safeJson(response: Response): Promise<unknown> {
    const text = await response.text()
    if (!text) return null
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  private async tryRefreshSession(): Promise<boolean> {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      cache: 'no-store',
    }).catch(() => null)

    if (!response?.ok) return false

    const session = (await this.safeJson(response)) as { error?: string } | null
    return !session?.error
  }
}
```

### Doğrulama

```bash
pnpm typecheck   # hata yok
# Ayrıca mevcut dashboard sayfasının hâlâ yüklendiğini kontrol et (httpClient.request() bozulmadı)
```

---

## Madde 1.5 — `src/core/api/resource-client.ts`

### Ne yapılacak

`IResourceController`'ın 10 operasyonunu karşılayan generic factory fonksiyonu.
Her yeni kaynak için tek satır çağrı yeterli olacak.

### Dosya: `src/core/api/resource-client.ts` (YENİ)

```typescript
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
```

### Doğrulama

```bash
pnpm typecheck   # hata yok
```

---

## Madde 1.6 — `src/core/api/resource-hooks.ts`

### Ne yapılacak

`createResourceClient` ile oluşturulan client'ları React Query'ye bağlayan generic hook factory.
Her kaynak için `useList`, `useOne`, `useCreate`, `useUpdate`, `usePatch`, `useDelete`,
`useDeleteMany` hook'larını üretir.

### Tasarım Kararları

| Konu | Karar | Neden |
|------|-------|-------|
| `listKey` params içeriyor | `[...baseKey, 'list', params]` | Farklı sayfa/filtre = farklı cache girişi |
| Mutation'larda invalidate | `baseKey` prefix'i | Tüm liste cache'lerini temizler |
| Update/patch | Hem `baseKey` hem `oneKey` invalidate | Liste VE detay sayfası güncellenir |
| `enabled` flag | `useOne`'da `id !== undefined` | Sayfa yüklenmeden hook çağrılırsa hata vermez |

### Dosya: `src/core/api/resource-hooks.ts` (YENİ)

```typescript
'use client'
import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query'
import type { ResourceClient } from './resource-client'
import type { RaListParams } from './resource-types'

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
    useList: (params: RaListParams = {}) =>
      useQuery({
        queryKey: listKey(params),
        queryFn: () => client.getList(params),
      }),

    useOne: (id: ID | undefined) =>
      useQuery({
        queryKey: oneKey(id as ID),
        queryFn: () => client.getOne(id as ID),
        enabled: id !== undefined,
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
```

### Doğrulama

```bash
pnpm typecheck   # hata yok
```

---

## Madde 1.7 — `src/core/api/query-keys.ts` Güncelleme

### Ne yapılacak

Mevcut `tenant` namespace'ine yeni key'ler ekle.

### Mevcut içerik

```typescript
export const queryKeys = {
  tenant: {
    storeSummary: ['tenant', 'store-summary'] as const,
    employees: ['tenant', 'employees'] as const,
  },
  client: { ... },
  admin: { ... },
}
```

### Güncelleme — `src/core/api/query-keys.ts`

`tenant` bloğunu şununla değiştir:

```typescript
tenant: {
  storeSummary:  ['tenant', 'store-summary'] as const,  // mevcut — korunuyor
  employees:     ['tenant', 'employees'] as const,
  teams:         ['tenant', 'teams'] as const,
  tickets:       ['tenant', 'tickets'] as const,
  notifications: ['tenant', 'notifications'] as const,
},
```

> `listKey(params)` ve `oneKey(id)` dinamik alt key'leri artık `createResourceHooks` üretiyor;
> burada sadece base key'ler tanımlanır.

---

## Madde 1.8 — i18n Güncelleme

### Ne yapılacak

Üç dosya güncellenir:
1. `src/core/i18n/dictionaries/tr.ts` — Türkçe string'ler
2. `src/core/i18n/dictionaries/en.ts` — İngilizce string'ler
3. `src/core/i18n/messages.ts` — `MessageDictionary` arayüzü

### Mevcut `tr.ts` sonuna eklenecek (trMessages içine)

```typescript
  employees: {
    title: 'Çalışanlar',
    createButton: 'Çalışan Ekle',
    editButton: 'Düzenle',
    deleteButton: 'Sil',
    emptyState: 'Henüz çalışan bulunmuyor.',
    searchPlaceholder: 'Ad veya e-posta ile ara...',
    deletedTitle: 'Silinmiş Çalışanlar',
    restoreButton: 'Geri Yükle',
  },
  tickets: {
    title: 'Destek Talepleri',
    createButton: 'Yeni Talep',
    emptyState: 'Henüz destek talebi bulunmuyor.',
    addComment: 'Yorum Ekle',
    closeTicket: 'Talebi Kapat',
    commentPlaceholder: 'Yorumunuzu yazın...',
  },
  teams: {
    title: 'Takımlar',
    emptyState: 'Henüz takım bulunmuyor.',
    membersLabel: 'Üyeler',
  },
  notifications: {
    title: 'Bildirimler',
    sendButton: 'Gönder',
    recipientsLabel: 'Alıcılar',
    subjectLabel: 'Konu',
    bodyLabel: 'Mesaj',
    sentSuccess: 'Bildirim başarıyla gönderildi.',
  },
```

### Mevcut `en.ts` sonuna eklenecek (enMessages içine)

```typescript
  employees: {
    title: 'Employees',
    createButton: 'Add Employee',
    editButton: 'Edit',
    deleteButton: 'Delete',
    emptyState: 'No employees found.',
    searchPlaceholder: 'Search by name or email...',
    deletedTitle: 'Deleted Employees',
    restoreButton: 'Restore',
  },
  tickets: {
    title: 'Support Tickets',
    createButton: 'New Ticket',
    emptyState: 'No support tickets yet.',
    addComment: 'Add Comment',
    closeTicket: 'Close Ticket',
    commentPlaceholder: 'Write your comment...',
  },
  teams: {
    title: 'Teams',
    emptyState: 'No teams found.',
    membersLabel: 'Members',
  },
  notifications: {
    title: 'Notifications',
    sendButton: 'Send',
    recipientsLabel: 'Recipients',
    subjectLabel: 'Subject',
    bodyLabel: 'Message',
    sentSuccess: 'Notification sent successfully.',
  },
```

### `messages.ts` — `MessageDictionary` arayüzüne eklenecek

```typescript
  employees: {
    title: string
    createButton: string
    editButton: string
    deleteButton: string
    emptyState: string
    searchPlaceholder: string
    deletedTitle: string
    restoreButton: string
  }
  tickets: {
    title: string
    createButton: string
    emptyState: string
    addComment: string
    closeTicket: string
    commentPlaceholder: string
  }
  teams: {
    title: string
    emptyState: string
    membersLabel: string
  }
  notifications: {
    title: string
    sendButton: string
    recipientsLabel: string
    subjectLabel: string
    bodyLabel: string
    sentSuccess: string
  }
```

### Doğrulama

```bash
pnpm typecheck   # MessageDictionary ile tr/en uyumu kontrol edilir, hata yok
```

---

## Faz 1 Sonu — Son Doğrulama

```bash
pnpm typecheck   # sıfır hata
pnpm lint        # sıfır uyarı (unused import, any, vb. yok)
```

Yeni oluşturulan dosyalar:
```
src/core/api/resource-types.ts      ← RaListParams, RaListResult, toRaQueryString
src/core/api/resource-client.ts     ← createResourceClient factory
src/core/api/resource-hooks.ts      ← createResourceHooks factory
src/modules/generated/openapi_crm/
src/modules/generated/openapi_employee/
src/modules/generated/openapi_notification/
src/modules/tenant/api/             ← boş (Faz 2'de dolacak)
src/modules/tenant/hooks/           ← boş (Faz 2'de dolacak)
src/modules/tenant/types/           ← boş (Faz 2'de dolacak)
src/modules/tenant/ui/              ← boş (Faz 2'de dolacak)
```

Güncellenen dosyalar:
```
src/core/api/base-http-client.ts    ← rawFetch + requestList + HTTP kısayolları
src/core/api/query-keys.ts          ← tenant namespace genişletildi
src/core/i18n/dictionaries/tr.ts    ← employees/tickets/teams/notifications
src/core/i18n/dictionaries/en.ts    ← aynısı İngilizce
src/core/i18n/messages.ts           ← MessageDictionary genişletildi
package.json                        ← axios bağımlılığı
```

---

*Bu plan tamamlandığında Faz 2'nin implementation planı aynı formatta hazırlanacak.*
