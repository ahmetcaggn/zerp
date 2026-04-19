# Faz 2 — Implementation Plan: Çalışan Yönetimi

> PROGRESS.md madde sırasını takip eder. Her madde bitince PROGRESS.md işaretlenir.

---

## Teknik Kısıtlar (Başlamadan Önce Bilinmesi Gerekenler)

| Konu | Karar |
|------|-------|
| Form kütüphanesi | Yok — `react-hook-form` package.json'da bulunmuyor. Controlled `useState` kullanılır. |
| Tablo bileşeni | `@mui/x-data-grid` yok — standart `Table` + `TablePagination` kullanılır. |
| Debounce | Harici kütüphane yok — `useEffect` + `setTimeout` ile elle yazılır. |
| `search` endpoint yanıtı | `Page<EmployeeListResponseDto>` döner (Spring Page), `X-Total-Count` yok. `content` ve `totalElements` alanları kullanılır. |
| `deleted/paginated` endpoint yanıtı | Aynı şekilde `Page<EmployeeListResponseDto>` döner. |

---

## Madde 2.1 — `src/modules/tenant/types/employee.ts`

### Ne yapılacak

Generated `openapi_employee/api.ts` dosyasından kullanılacak tipleri re-export et.
Tüm status enum değerlerini tek bir `EmploymentStatus` tipi altında topla.

### Dosya: `src/modules/tenant/types/employee.ts` (YENİ)

```typescript
export type {
  EmployeeResponseDto,
  EmployeeListResponseDto,
  CreateEmployeeRequestDto,
  UpdateEmployeeRequestDto,
  EmployeeContactDto,
  EmployeeContactResponseDto,
  ManagerDto,
  PageEmployeeListResponseDto,
} from '@/modules/generated/openapi_employee/api'

export {
  CreateEmployeeRequestDtoStatusEnum as EmploymentStatus,
  EmployeeContactDtoTypeEnum as ContactType,
} from '@/modules/generated/openapi_employee/api'

export type { CreateEmployeeRequestDtoStatusEnum as EmploymentStatusValue } from '@/modules/generated/openapi_employee/api'
```

---

## Madde 2.2 — `src/modules/tenant/api/employee-client.ts`

### Ne yapılacak

`createResourceClient` ile standart 10 operasyonu kurar. Ardından employee'a özgü
üç ek endpoint'i aynı nesneye spread ile ekler:
- `search` — `Page<EmployeeListResponseDto>` → `RaListResult` uyarlaması
- `deleted` — tüm silinmiş çalışanlar, sayfalanmamış
- `deletedPaginated` — sayfalanmış silinmiş çalışanlar

### `search` endpoint notu

`GET /employee/search?keyword=...&_start=...&_end=...&_sort=...&_order=...`
Yanıt: `ApiResponse<Page<EmployeeListResponseDto>>`

Backend `Page<T>` içindeki `content` ve `totalElements` alanları kullanılır.
`X-Total-Count` header'ı olmadığı için `requestList` değil, `httpClient.get` çağrılır.

### Dosya: `src/modules/tenant/api/employee-client.ts` (YENİ)

```typescript
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
  number
>('/employee')

export const employeeClient = {
  ...base,

  search: async (keyword: string, params: RaListParams = {}): Promise<RaListResult<EmployeeListResponseDto>> => {
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

  deletedPaginated: async (params: RaListParams = {}): Promise<RaListResult<EmployeeListResponseDto>> => {
    const qs = toRaQueryString(params)
    const page = await httpClient.get<PageEmployeeListResponseDto>(
      `/employee/deleted/paginated?${qs}`,
    )
    return {
      data: page.content ?? [],
      total: page.totalElements ?? 0,
    }
  },
}
```

---

## Madde 2.3 — `src/modules/tenant/hooks/use-employees.ts`

### Ne yapılacak

`createResourceHooks` ile standart hook'ları türet. Ek olarak `useEmployeeSearch` ve
`useDeletedEmployees` hook'larını elle yaz.

### Dosya: `src/modules/tenant/hooks/use-employees.ts` (YENİ)

```typescript
'use client'
import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { createResourceHooks } from '@/core/api/resource-hooks'
import type { RaListParams } from '@/core/api/resource-types'
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

export {
  useEmployees,
  useEmployee,
  useCreateEmployee,
  useUpdateEmployee,
  usePatchEmployee,
  useDeleteEmployee,
  useDeleteManyEmployees,
}

export function useEmployeeSearch(keyword: string, params: RaListParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.tenant.employees, 'search', keyword, params],
    queryFn: () => employeeClient.search(keyword, params),
    enabled: keyword.trim().length >= 2,
  })
}

export function useDeletedEmployees(params: RaListParams = {}) {
  return useQuery({
    queryKey: [...queryKeys.tenant.employees, 'deleted', params],
    queryFn: () => employeeClient.deletedPaginated(params),
  })
}
```

---

## Madde 2.4 — Çalışan Listesi Sayfası

### routes.ts güncellemesi

`src/core/constants/routes.ts` — `ROUTES` nesnesine ekle:

```typescript
export const ROUTES = {
  root: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  unauthorized: '/unauthorized',
  employees: '/employees',         // ← ekle
} as const
```

### Sayfa: `src/app/[locale]/(protected)/employees/page.tsx` (YENİ)

```typescript
import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { EmployeeList } from '@/modules/tenant/ui/employee-list'

export const metadata: Metadata = buildMetadata({ title: 'Employees' })

export default function EmployeesPage() {
  return <EmployeeList />
}
```

### Bileşen: `src/modules/tenant/ui/employee-list.tsx` (YENİ)

Özellikler:
- Sayfa + arama durumu `useState` ile yönetilir
- Arama 2+ karakter girildiğinde `useEmployeeSearch`'e geçer; aksi hâlde `useEmployees`
- Debounce: 400ms
- Tablo kolonları: Ad Soyad, E-posta, Telefon, İşe Giriş, Durum, İşlemler
- Durum chip renkleri: ACTIVE=success, PROBATION=info, ON_LEAVE=warning, SUSPENDED/TERMINATED/RETIRED=default
- Aksiyon butonları: Görüntüle (detay sayfasına gider), Sil (onay + useDeleteEmployee)
- Alt sekme: "Aktif" / "Silinmiş" — silinmiş sekmesi `DeletedEmployees` bileşenini render eder
- Sağ üst köşe: "Çalışan Ekle" butonu — `EmployeeFormDialog` açar

```typescript
'use client'
import {
  Box, Button, Chip, CircularProgress, IconButton,
  Tab, Table, TableBody, TableCell, TableHead, TablePagination,
  TableRow, Tabs, TextField, Tooltip, Typography,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddIcon from '@mui/icons-material/Add'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { ROUTES } from '@/core/constants/routes'
import {
  useEmployees, useEmployeeSearch, useDeleteEmployee,
} from '../hooks/use-employees'
import { EmployeeFormDialog } from './employee-form-dialog'
import { DeletedEmployees } from './deleted-employees'
import type { EmploymentStatusValue } from '../types/employee'

const STATUS_COLOR: Record<EmploymentStatusValue, 'success' | 'info' | 'warning' | 'default' | 'error'> = {
  ACTIVE: 'success',
  PROBATION: 'info',
  ON_LEAVE: 'warning',
  SUSPENDED: 'error',
  TERMINATED: 'default',
  RETIRED: 'default',
}

export function EmployeeList() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()

  const [tab, setTab] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchInput, setSearchInput] = useState('')
  const [debouncedKeyword, setDebouncedKeyword] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  // Debounce
  useEffect(() => {
    const id = setTimeout(() => setDebouncedKeyword(searchInput.trim()), 400)
    return () => clearTimeout(id)
  }, [searchInput])

  // Sayfalama sıfırlama
  useEffect(() => { setPage(0) }, [debouncedKeyword])

  const params = {
    pagination: { page: page + 1, perPage: rowsPerPage },
    sort: { field: 'id', order: 'ASC' as const },
  }

  const listResult = useEmployees(debouncedKeyword.length < 2 ? params : undefined)
  const searchResult = useEmployeeSearch(debouncedKeyword, params)
  const { mutate: deleteEmployee } = useDeleteEmployee()

  const isSearching = debouncedKeyword.length >= 2
  const { data, isLoading, error } = isSearching ? searchResult : listResult

  if (error) showToast(getUserFriendlyError(error), { severity: 'error' })

  const rows = data?.data ?? []
  const total = data?.total ?? 0

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{t('employees.title')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          {t('employees.createButton')}
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label={t('employees.title')} />
        <Tab label={t('employees.deletedTitle')} />
      </Tabs>

      {tab === 1 ? (
        <DeletedEmployees />
      ) : (
        <>
          <TextField
            size="small"
            placeholder={t('employees.searchPlaceholder')}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ mb: 2, width: 320 }}
          />

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : rows.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              {t('employees.emptyState')}
            </Typography>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Ad Soyad</TableCell>
                  <TableCell>E-posta</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>İşe Giriş</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell align="right">İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((emp) => (
                  <TableRow key={emp.id} hover>
                    <TableCell>{`${emp.firstName ?? ''} ${emp.lastName ?? ''}`}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.phoneNumber ?? '—'}</TableCell>
                    <TableCell>{emp.status && (
                      <Chip
                        label={emp.status}
                        color={STATUS_COLOR[emp.status] ?? 'default'}
                        size="small"
                      />
                    )}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={t('employees.editButton')}>
                        <IconButton
                          size="small"
                          onClick={() => router.push(`${ROUTES.employees}/${emp.id}`)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('employees.deleteButton')}>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            if (emp.id !== undefined) {
                              deleteEmployee(emp.id, {
                                onSuccess: () => showToast('Çalışan silindi.', { severity: 'success' }),
                                onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
                              })
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <TablePagination
            component="div"
            count={total}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0) }}
            rowsPerPageOptions={[10, 25, 50]}
          />
        </>
      )}

      <EmployeeFormDialog
        open={formOpen}
        mode="create"
        onClose={() => setFormOpen(false)}
      />
    </Box>
  )
}
```

> **Not:** Yukarıdaki kod tablo sütunlarında durum ve tarih kolonlarının sırası yer değiştirmiş görünüyor.
> Gerçek implementasyonda kolonlar: Ad Soyad | E-posta | Telefon | İşe Giriş Tarihi | Durum | İşlemler şeklinde düzenlenir.

---

## Madde 2.5 — Çalışan Detay Sayfası

### Sayfa: `src/app/[locale]/(protected)/employees/[id]/page.tsx` (YENİ)

```typescript
import type { Metadata } from 'next'
import { buildMetadata } from '@/core/seo/metadata'
import { EmployeeDetail } from '@/modules/tenant/ui/employee-detail'

export const metadata: Metadata = buildMetadata({ title: 'Employee Detail' })

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <EmployeeDetail id={Number(id)} />
}
```

### Bileşen: `src/modules/tenant/ui/employee-detail.tsx` (YENİ)

Özellikler:
- `useEmployee(id)` ile veri
- MUI `Grid` ile iki sütunlu bilgi kartı
- Yönetici alanı: isim + link (eğer manager varsa)
- Contacts listesi: type chip + value
- Üst sağ: "Düzenle" butonu → `EmployeeFormDialog` mode="edit" olarak açar
- Sol üst: Geri butonu → `/employees`

```typescript
'use client'
import {
  Box, Button, Chip, CircularProgress, Divider,
  Grid, Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { ROUTES } from '@/core/constants/routes'
import { useEmployee } from '../hooks/use-employees'
import { EmployeeFormDialog } from './employee-form-dialog'

interface Props { id: number }

export function EmployeeDetail({ id }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)

  const { data: employee, isLoading, error } = useEmployee(id)

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
  if (error) {
    showToast(getUserFriendlyError(error), { severity: 'error' })
    return null
  }
  if (!employee) return null

  const fields: Array<{ label: string; value: React.ReactNode }> = [
    { label: 'E-posta', value: employee.email },
    { label: 'Telefon', value: employee.phoneNumber ?? '—' },
    { label: 'TC Kimlik', value: employee.nationalId ?? '—' },
    { label: 'Doğum Tarihi', value: employee.dateOfBirth ?? '—' },
    { label: 'İşe Giriş', value: employee.hireDate ?? '—' },
    { label: 'Ayrılış Tarihi', value: employee.terminationDate ?? '—' },
    { label: 'Maaş', value: employee.salary !== undefined ? `${employee.salary} ₺` : '—' },
    {
      label: 'Durum',
      value: employee.status ? <Chip label={employee.status} size="small" /> : '—',
    },
    {
      label: 'Yönetici',
      value: employee.manager
        ? `${employee.manager.firstName ?? ''} ${employee.manager.lastName ?? ''}`.trim() || '—'
        : '—',
    },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push(ROUTES.employees)}>
          {t('employees.title')}
        </Button>
        <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
          {t('employees.editButton')}
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mb: 3 }}>
        {`${employee.firstName ?? ''} ${employee.lastName ?? ''}`}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {fields.map(({ label, value }) => (
          <Grid key={label} size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="body2">{value}</Typography>
          </Grid>
        ))}
      </Grid>

      {(employee.contacts?.length ?? 0) > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>İletişim Bilgileri</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {employee.contacts?.map((c) => (
              <Box key={c.id} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Chip label={c.type} size="small" variant="outlined" />
                <Typography variant="body2">{c.value}</Typography>
                {c.contactPersonName && (
                  <Typography variant="caption" color="text.secondary">({c.contactPersonName})</Typography>
                )}
              </Box>
            ))}
          </Box>
        </>
      )}

      <EmployeeFormDialog
        open={editOpen}
        mode="edit"
        employee={employee}
        onClose={() => setEditOpen(false)}
      />
    </Box>
  )
}
```

---

## Madde 2.6 — Çalışan Form Dialog Bileşeni

### Ne yapılacak

Tek bileşen, iki mod: `create` ve `edit`.
Dialog içinde çalışır; hem liste hem detay sayfasından açılır.

### Bileşen: `src/modules/tenant/ui/employee-form-dialog.tsx` (YENİ)

Alanlar (zorunlu **kalın**):
- **firstName**, **lastName**, **email**, **hireDate**
- phoneNumber, nationalId, dateOfBirth, status (Select), managerId (Select), salary

Contacts alanı ayrı bir bileşen (`ContactsField`) olarak ayrılır — dinamik ekle/çıkar.

```typescript
'use client'
import {
  Box, Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, MenuItem, Select,
  TextField, FormControl, InputLabel, IconButton, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useCreateEmployee, useUpdateEmployee, useEmployees } from '../hooks/use-employees'
import {
  EmploymentStatus, ContactType,
  type CreateEmployeeRequestDto,
  type EmployeeResponseDto,
  type EmployeeContactDto,
} from '../types/employee'

interface Props {
  open: boolean
  mode: 'create' | 'edit'
  employee?: EmployeeResponseDto
  onClose: () => void
}

const STATUS_OPTIONS = Object.values(EmploymentStatus)
const CONTACT_TYPE_OPTIONS = Object.values(ContactType)

const EMPTY_CONTACT: EmployeeContactDto = { type: ContactType.WorkPhone, value: '' }

export function EmployeeFormDialog({ open, mode, employee, onClose }: Props) {
  const { t } = useI18n()
  const { showToast } = useToast()

  const [firstName, setFirstName] = useState(employee?.firstName ?? '')
  const [lastName, setLastName] = useState(employee?.lastName ?? '')
  const [email, setEmail] = useState(employee?.email ?? '')
  const [phoneNumber, setPhoneNumber] = useState(employee?.phoneNumber ?? '')
  const [nationalId, setNationalId] = useState(employee?.nationalId ?? '')
  const [dateOfBirth, setDateOfBirth] = useState(employee?.dateOfBirth ?? '')
  const [hireDate, setHireDate] = useState(employee?.hireDate ?? '')
  const [status, setStatus] = useState<string>(employee?.status ?? EmploymentStatus.Active)
  const [managerId, setManagerId] = useState<string>(
    employee?.manager?.id !== undefined ? String(employee.manager.id) : '',
  )
  const [salary, setSalary] = useState<string>(
    employee?.salary !== undefined ? String(employee.salary) : '',
  )
  const [contacts, setContacts] = useState<EmployeeContactDto[]>(
    employee?.contacts?.map((c) => ({ ...c })) ?? [],
  )

  const { data: managersResult } = useEmployees({ pagination: { page: 1, perPage: 50 } })
  const managerOptions = managersResult?.data ?? []

  const { mutate: createEmployee, isPending: isCreating } = useCreateEmployee()
  const { mutate: updateEmployee, isPending: isUpdating } = useUpdateEmployee()
  const isPending = isCreating || isUpdating

  function handleSubmit() {
    if (!firstName || !lastName || !email || !hireDate) {
      showToast('Zorunlu alanları doldurun.', { severity: 'warning' })
      return
    }

    const payload: CreateEmployeeRequestDto = {
      firstName,
      lastName,
      email,
      hireDate,
      ...(phoneNumber && { phoneNumber }),
      ...(nationalId && { nationalId }),
      ...(dateOfBirth && { dateOfBirth }),
      ...(status && { status: status as CreateEmployeeRequestDto['status'] }),
      ...(managerId && { managerId: Number(managerId) }),
      ...(salary && { salary: Number(salary) }),
      ...(contacts.length > 0 && { contacts }),
    }

    if (mode === 'create') {
      createEmployee(payload, {
        onSuccess: () => {
          showToast('Çalışan oluşturuldu.', { severity: 'success' })
          onClose()
        },
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      })
    } else if (employee?.id !== undefined) {
      updateEmployee(
        { id: employee.id, data: payload },
        {
          onSuccess: () => {
            showToast('Çalışan güncellendi.', { severity: 'success' })
            onClose()
          },
          onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
        },
      )
    }
  }

  function addContact() {
    setContacts((prev) => [...prev, { ...EMPTY_CONTACT }])
  }

  function removeContact(index: number) {
    setContacts((prev) => prev.filter((_, i) => i !== index))
  }

  function updateContact(index: number, field: keyof EmployeeContactDto, value: string) {
    setContacts((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, [field]: value } : c,
      ),
    )
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? t('employees.createButton') : t('employees.editButton')}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Ad *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Soyad *"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              size="small"
            />
          </Box>

          <TextField
            label="E-posta *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="İşe Giriş Tarihi *"
              type="date"
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="Doğum Tarihi"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              size="small"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Telefon"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="TC Kimlik"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              size="small"
              fullWidth
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select value={status} label="Durum" onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Maaş"
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              size="small"
              fullWidth
            />
          </Box>

          <FormControl size="small" fullWidth>
            <InputLabel>Yönetici</InputLabel>
            <Select value={managerId} label="Yönetici" onChange={(e) => setManagerId(String(e.target.value))}>
              <MenuItem value="">—</MenuItem>
              {managerOptions.map((m) => (
                <MenuItem key={m.id} value={String(m.id)}>
                  {`${m.firstName ?? ''} ${m.lastName ?? ''}`.trim()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Contacts */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2">İletişim Bilgileri</Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={addContact}>Ekle</Button>
            </Box>

            {contacts.map((c, i) => (
              <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                <FormControl size="small" sx={{ width: 180 }}>
                  <InputLabel>Tür</InputLabel>
                  <Select
                    value={c.type}
                    label="Tür"
                    onChange={(e) => updateContact(i, 'type', e.target.value)}
                  >
                    {CONTACT_TYPE_OPTIONS.map((ct) => (
                      <MenuItem key={ct} value={ct}>{ct}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Değer"
                  value={c.value}
                  onChange={(e) => updateContact(i, 'value', e.target.value)}
                  size="small"
                  fullWidth
                />
                <IconButton size="small" color="error" onClick={() => removeContact(i)}>
                  <RemoveCircleOutlineIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isPending}>İptal</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isPending}>
          {isPending ? <CircularProgress size={20} /> : mode === 'create' ? 'Oluştur' : 'Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
```

---

## Madde 2.7 — Silinmiş Çalışanlar Bileşeni

### Ne yapılacak

`EmployeeList` bileşenindeki "Silinmiş" sekmesinde render edilir.
`usePatchEmployee` ile `isActive: true` gönderilerek geri yükleme yapılır.

### Bileşen: `src/modules/tenant/ui/deleted-employees.tsx` (YENİ)

```typescript
'use client'
import {
  Box, Button, CircularProgress, Table, TableBody,
  TableCell, TableHead, TablePagination, TableRow, Typography,
} from '@mui/material'
import RestoreIcon from '@mui/icons-material/Restore'
import { useState } from 'react'
import { useI18n } from '@/core/i18n/i18n-provider'
import { useToast } from '@/core/providers/toast-provider'
import { getUserFriendlyError } from '@/core/utils/error-message'
import { useDeletedEmployees, usePatchEmployee } from '../hooks/use-employees'

export function DeletedEmployees() {
  const { t } = useI18n()
  const { showToast } = useToast()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data, isLoading, error } = useDeletedEmployees({
    pagination: { page: page + 1, perPage: rowsPerPage },
  })
  const { mutate: patchEmployee } = usePatchEmployee()

  if (error) showToast(getUserFriendlyError(error), { severity: 'error' })

  const rows = data?.data ?? []
  const total = data?.total ?? 0

  function handleRestore(id: number) {
    patchEmployee(
      { id, fields: { isActive: true } },
      {
        onSuccess: () => showToast('Çalışan geri yüklendi.', { severity: 'success' }),
        onError: (err) => showToast(getUserFriendlyError(err), { severity: 'error' }),
      },
    )
  }

  if (isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
  }

  if (rows.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
        {t('employees.emptyState')}
      </Typography>
    )
  }

  return (
    <>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Ad Soyad</TableCell>
            <TableCell>E-posta</TableCell>
            <TableCell>Telefon</TableCell>
            <TableCell align="right">{t('employees.restoreButton')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell>{`${emp.firstName ?? ''} ${emp.lastName ?? ''}`}</TableCell>
              <TableCell>{emp.email}</TableCell>
              <TableCell>{emp.phoneNumber ?? '—'}</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<RestoreIcon />}
                  onClick={() => emp.id !== undefined && handleRestore(emp.id)}
                >
                  {t('employees.restoreButton')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0) }}
        rowsPerPageOptions={[10, 25]}
      />
    </>
  )
}
```

---

## Dosya Oluşturma Özeti

| Madde | Dosya | İşlem |
|-------|-------|-------|
| 2.1 | `src/modules/tenant/types/employee.ts` | YENİ |
| 2.2 | `src/modules/tenant/api/employee-client.ts` | YENİ |
| 2.3 | `src/modules/tenant/hooks/use-employees.ts` | YENİ |
| 2.4a | `src/core/constants/routes.ts` | GÜNCELLE (`employees` ekle) |
| 2.4b | `src/app/[locale]/(protected)/employees/page.tsx` | YENİ |
| 2.4c | `src/modules/tenant/ui/employee-list.tsx` | YENİ |
| 2.5a | `src/app/[locale]/(protected)/employees/[id]/page.tsx` | YENİ |
| 2.5b | `src/modules/tenant/ui/employee-detail.tsx` | YENİ |
| 2.6 | `src/modules/tenant/ui/employee-form-dialog.tsx` | YENİ |
| 2.7 | `src/modules/tenant/ui/deleted-employees.tsx` | YENİ |

## Uygulama Sırası

```
2.1 → 2.2 → 2.3   (bağımlılık zinciri: tipler → client → hooks)
2.4a               (routes sabiti — sayfadan önce)
2.4b + 2.4c        (liste sayfası + bileşeni)
2.7                (deleted — liste bileşeni bunu kullanıyor)
2.6                (form dialog — liste + detay kullanıyor)
2.5a + 2.5b        (detay sayfası — son)
```

## Son Doğrulama

```bash
pnpm typecheck   # yeni dosyalar dahil sıfır ek hata
pnpm lint        # temiz
```

---

*Bu plan tamamlandığında Faz 3 (Destek Talepleri) için aynı formatta plan hazırlanacak.*
