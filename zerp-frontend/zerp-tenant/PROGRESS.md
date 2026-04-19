# zerp-tenant — İlerleme Takibi

> Tamamlanan maddeleri ben işaretlerim. Detaylar için → `DEVELOPMENT_ROADMAP.md`

---

## Faz 1 — Altyapı: Generic Resource Katmanı ✓

- [x] **1.1** Generated client'ları zerp-tenant'a kopyala (`openapi_crm`, `openapi_employee`, `openapi_notification`)
- [x] **1.2** `src/modules/tenant/` dizin yapısını oluştur (`api/`, `hooks/`, `types/`, `ui/`)
- [x] **1.3** `src/core/api/resource-types.ts` — `RaListParams`, `RaListResult<T>`, `toRaQueryString()`
- [x] **1.4** `src/core/api/base-http-client.ts` — `requestList<T>()` ve HTTP kısayolları ekle
- [x] **1.5** `src/core/api/resource-client.ts` — `createResourceClient` factory
- [x] **1.6** `src/core/api/resource-hooks.ts` — `createResourceHooks` factory
- [x] **1.7** `src/core/api/query-keys.ts` — tenant namespace'lerini genişlet
- [x] **1.8** `tr.ts` / `en.ts` — temel namespace'leri ekle, `MessageDictionary` güncelle

---

## Faz 2 — Çalışan Yönetimi ✓

- [x] **2.1** `src/modules/tenant/types/employee.ts` — tip tanımları
- [x] **2.2** `src/modules/tenant/api/employee-client.ts` — resource client + ek endpoint'ler
- [x] **2.3** `src/modules/tenant/hooks/use-employees.ts` — React Query hook'ları
- [x] **2.4** `src/app/[locale]/(protected)/employees/page.tsx` + `employee-list.tsx`
- [x] **2.5** `src/app/[locale]/(protected)/employees/[id]/page.tsx` + `employee-detail.tsx`
- [x] **2.6** `src/modules/tenant/ui/employee-form-dialog.tsx` — oluştur/güncelle formu
- [x] **2.7** `src/modules/tenant/ui/deleted-employees.tsx` — silinmiş çalışanlar

---

## Faz 3 — Destek Talepleri ✓

- [x] **3.1** `src/modules/tenant/types/ticket.ts` — tip tanımları
- [x] **3.2** `src/modules/tenant/api/ticket-client.ts` — ticket client (elle yazılır)
- [x] **3.3** `src/modules/tenant/hooks/use-tickets.ts` — React Query hook'ları
- [x] **3.4** `src/app/[locale]/(protected)/tickets/page.tsx` + `ticket-list.tsx`
- [x] **3.5** `src/app/[locale]/(protected)/tickets/[id]/page.tsx` + `ticket-detail.tsx`
- [x] **3.6** `src/modules/tenant/ui/ticket-create-dialog.tsx`

> Not: Typecheck'te 2 hata mevcut — her ikisi de Faz 3 öncesinden gelen önceden var olan hatalar
> (`layout.tsx` role type uyuşmazlığı, `unauthorized-page.test.tsx` locale Promise tipi).

---

## Faz 4 — Takım Yönetimi

- [ ] **4.1** `src/modules/tenant/types/team.ts` — tip tanımları
- [ ] **4.2** `src/modules/tenant/api/team-client.ts` — `createResourceClient` ile
- [ ] **4.3** `src/modules/tenant/hooks/use-teams.ts` — `createResourceHooks` ile
- [ ] **4.4** `src/app/[locale]/(protected)/teams/page.tsx` + `team-list.tsx`
- [ ] **4.5** `src/app/[locale]/(protected)/teams/[id]/page.tsx` + `team-detail.tsx`

---

## Faz 5 — Bildirim Merkezi

- [ ] **5.1** `src/modules/tenant/types/notification.ts` — tip tanımları
- [ ] **5.2** `src/modules/tenant/api/notification-client.ts`
- [ ] **5.3** `src/modules/tenant/hooks/use-notifications.ts`
- [ ] **5.4** `src/app/[locale]/(protected)/notifications/page.tsx` + `notification-send-form.tsx`

---

## Faz 6 — Dashboard

- [ ] **6.1** `tenant-dashboard.tsx` — ana bileşen (mevcut dashboard sayfasını güncelle)
- [ ] **6.2** `dashboard-kpi-cards.tsx` — çalışan / açık talep / kritik / takım sayaçları
- [ ] **6.3** `dashboard-recent-activity.tsx` — son talepler ve çalışanlar
- [ ] **6.4** `dashboard-quick-actions.tsx` — hızlı aksiyon butonları
