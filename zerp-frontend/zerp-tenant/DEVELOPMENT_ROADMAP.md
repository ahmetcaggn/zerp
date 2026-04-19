# zerp-tenant Frontend — Geliştirme Yol Haritası

> **Mimari Not:** Backend `IResourceController`, `ra-spring-data-provider` (React Admin Spring Data
> Provider) konvansiyonunu tam olarak implemente eder. React Admin framework'ü import edilmez;
> sadece aynı REST sözleşmesi (`_start`/`_end` pagination, `X-Total-Count` header, `GET /many`,
> `GET /of/{target}/{targetId}` gibi operasyonlar) frontend'de generic bir katmanla karşılanır.
> Bu katman bir kez yazılır, tüm kaynaklar onu kullanır.
>
> **Referans:** `zerp-admin/src/modules/generated/` altındaki OpenAPI istemcilerinden tip
> tanımları import edilir. Tüm implementasyonlar `zerp-frontend-template` kurallarına uyar.

---

## Faz 1 — Altyapı: React Admin Uyumlu Generic Resource Katmanı

> **Bu fazı atlamak olmaz.** Diğer tüm fazlar burada kurulan generic'lere oturur.
> Faz 1 tamamlandıktan sonra her yeni kaynak için yazılacak kod miktarı minimuma iner.

### 1.1 OpenAPI Generated Client'larını zerp-tenant'a Taşı

- `zerp-admin/src/modules/generated/openapi_crm/` → `zerp-tenant/src/modules/generated/openapi_crm/`
- `zerp-admin/src/modules/generated/openapi_employee/` → `zerp-tenant/src/modules/generated/openapi_employee/`
- `zerp-admin/src/modules/generated/openapi_notification/` → `zerp-tenant/src/modules/generated/openapi_notification/`
- Her paketin `package.json` bağımlılıklarını `zerp-tenant/package.json`'a ekle
- `tsconfig.json` path alias'larının çalıştığını doğrula (`pnpm typecheck`)

### 1.2 `modules/tenant/` Dizin Yapısını Oluştur

```
src/modules/tenant/
├── api/          # createResourceClient ile oluşturulan kaynak istemcileri
├── hooks/        # createResourceHooks ile oluşturulan React Query hook'ları
├── types/        # Tenant-özgü tip tanımları (generated'tan re-export + UI tipleri)
└── ui/           # React bileşenleri
```

---

### 1.3 `core/api/resource-types.ts` — React Admin Sözleşmesi Tipleri

**Dosya:** `src/core/api/resource-types.ts`

Bu dosya React Admin REST sözleşmesindeki parametreleri ve dönüş tiplerini TypeScript olarak tanımlar.

```typescript
// Pagination: React Admin 0-tabanlı _start/_end kullanır
// page=1, perPage=10 → _start=0, _end=10
// page=2, perPage=10 → _start=10, _end=20
export interface RaListParams {
  pagination?: { page: number; perPage: number }
  sort?: { field: string; order: 'ASC' | 'DESC' }
  filter?: Record<string, string>
  embed?: string
}

// getList ve getManyReference dönüş tipi — X-Total-Count header'dan gelen total dahil
export interface RaListResult<T> {
  data: T[]
  total: number
}

// getManyReference için ek parametreler
export interface RaManyReferenceParams extends RaListParams {
  target: string
  targetId: string | number
}

// RaListParams → fetch query string dönüşüm yardımcısı
export function toRaQueryString(params: RaListParams): string {
  const { pagination = { page: 1, perPage: 10 }, sort = { field: 'id', order: 'ASC' }, filter = {}, embed } = params
  const _start = (pagination.page - 1) * pagination.perPage
  const _end = pagination.page * pagination.perPage
  const base = new URLSearchParams({
    _start: String(_start),
    _end: String(_end),
    _sort: sort.field,
    _order: sort.order,
    ...filter,
  })
  if (embed) base.set('_embed', embed)
  return base.toString()
}
```

---

### 1.4 `BaseHttpClient`'a `requestList<T>` ve HTTP Kısayolları Ekle

**Dosya:** `src/core/api/base-http-client.ts` — genişletme (mevcut `request<T>` dokunulmaz)

**Eklenecek 1 — `requestList<T>`:** `X-Total-Count` header'ını okur, `RaListResult<T>` döner.
```typescript
async requestList<T>(endpoint: string, options: RequestOptions = {}): Promise<RaListResult<T>> {
  // Mevcut request döngüsünü kopyala; response'u discard etmeden önce header'ı oku
  // return { data: parseApiEnvelope<T[]>(payload), total: Number(response.headers.get('X-Total-Count') ?? 0) }
}
```

**Eklenecek 2 — HTTP kısayolları** (resource-client factory'de kullanmak için):
```typescript
get<T>(endpoint: string, options?: RequestOptions): Promise<T>
post<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T>
put<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T>
patch<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T>
del<T>(endpoint: string, options?: RequestOptions): Promise<T>
```

> **Not:** `request<T>()` methodu ve diğer mevcut davranışlar değişmez; yalnızca ek methodlar eklenir.

---

### 1.5 `core/api/resource-client.ts` — Generic ResourceClient Factory

**Dosya:** `src/core/api/resource-client.ts`

Bir kez yaz, her kaynak için çağır. Tüm `IResourceController` operasyonlarını karşılar.

```typescript
import { httpClient } from '@/core/api/http-client'
import type { RaListParams, RaListResult, RaManyReferenceParams } from './resource-types'
import { toRaQueryString } from './resource-types'

export interface ResourceClient<T, LT, C, U, ID> {
  // React Admin getList  → GET /basePath?_start&_end&_sort&_order&...filters
  getList(params: RaListParams): Promise<RaListResult<LT>>
  // React Admin getMany  → GET /basePath/many?id=1&id=2
  getMany(ids: ID[]): Promise<T[]>
  // React Admin getManyReference → GET /basePath/of/{target}/{targetId}?...
  getManyReference(params: RaManyReferenceParams): Promise<RaListResult<LT>>
  // React Admin getOne  → GET /basePath/{id}
  getOne(id: ID): Promise<T>
  // React Admin create  → POST /basePath
  create(data: C): Promise<T>
  // React Admin update (partial) → PATCH /basePath/{id}
  patch(id: ID, fields: Record<string, unknown>): Promise<T>
  // React Admin update (full)   → PUT /basePath/{id}
  update(id: ID, data: U): Promise<T>
  // React Admin delete  → DELETE /basePath/{id}
  delete(id: ID): Promise<void>
  // React Admin updateMany → PATCH /basePath?id=1&id=2
  patchMany(ids: ID[], fields: Record<string, unknown>): Promise<ID[]>
  // React Admin deleteMany → DELETE /basePath?id=1&id=2
  deleteMany(ids: ID[]): Promise<ID[]>
}

export function createResourceClient<T, LT, C, U, ID extends string | number>(
  basePath: string
): ResourceClient<T, LT, C, U, ID> {
  return {
    getList: (params) =>
      httpClient.requestList<LT>(`${basePath}?${toRaQueryString(params)}`),

    getMany: (ids) => {
      const qs = ids.map((id) => `id=${id}`).join('&')
      return httpClient.get<T[]>(`${basePath}/many?${qs}`)
    },

    getManyReference: ({ target, targetId, ...params }) =>
      httpClient.requestList<LT>(`${basePath}/of/${target}/${targetId}?${toRaQueryString(params)}`),

    getOne: (id) => httpClient.get<T>(`${basePath}/${id}`),

    create: (data) => httpClient.post<T>(basePath, data),

    patch: (id, fields) => httpClient.patch<T>(`${basePath}/${id}`, fields),

    update: (id, data) => httpClient.put<T>(`${basePath}/${id}`, data),

    delete: (id) => httpClient.del<void>(`${basePath}/${id}`),

    patchMany: (ids, fields) => {
      const qs = ids.map((id) => `id=${id}`).join('&')
      return httpClient.patch<ID[]>(`${basePath}?${qs}`, fields)
    },

    deleteMany: (ids) => {
      const qs = ids.map((id) => `id=${id}`).join('&')
      return httpClient.del<ID[]>(`${basePath}?${qs}`)
    },
  }
}
```

---

### 1.6 `core/api/resource-hooks.ts` — Generic React Query Hook Factory

**Dosya:** `src/core/api/resource-hooks.ts`

Her kaynak için tekrar yazılmasın diye ortak hook mantığı burada toplanır.

```typescript
import { useQuery, useMutation, useQueryClient, type QueryKey } from '@tanstack/react-query'
import type { ResourceClient, RaListParams } from './resource-client'

export function createResourceHooks<T, LT, C, U, ID extends string | number>(
  baseKey: QueryKey,
  client: ResourceClient<T, LT, C, U, ID>
) {
  const listKey = (params?: RaListParams) => [...baseKey, 'list', params] as const
  const oneKey = (id: ID) => [...baseKey, 'detail', id] as const

  return {
    useList: (params: RaListParams = {}) =>
      useQuery({ queryKey: listKey(params), queryFn: () => client.getList(params) }),

    useOne: (id: ID) =>
      useQuery({ queryKey: oneKey(id), queryFn: () => client.getOne(id) }),

    useCreate: () => {
      const qc = useQueryClient()
      return useMutation({
        mutationFn: (data: C) => client.create(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: baseKey }),
      })
    },

    useUpdate: () => {
      const qc = useQueryClient()
      return useMutation({
        mutationFn: ({ id, data }: { id: ID; data: U }) => client.update(id, data),
        onSuccess: (_, { id }) => {
          qc.invalidateQueries({ queryKey: baseKey })
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
          qc.invalidateQueries({ queryKey: baseKey })
          qc.invalidateQueries({ queryKey: oneKey(id) })
        },
      })
    },

    useDelete: () => {
      const qc = useQueryClient()
      return useMutation({
        mutationFn: (id: ID) => client.delete(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: baseKey }),
      })
    },

    useDeleteMany: () => {
      const qc = useQueryClient()
      return useMutation({
        mutationFn: (ids: ID[]) => client.deleteMany(ids),
        onSuccess: () => qc.invalidateQueries({ queryKey: baseKey }),
      })
    },
  }
}
```

---

### 1.7 `core/api/query-keys.ts`'e Tenant Namespace'lerini Ekle

Mevcut dosyaya `tenant` key'leri genişletilir:

```typescript
tenant: {
  storeSummary: ['tenant', 'store-summary'] as const,  // mevcut, korunur
  employees:    ['tenant', 'employees'] as const,
  teams:        ['tenant', 'teams'] as const,
  tickets:      ['tenant', 'tickets'] as const,
  notifications:['tenant', 'notifications'] as const,
},
```

> `listKey` ve `oneKey` dinamik parametreler artık `resource-hooks.ts` içinde `createResourceHooks`
> tarafından oluşturulur; query-keys.ts'de yalnızca base key'ler bulunur.

---

### 1.8 Temel i18n Namespace'lerini Ekle

`tr.ts` ve `en.ts` dosyalarına üst-düzey namespace'ler eklenir, `MessageDictionary` arayüzü güncellenir:
`employees`, `tickets`, `teams`, `notifications`, `dashboard`

---

## Faz 2 — Çalışan Yönetimi (Employee Module)

> Faz 1'deki generic altyapı hazır olduktan sonra bu fazın her adımı çok kısa olur.

**Backend Servis:** `employee` — gateway üzerinden `/employee/**`

### 2.1 Employee Tip Tanımları
**Dosya:** `src/modules/tenant/types/employee.ts`

`openapi_employee/api.ts`'ten şunları re-export et:
`EmployeeResponseDto`, `EmployeeListResponseDto`, `CreateEmployeeRequestDto`, `UpdateEmployeeRequestDto`

Enum'ları da re-export et: `EmploymentStatus`

### 2.2 Employee Resource Client
**Dosya:** `src/modules/tenant/api/employee-client.ts`

```typescript
import { createResourceClient } from '@/core/api/resource-client'
import { httpClient } from '@/core/api/http-client'
import type { EmployeeResponseDto, EmployeeListResponseDto,
              CreateEmployeeRequestDto, UpdateEmployeeRequestDto } from '../types/employee'
import type { RaListParams } from '@/core/api/resource-types'

export const employeeClient = {
  ...createResourceClient<
    EmployeeResponseDto,
    EmployeeListResponseDto,
    CreateEmployeeRequestDto,
    UpdateEmployeeRequestDto,
    number
  >('/employee'),

  // Employee'a özgü ek endpoint'ler (IResourceController dışı)
  search: (keyword: string, params: RaListParams = {}) =>
    httpClient.get<EmployeeListResponseDto[]>(
      `/employee/search?keyword=${encodeURIComponent(keyword)}&...`
    ),
  deleted: () => httpClient.get<EmployeeListResponseDto[]>('/employee/deleted'),
  deletedPaginated: (params: RaListParams) =>
    httpClient.requestList<EmployeeListResponseDto>(`/employee/deleted/paginated?...`),
}
```

### 2.3 Employee React Query Hook'ları
**Dosya:** `src/modules/tenant/hooks/use-employees.ts`

```typescript
import { createResourceHooks } from '@/core/api/resource-hooks'
import { queryKeys } from '@/core/api/query-keys'
import { employeeClient } from '../api/employee-client'

const {
  useList: useEmployees,
  useOne: useEmployee,
  useCreate: useCreateEmployee,
  useUpdate: useUpdateEmployee,
  usePatch: usePatchEmployee,
  useDelete: useDeleteEmployee,
  useDeleteMany: useDeleteManyEmployees,
} = createResourceHooks(queryKeys.tenant.employees, employeeClient)

export { useEmployees, useEmployee, useCreateEmployee, useUpdateEmployee,
         usePatchEmployee, useDeleteEmployee, useDeleteManyEmployees }

// Ek hook'lar (search, deleted) — standart olmayan endpoint'ler için elle yazılır
export function useEmployeeSearch(keyword: string, params: RaListParams = {}) { ... }
export function useDeletedEmployees() { ... }
```

### 2.4 Çalışan Listesi Sayfası
**Route:** `src/app/[locale]/(protected)/employees/page.tsx`
**Bileşen:** `src/modules/tenant/ui/employee-list.tsx`
- MUI DataGrid ile sayfalı liste (`useEmployees({ pagination: { page, perPage } })`)
- `RaListResult.total` → DataGrid `rowCount` prop'u
- Kolon: Ad Soyad, E-posta, Telefon, İşe Giriş, Durum chip, İşlemler
- Arama: debounced input → `useEmployeeSearch`
- Yeni çalışan butonu (modal açar veya form sayfasına yönlendirir)

### 2.5 Çalışan Detay / Düzenleme Sayfası
**Route:** `src/app/[locale]/(protected)/employees/[id]/page.tsx`
**Bileşen:** `src/modules/tenant/ui/employee-detail.tsx`
- `useEmployee(id)` ile veri
- Yönetici bağlantısı (`useEmployee(managerId)`)
- İletişim bilgileri listesi
- "Düzenle" butonu → form

### 2.6 Çalışan Form Bileşeni
**Bileşen:** `src/modules/tenant/ui/employee-form.tsx`
- React Hook Form + Zod şeması (`CreateEmployeeRequestDto` tipinden türetilir)
- `managerId` alanı: `useEmployees` ile autocomplete
- Contacts alanı: dinamik dizi (ekle/kaldır)
- `useCreateEmployee` / `useUpdateEmployee` — mod prop'una göre
- Başarı: liste sayfasına yönlendir + `showToast`

### 2.7 Silinmiş Çalışanlar Görünümü
**Bileşen:** `src/modules/tenant/ui/deleted-employees.tsx`
- `useDeletedEmployees()` ile liste
- Geri yükleme: `usePatchEmployee({ id, fields: { isActive: true } })`
- Ana çalışan listesinde sekme veya alt rota

---

## Faz 3 — Destek Talepleri (CRM — Ticket Module)

**Backend Servis:** `crm` — gateway üzerinden `/api/tickets/**`

> **Not:** CRM Ticket controller'ı `IResourceController`'ı extend etmez; endpoint'leri elle yazılmıştır.
> Bu nedenle `createResourceClient` kullanılmaz — ticket client elle yazılır.

### 3.1 Ticket Tip Tanımları
**Dosya:** `src/modules/tenant/types/ticket.ts`

`openapi_crm/api.ts`'ten re-export:
`TicketResponse`, `CreateTicketRequest`, `ChangeStatusRequest`, `ChangePriorityRequest`,
`AddCommentRequest`, `AssignTicketRequest`
Enum'lar: `Priority`, `Status`, `Type`

### 3.2 Ticket API Client
**Dosya:** `src/modules/tenant/api/ticket-client.ts`

```typescript
export const ticketClient = {
  // liste endpoint'i gateway/CRM'de varsa ekle; yoksa sadece getById
  getById: (id: string) => httpClient.get<TicketResponse>(`/api/tickets/${id}`),
  create: (body: CreateTicketRequest) => httpClient.post<TicketResponse>('/api/tickets', body),
  changeStatus: (id: string, body: ChangeStatusRequest) =>
    httpClient.patch<TicketResponse>(`/api/tickets/${id}/status`, body),
  changePriority: (id: string, body: ChangePriorityRequest) =>
    httpClient.patch<TicketResponse>(`/api/tickets/${id}/priority`, body),
  addComment: (id: string, body: AddCommentRequest) =>
    httpClient.post<TicketResponse>(`/api/tickets/${id}/comments`, body),
  close: (id: string) => httpClient.post<TicketResponse>(`/api/tickets/${id}/close`, {}),
}
```

### 3.3 Ticket React Query Hook'ları
**Dosya:** `src/modules/tenant/hooks/use-tickets.ts`

Elle yazılır (`createResourceHooks` burada kullanılmaz):
- `useTicket(id)` — `useQuery`
- `useCreateTicket()` — mutation
- `useChangeTicketStatus()` — mutation
- `useChangePriority()` — mutation
- `useAddComment()` — mutation
- `useCloseTicket()` — mutation

### 3.4 Destek Talepleri Listesi Sayfası
**Route:** `src/app/[locale]/(protected)/tickets/page.tsx`
**Bileşen:** `src/modules/tenant/ui/ticket-list.tsx`
- Durum chip renkleri: OPEN=info, IN_PROGRESS=warning, RESOLVED=success, CLOSED=default
- Öncelik renkleri: CRITICAL=error, HIGH=warning, MEDIUM=info, LOW=default
- Filtreler: durum, öncelik, tür (URL search params ile)
- Yeni talep butonu

### 3.5 Destek Talebi Detay Sayfası
**Route:** `src/app/[locale]/(protected)/tickets/[id]/page.tsx`
**Bileşen:** `src/modules/tenant/ui/ticket-detail.tsx`
- `useTicket(id)` ile veri
- Yorum zinciri + yorum ekleme formu
- Durum değiştirme aksiyonları (tenant kapayabilir)
- SLA tracking göstergesi

### 3.6 Destek Talebi Oluşturma Formu
**Bileşen:** `src/modules/tenant/ui/ticket-create-form.tsx`
- Alanlar: başlık, açıklama, öncelik, tür
- `tenantId` session'dan otomatik
- `useCreateTicket` ile submit

---

## Faz 4 — Takım Yönetimi (CRM — Team Module)

**Backend Servis:** `crm` — gateway üzerinden `/api/teams/**`
**Tenant Perspektifi:** Okuma odaklı (takımları oluşturmak admin yetkisindedir).

> Team controller `IResourceController`'ı extend eder. `createResourceClient` kullanılabilir;
> ancak tenant yalnızca `getList` ve `getOne` kullanacaksa sade client da yeterlidir.

### 4.1 Team Tip Tanımları
**Dosya:** `src/modules/tenant/types/team.ts`
`openapi_crm/api.ts`'ten: `TeamResponse`, `TeamMemberResponse`, enum `Role` re-export

### 4.2 Team Resource Client
**Dosya:** `src/modules/tenant/api/team-client.ts`

```typescript
export const teamClient = createResourceClient<
  TeamResponse, TeamResponse,
  CreateTeamRequest, UpdateTeamRequest,
  number
>('/api/teams')
```

### 4.3 Team React Query Hook'ları
**Dosya:** `src/modules/tenant/hooks/use-teams.ts`

```typescript
const { useList: useTeams, useOne: useTeam } =
  createResourceHooks(queryKeys.tenant.teams, teamClient)
export { useTeams, useTeam }
```

### 4.4 Takımlar Listesi Sayfası
**Route:** `src/app/[locale]/(protected)/teams/page.tsx`
**Bileşen:** `src/modules/tenant/ui/team-list.tsx`
- Kart veya tablo; aktif/pasif chip; üye sayısı

### 4.5 Takım Detay Sayfası
**Route:** `src/app/[locale]/(protected)/teams/[id]/page.tsx`
**Bileşen:** `src/modules/tenant/ui/team-detail.tsx`
- Üye listesi (LEADER/MEMBER rozeti)
- Bu takıma atanmış açık talepler

---

## Faz 5 — Bildirim Merkezi (Notification Module)

**Backend Servis:** `notification` — gateway üzerinden `/notification/email/**`

> Notification endpoint'leri `IResourceController`'dan bağımsızdır; client elle yazılır.

### 5.1 Notification Tip Tanımları
**Dosya:** `src/modules/tenant/types/notification.ts`
`openapi_notification/api.ts`'ten: `EmailSingleRequestDto`, `EmailListRequestDto`,
`EmailListHtmlRequestDto` re-export

### 5.2 Notification API Client
**Dosya:** `src/modules/tenant/api/notification-client.ts`

```typescript
export const notificationClient = {
  sendSingle: (body: EmailSingleRequestDto) =>
    httpClient.post<boolean>('/notification/email/sendSingle', body),
  sendToList: (body: EmailListRequestDto) =>
    httpClient.post<boolean>('/notification/email/sendToList', body),
  sendToListHtml: (body: EmailListHtmlRequestDto) =>
    httpClient.post<boolean>('/notification/email/sendToListHtml', body),
}
```

### 5.3 Notification React Query Hook'ları
**Dosya:** `src/modules/tenant/hooks/use-notifications.ts`
- `useSendNotification()` — mutation (sendSingle)
- `useSendBulkNotification()` — mutation (sendToList / sendToListHtml)

### 5.4 E-posta Gönderim Sayfası
**Route:** `src/app/[locale]/(protected)/notifications/page.tsx`
**Bileşen:** `src/modules/tenant/ui/notification-send-form.tsx`
- Alıcılar: chip input (serbest e-posta) + çalışan seçici (`useEmployees` entegrasyonu)
- Konu + gövde alanları
- HTML/düz metin sekme geçişi
- `useSendBulkNotification` ile submit

---

## Faz 6 — Dashboard & Özet Görünüm

> Önceki fazlar tamamlandıktan sonra inşa edilir; veri zaten hook'larda hazır.

### 6.1 Dashboard Sayfasını Güncelle
**Route:** `src/app/[locale]/(protected)/dashboard/page.tsx` (mevcut — genişlet)
**Bileşen:** `src/modules/tenant/ui/tenant-dashboard.tsx`

### 6.2 KPI Kartları
**Bileşen:** `src/modules/tenant/ui/dashboard-kpi-cards.tsx`
- Toplam Çalışan (`useEmployees` total)
- Açık Talepler (`useTickets` toplam)
- Kritik Talepler (filtreli sorgu)
- Aktif Takımlar (`useTeams` filtreli)

### 6.3 Son Aktiviteler
**Bileşen:** `src/modules/tenant/ui/dashboard-recent-activity.tsx`
- Son oluşturulan talepler (`useTickets({ sort: { field: 'createdAt', order: 'DESC' }, pagination: { page: 1, perPage: 5 } })`)
- Yakın zamanda eklenen çalışanlar (aynı pattern)

### 6.4 Hızlı Aksiyonlar
**Bileşen:** `src/modules/tenant/ui/dashboard-quick-actions.tsx`
- Yeni Destek Talebi, Yeni Çalışan, Takımlar kısayolları

---

## Dosya İsimlendirme Özeti

| Kaynak | Tip Dosyası | Client | Hooks | Sayfa(lar) |
|--------|-------------|--------|-------|-----------|
| Employee | `types/employee.ts` | `api/employee-client.ts` | `hooks/use-employees.ts` | `employees/`, `employees/[id]/` |
| Ticket | `types/ticket.ts` | `api/ticket-client.ts` | `hooks/use-tickets.ts` | `tickets/`, `tickets/[id]/` |
| Team | `types/team.ts` | `api/team-client.ts` | `hooks/use-teams.ts` | `teams/`, `teams/[id]/` |
| Notification | `types/notification.ts` | `api/notification-client.ts` | `hooks/use-notifications.ts` | `notifications/` |

**Generic altyapı (core/api/):**
`resource-types.ts` · `resource-client.ts` · `resource-hooks.ts`
+ `base-http-client.ts`'e eklenen `requestList<T>()` ve HTTP kısayolları

---

## Ek Öneriler — İleride Eklenebilecek Özellikler

### A. Gerçek Zamanlı Özellikler (socket_service — altyapı mevcut)
- `socket_service/PresenceController` WebSocket heartbeat üzerinden çalışan çevrimiçi durumu
- Yeni yorum/durum değişikliğinde anlık bildirim pop-up'ı
- Dashboard KPI sayaçlarının canlı güncellenmesi

### B. Profil & Hesap Yönetimi
- Tenant yöneticisi profil sayfası
- Tenant genelinde ayarlar (logo, iletişim)
- Keycloak üzerinden çok faktörlü kimlik doğrulama yönetimi

### C. Çalışan Self-Servis Portalı
- Çalışanın kendi profilini görüntülemesi / güncelleme talebi
- İzin talebi yönetimi (yeni backend modülü gerektirir)
- Bordro/maaş slip görüntüleme (yeni backend modülü gerektirir)

### D. Raporlama & Analitik
- Çalışan devir oranı grafiği (MUI X Charts)
- Destek talebi trend raporu (ay bazlı, durum dağılımı)
- Takım performans metrikleri
- CSV/PDF export

### E. Kaynak & Varlık Yönetimi (resource servisi — backend gelişince)
- Şirket araç/cihaz envanteri
- Çalışanlara kaynak atama
- `createResourceClient` ile birkaç satırda entegre edilebilir

### F. Satış Modülü (sale servisi — backend gelişince)
- Müşteri/lead yönetimi; teklif oluşturma; satış pipeline Kanban
- `createResourceClient` ile birkaç satırda entegre edilebilir

### G. Görev & Proje Yönetimi
- Çalışanlara görev atama; durum takibi (TODO/IN_PROGRESS/DONE)
- Proje bazlı gruplama

### H. Takvim & Planlama
- Çalışan tatil/izin takvimi
- Takım toplantı planlama
- Periyodik hatırlatıcı (notification servisi entegrasyonu)

### I. Belge Yönetimi
- Sözleşme/belge yükleme (dosya depolama için backend endpoint gerekir)
- Çalışan başına belge arşivi

### J. Granüler Rol Tabanlı Erişim
- `tenant_owner` / `tenant_manager` / `tenant_employee` rolleri
- Her sayfada `RoleGuard` bileşeni ile sayfa bazlı izin yönetimi

---

*Son güncelleme: 2026-04-19 — React Admin konvansiyonu ve generic resource katmanı eklendi.*
