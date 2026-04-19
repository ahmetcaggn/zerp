# Faz 3 — Implementation Plan: Destek Talepleri (CRM Ticket)

> PROGRESS.md madde sırasını takip eder. Her madde bitince PROGRESS.md işaretlenir.

---

## Önemli Kısıtlar (Başlamadan Önce)

| Konu | Durum |
|------|-------|
| `GET /api/tickets` list endpoint'i | **Backend'de yok.** `TicketController` yalnızca `POST /`, `GET /{id}` ve işlem endpoint'lerine sahip. Liste sayfası ID bazlı lookup + önbellek üzerinden çalışacak. |
| `tenantId` kaynağı | Session'da `tenantId` alanı yok — form alanı olarak kullanıcıdan alınacak; ileride JWT claim'den otomatik doldurulabilir. |
| Ticket controller RA pattern kullanmıyor | `createResourceClient` / `createResourceHooks` kullanılmaz — tüm client ve hook'lar elle yazılır. |
| Tenant kullanıcısı yapabilecekleri | Talep oluştur, yoruma yaz (`isInternal: false`), talebi kapat. Atama ve durum değiştirme admin yetkisindedir. |
| `TicketResponse.status/priority/type` | Generated dosyada `string` — plan'da spesifik union type alias'ları tanımlanacak. |

---

## Madde 3.1 — `src/modules/tenant/types/ticket.ts`

### Ne yapılacak

Generated CRM tiplerini re-export et. `TicketResponse.status`, `priority`, `type`
alanları `string` olarak geldiğinden bunlar için dar union type'lar tanımla.

### Dosya: `src/modules/tenant/types/ticket.ts` (YENİ)

```typescript
export type {
  TicketResponse,
  CreateTicketRequest,
  AddCommentRequest,
  ChangeStatusRequest,
  ChangePriorityRequest,
  AssignTicketRequest,
  CommentResponse,
  AttachmentResponse,
  SlaTrackingResponse,
  TicketAssignmentResponse,
  WatcherResponse,
} from '@/modules/generated/openapi_crm/api'

export {
  CreateTicketRequestPriorityEnum as TicketPriority,
  CreateTicketRequestTypeEnum as TicketType,
  ChangeStatusRequestStatusEnum as TicketStatus,
} from '@/modules/generated/openapi_crm/api'

export type {
  CreateTicketRequestPriorityEnum as TicketPriorityValue,
  CreateTicketRequestTypeEnum as TicketTypeValue,
  ChangeStatusRequestStatusEnum as TicketStatusValue,
} from '@/modules/generated/openapi_crm/api'

// TicketResponse'daki string alanları için narrow type alias'lar
export type TicketStatusString =
  | 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER'
  | 'RESOLVED' | 'CLOSED' | 'CANCELLED'

export type TicketPriorityString = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type TicketTypeString = 'BUG' | 'FEATURE_REQUEST' | 'QUESTION' | 'INCIDENT'
```

---

## Madde 3.2 — `src/modules/tenant/api/ticket-client.ts`

### Ne yapılacak

Ticket endpoint'lerini tek tek saran client nesnesi. `IResourceController`
implement edilmediği için `createResourceClient` kullanılmaz.

### Endpoint Haritası

| Method | Path | Ne için |
|--------|------|---------|
| `POST /api/tickets` | `create` | Yeni talep |
| `GET /api/tickets/{id}` | `getById` | Tek talep detayı |
| `POST /api/tickets/{id}/comments` | `addComment` | Yorum ekle |
| `POST /api/tickets/{id}/close` | `close` | Talebi kapat |
| `PATCH /api/tickets/{id}/status` | `changeStatus` | Durum değiştir (admin — ileride) |
| `PATCH /api/tickets/{id}/priority` | `changePriority` | Öncelik değiştir (admin — ileride) |

### Dosya: `src/modules/tenant/api/ticket-client.ts` (YENİ)

```typescript
import { httpClient } from '@/core/api/http-client'
import type {
  AddCommentRequest,
  ChangePriorityRequest,
  ChangeStatusRequest,
  CreateTicketRequest,
  TicketResponse,
} from '../types/ticket'

export const ticketClient = {
  getById: (id: number): Promise<TicketResponse> =>
    httpClient.get<TicketResponse>(`/api/tickets/${id}`),

  create: (body: CreateTicketRequest): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>('/api/tickets', body),

  addComment: (id: number, body: AddCommentRequest): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/api/tickets/${id}/comments`, body),

  close: (id: number): Promise<TicketResponse> =>
    httpClient.post<TicketResponse>(`/api/tickets/${id}/close`, {}),

  changeStatus: (id: number, body: ChangeStatusRequest): Promise<TicketResponse> =>
    httpClient.patch<TicketResponse>(`/api/tickets/${id}/status`, body),

  changePriority: (id: number, body: ChangePriorityRequest): Promise<TicketResponse> =>
    httpClient.patch<TicketResponse>(`/api/tickets/${id}/priority`, body),
}
```

---

## Madde 3.3 — `src/modules/tenant/hooks/use-tickets.ts`

### Ne yapılacak

`createResourceHooks` yerine elle yazılan hook'lar. Her mutation'da
ilgili ticket cache'ini invalidate et.

### Query key stratejisi

```
queryKeys.tenant.tickets                  → tüm ticket cache'i (base)
[...tickets, 'detail', id]               → tek ticket
```

`query-keys.ts`'de halihazırda `tickets: ['tenant', 'tickets']` mevcut — ek
key tanımına gerek yok.

### Dosya: `src/modules/tenant/hooks/use-tickets.ts` (YENİ)

```typescript
'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { ticketClient } from '../api/ticket-client'
import type {
  AddCommentRequest,
  ChangePriorityRequest,
  ChangeStatusRequest,
  CreateTicketRequest,
} from '../types/ticket'

const ticketDetailKey = (id: number) =>
  [...queryKeys.tenant.tickets, 'detail', id] as const

export function useTicket(id: number | undefined) {
  return useQuery({
    queryKey: ticketDetailKey(id!),
    queryFn: () => ticketClient.getById(id!),
    enabled: id !== undefined,
  })
}

export function useCreateTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateTicketRequest) => ticketClient.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.tenant.tickets }),
  })
}

export function useAddComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: AddCommentRequest }) =>
      ticketClient.addComment(id, body),
    onSuccess: (_, { id }) =>
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) }),
  })
}

export function useCloseTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => ticketClient.close(id),
    onSuccess: (_, id) => qc.invalidateQueries({ queryKey: ticketDetailKey(id) }),
  })
}

export function useChangeTicketStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ChangeStatusRequest }) =>
      ticketClient.changeStatus(id, body),
    onSuccess: (_, { id }) =>
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) }),
  })
}

export function useChangePriority() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ChangePriorityRequest }) =>
      ticketClient.changePriority(id, body),
    onSuccess: (_, { id }) =>
      qc.invalidateQueries({ queryKey: ticketDetailKey(id) }),
  })
}
```

---

## Madde 3.4 — Destek Talepleri Listesi Sayfası

### routes.ts güncellemesi

`src/core/constants/routes.ts` — `ROUTES` nesnesine ekle:
```typescript
tickets: '/tickets',
```

### Sayfa: `src/app/[locale]/(protected)/tickets/page.tsx` (YENİ)

```typescript
import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { TicketList } from '@/modules/tenant/ui/ticket-list'

export const metadata: Metadata = buildMetadata({ title: 'Support Tickets' })

export default function TicketsPage() {
  return <TicketList />
}
```

### Bileşen: `src/modules/tenant/ui/ticket-list.tsx` (YENİ)

**Backend list endpoint olmadığından** bu sayfa şunları sunar:
1. Sağ üst: "Yeni Talep" butonu → `TicketCreateDialog` açar
2. ID ile talep arama alanı → değer girilince `useTicket(id)` ile detayı inline gösterir
3. Daha önce görüntülenen talepler React Query cache'inden otomatik listelenir
4. Backend tarafında list endpoint eklendiğinde bu bileşen güncellenecek (not olarak bırakılır)

```typescript
'use client'
import {
  Alert, Box, Button, Chip, CircularProgress,
  Paper, TextField, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Route } from 'next'
import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useTicket } from '../hooks/use-tickets'
import type { TicketStatusString, TicketPriorityString } from '../types/ticket'
import { TicketCreateDialog } from './ticket-create-dialog'

const STATUS_COLOR: Record<TicketStatusString, 'info' | 'warning' | 'secondary' | 'success' | 'default' | 'error'> = {
  OPEN: 'info',
  IN_PROGRESS: 'warning',
  WAITING_CUSTOMER: 'secondary',
  RESOLVED: 'success',
  CLOSED: 'default',
  CANCELLED: 'error',
}

const PRIORITY_COLOR: Record<TicketPriorityString, 'error' | 'warning' | 'info' | 'default'> = {
  CRITICAL: 'error',
  HIGH: 'warning',
  MEDIUM: 'info',
  LOW: 'default',
}

export function TicketList() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [lookupInput, setLookupInput] = useState('')
  const [lookupId, setLookupId] = useState<number | undefined>()

  const { data: lookedUpTicket, isLoading, error } = useTicket(lookupId)

  if (error) showToast(getUserFriendlyError(error), { severity: 'error' })

  function handleLookup() {
    const parsed = parseInt(lookupInput, 10)
    if (!isNaN(parsed) && parsed > 0) setLookupId(parsed)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">{t('tickets.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
          {t('tickets.createButton')}
        </Button>
      </Box>

      {/* Backend list endpoint hazır olunca bu uyarı kaldırılır */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Talep listesi için backend desteği bekleniyor. ID ile arama yapabilirsiniz.
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          size="small"
          label="Talep ID"
          type="number"
          value={lookupInput}
          onChange={(e) => setLookupInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
          sx={{ width: 200 }}
        />
        <Button variant="outlined" onClick={handleLookup}>Ara</Button>
      </Box>

      {isLoading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}

      {lookedUpTicket && (
        <Paper
          variant="outlined"
          sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
          onClick={() => router.push(`${ROUTES.tickets}/${lookedUpTicket.id}` as Route)}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                #{lookedUpTicket.id} — {lookedUpTicket.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {lookedUpTicket.description}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
              {lookedUpTicket.status && (
                <Chip
                  label={lookedUpTicket.status}
                  color={STATUS_COLOR[lookedUpTicket.status as TicketStatusString] ?? 'default'}
                  size="small"
                />
              )}
              {lookedUpTicket.priority && (
                <Chip
                  label={lookedUpTicket.priority}
                  color={PRIORITY_COLOR[lookedUpTicket.priority as TicketPriorityString] ?? 'default'}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Oluşturulma: {lookedUpTicket.createdAt}
          </Typography>
        </Paper>
      )}

      <TicketCreateDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </Box>
  )
}
```

---

## Madde 3.5 — Destek Talebi Detay Sayfası

### Sayfa: `src/app/[locale]/(protected)/tickets/[id]/page.tsx` (YENİ)

```typescript
import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { TicketDetail } from '@/modules/tenant/ui/ticket-detail'

export const metadata: Metadata = buildMetadata({ title: 'Ticket Detail' })

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <TicketDetail id={Number(id)} />
}
```

### Bileşen: `src/modules/tenant/ui/ticket-detail.tsx` (YENİ)

Özellikler:
- `useTicket(id)` ile veri
- Üst şerit: durum chip, öncelik chip, tür chip, oluşturulma tarihi
- Açıklama kartı
- Atama bilgisi (takım + ajan, varsa)
- SLA göstergesi (first response ve resolution hedef/gerçek)
- Yorum zinciri — internal yorumlar gri arka plan ile ayrıştırılır
- Alt form: yorum ekleme
- Aksiyonlar: "Talebi Kapat" butonu (sadece OPEN/IN_PROGRESS/WAITING_CUSTOMER durumlarında görünür)
- Geri butonu → `/tickets`

```typescript
'use client'
import {
  Alert, Box, Button, Chip, CircularProgress,
  Divider, Paper, TextField, Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SendIcon from '@mui/icons-material/Send'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useAddComment, useCloseTicket, useTicket } from '../hooks/use-tickets'
import type { TicketPriorityString, TicketStatusString } from '../types/ticket'

const STATUS_COLOR: Record<TicketStatusString, 'info' | 'warning' | 'secondary' | 'success' | 'default' | 'error'> = {
  OPEN: 'info',
  IN_PROGRESS: 'warning',
  WAITING_CUSTOMER: 'secondary',
  RESOLVED: 'success',
  CLOSED: 'default',
  CANCELLED: 'error',
}

const PRIORITY_COLOR: Record<TicketPriorityString, 'error' | 'warning' | 'info' | 'default'> = {
  CRITICAL: 'error',
  HIGH: 'warning',
  MEDIUM: 'info',
  LOW: 'default',
}

const CLOSEABLE_STATUSES: TicketStatusString[] = ['OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER']

interface Props { id: number }

export function TicketDetail({ id }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [commentText, setCommentText] = useState('')

  const { data: ticket, isLoading, error } = useTicket(id)
  const { mutate: addComment, isPending: isCommenting } = useAddComment()
  const { mutate: closeTicket, isPending: isClosing } = useCloseTicket()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    showToast(getUserFriendlyError(error), { severity: 'error' })
    return null
  }

  if (!ticket) return null

  const status = ticket.status as TicketStatusString | undefined
  const priority = ticket.priority as TicketPriorityString | undefined
  const isCloseable = status !== undefined && CLOSEABLE_STATUSES.includes(status)

  function handleAddComment() {
    if (!commentText.trim()) return
    addComment(
      { id, body: { content: commentText.trim(), isInternal: false } },
      {
        onSuccess: () => {
          setCommentText('')
          showToast('Yorum eklendi.', { severity: 'success' })
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  function handleClose() {
    closeTicket(id, {
      onSuccess: () => showToast('Talep kapatıldı.', { severity: 'success' }),
      onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
    })
  }

  const externalComments = (ticket.comments ?? []).filter((c) => !c.isInternal)

  return (
    <Box>
      {/* Üst bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push(ROUTES.tickets)}>
          {t('tickets.title')}
        </Button>
        {isCloseable && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<CheckCircleIcon />}
            onClick={handleClose}
            disabled={isClosing}
          >
            {t('tickets.closeTicket')}
          </Button>
        )}
      </Box>

      {/* Başlık ve chip'ler */}
      <Typography variant="h5" sx={{ mb: 1 }}>
        #{ticket.id} — {ticket.title}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
        {status && (
          <Chip label={status} color={STATUS_COLOR[status] ?? 'default'} size="small" />
        )}
        {priority && (
          <Chip label={priority} color={PRIORITY_COLOR[priority] ?? 'default'} size="small" variant="outlined" />
        )}
        {ticket.type && (
          <Chip label={ticket.type} size="small" variant="outlined" />
        )}
        <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
          {ticket.createdAt}
        </Typography>
      </Box>

      {/* Açıklama */}
      {ticket.description && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="body1">{ticket.description}</Typography>
        </Paper>
      )}

      {/* Atama bilgisi */}
      {ticket.currentAssignment && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Atama</Typography>
          <Typography variant="body2">
            Takım ID: {ticket.currentAssignment.teamId ?? '—'}
            {ticket.currentAssignment.agentPartyId && ` · Ajan: ${ticket.currentAssignment.agentPartyId}`}
          </Typography>
        </Paper>
      )}

      {/* SLA */}
      {ticket.slaTracking && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>SLA Takibi</Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="text.secondary">İlk Yanıt Hedefi</Typography>
              <Typography variant="body2">{ticket.slaTracking.firstResponseDueAt ?? '—'}</Typography>
              {ticket.slaTracking.isFirstResponseBreached && (
                <Alert severity="error" sx={{ py: 0, px: 1, mt: 0.5 }}>İhlal</Alert>
              )}
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Çözüm Hedefi</Typography>
              <Typography variant="body2">{ticket.slaTracking.resolutionDueAt ?? '—'}</Typography>
              {ticket.slaTracking.isResolutionBreached && (
                <Alert severity="error" sx={{ py: 0, px: 1, mt: 0.5 }}>İhlal</Alert>
              )}
            </Box>
          </Box>
        </Paper>
      )}

      {/* Yorumlar */}
      <Typography variant="subtitle1" sx={{ mb: 2 }}>Yorumlar ({externalComments.length})</Typography>

      {externalComments.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {t('tickets.emptyState')}
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {externalComments.map((comment) => (
            <Paper key={comment.id} variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {comment.authorId ?? 'Bilinmeyen'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {comment.createdAt}
                </Typography>
              </Box>
              <Typography variant="body2">{comment.content}</Typography>
            </Paper>
          ))}
        </Box>
      )}

      {/* Yorum ekleme formu — kapalı talepler için devre dışı */}
      {status !== 'CLOSED' && status !== 'CANCELLED' && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('tickets.addComment')}</Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <TextField
              multiline
              minRows={2}
              fullWidth
              placeholder={t('tickets.commentPlaceholder')}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              size="small"
            />
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleAddComment}
              disabled={isCommenting || !commentText.trim()}
              sx={{ flexShrink: 0 }}
            >
              Gönder
            </Button>
          </Box>
        </>
      )}
    </Box>
  )
}
```

---

## Madde 3.6 — Destek Talebi Oluşturma Formu

### Bileşen: `src/modules/tenant/ui/ticket-create-dialog.tsx` (YENİ)

Özellikler:
- Dialog içinde çalışır
- Zorunlu alan: `title`
- İsteğe bağlı: `description`, `priority` (default: MEDIUM), `type` (default: QUESTION), `tenantId`
- `tenantId` bilgi notu ile birlikte text field (JWT'den otomatik gelene kadar)
- Başarı → detay sayfasına yönlendir

```typescript
'use client'
import {
  Box, Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, FormHelperText,
  InputLabel, MenuItem, Select, TextField, Typography,
} from '@mui/material'
import type { Route } from 'next'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ROUTES } from '@/core/constants/routes'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useCreateTicket } from '../hooks/use-tickets'
import { TicketPriority, TicketType } from '../types/ticket'

interface Props {
  open: boolean
  onClose: () => void
}

const PRIORITY_OPTIONS = Object.values(TicketPriority)
const TYPE_OPTIONS = Object.values(TicketType)

export function TicketCreateDialog({ open, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<string>(TicketPriority.Medium)
  const [type, setType] = useState<string>(TicketType.Question)
  const [tenantId, setTenantId] = useState('')

  const { mutate: createTicket, isPending } = useCreateTicket()

  function handleSubmit() {
    if (!title.trim()) {
      showToast('Başlık zorunludur.', { severity: 'warning' })
      return
    }

    createTicket(
      {
        title: title.trim(),
        ...(description && { description }),
        ...(tenantId && { tenantId }),
        priority: priority as typeof TicketPriority[keyof typeof TicketPriority],
        type: type as typeof TicketType[keyof typeof TicketType],
      },
      {
        onSuccess: (ticket) => {
          showToast('Destek talebi oluşturuldu.', { severity: 'success' })
          onClose()
          if (ticket.id !== undefined) {
            router.push(`${ROUTES.tickets}/${ticket.id}` as Route)
          }
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('tickets.createButton')}</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Başlık *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="small"
            fullWidth
          />

          <TextField
            label="Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            size="small"
            fullWidth
            multiline
            minRows={3}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Öncelik</InputLabel>
              <Select value={priority} label="Öncelik" onChange={(e) => setPriority(e.target.value)}>
                {PRIORITY_OPTIONS.map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Tür</InputLabel>
              <Select value={type} label="Tür" onChange={(e) => setType(e.target.value)}>
                {TYPE_OPTIONS.map((ty) => (
                  <MenuItem key={ty} value={ty}>{ty}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box>
            <TextField
              label="Tenant ID"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              size="small"
              fullWidth
            />
            <FormHelperText>
              <Typography variant="caption" color="text.secondary">
                İleride JWT token'dan otomatik doldurulacak.
              </Typography>
            </FormHelperText>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>İptal</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isPending}>
          {isPending ? <CircularProgress size={20} /> : 'Oluştur'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
```

---

## Dosya Oluşturma Özeti

| Madde | Dosya | İşlem |
|-------|-------|-------|
| 3.1 | `src/modules/tenant/types/ticket.ts` | YENİ |
| 3.2 | `src/modules/tenant/api/ticket-client.ts` | YENİ |
| 3.3 | `src/modules/tenant/hooks/use-tickets.ts` | YENİ |
| 3.4a | `src/core/constants/routes.ts` | GÜNCELLE (`tickets` ekle) |
| 3.4b | `src/app/[locale]/(protected)/tickets/page.tsx` | YENİ |
| 3.4c | `src/modules/tenant/ui/ticket-list.tsx` | YENİ |
| 3.5a | `src/app/[locale]/(protected)/tickets/[id]/page.tsx` | YENİ |
| 3.5b | `src/modules/tenant/ui/ticket-detail.tsx` | YENİ |
| 3.6 | `src/modules/tenant/ui/ticket-create-dialog.tsx` | YENİ |

## Uygulama Sırası

```
3.1 → 3.2 → 3.3          (bağımlılık zinciri)
3.4a                      (routes sabiti — sayfadan önce)
3.6                       (create dialog — list bileşeni bunu kullanıyor)
3.4b + 3.4c               (liste sayfası + bileşeni)
3.5a + 3.5b               (detay sayfası — en son)
```

## Son Doğrulama

```bash
pnpm typecheck   # yeni dosyalar dahil sıfır ek hata
pnpm lint        # temiz
```

---

## Backend Gelişme Notu

Liste sayfasını tam kapasiteye getirmek için backend'de şu endpoint'in eklenmesi gerekiyor:

```
GET /api/tickets?tenantId={uuid}&_start=0&_end=10&_sort=createdAt&_order=DESC&status=OPEN
```

Yanıt: `ApiResponse<List<TicketResponse>>` + `X-Total-Count` header
→ Bu eklendiğinde `ticket-list.tsx` standart `IResourceController` pattern'ına geçirilir ve
`createResourceClient` + `createResourceHooks` ile yeniden yazılır.

---

*Bu plan tamamlandığında Faz 4 (Takım Yönetimi) için aynı formatta plan hazırlanacak.*
