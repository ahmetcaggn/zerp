# CRM Ticket Gorunurluk RLS Report

Tarih: 2026-04-28  
Kapsam: `zerp-backend/crm` modulunde ticket gorunurluk kurallarinin belirlenmesi

## 1) Istenen Kural Seti

Hedef kurallar:

1. Tenant kullanicisi: sadece kendi tenant'inin ticket'larini gorebilir.
2. Team member: tenant fark etmeksizin sadece kendisine atanmis ticket'lari gorebilir.
3. Team leader: tum ticket'lari gorebilir.

## 2) RLS Karar Matrisi

Ticket listesi (`GET /tickets`) ve ticket detayi (`GET /tickets/{id}`) icin karar:

- Kural A (en yuksek oncelik): kullanici aktif bir team'de `LEADER` ise -> tum ticket'lar.
- Kural B: degilse ve actor tenant context'indeyse -> `ticket.tenant_id = currentTenantId`.
- Kural C: degilse -> `ticket_assignment.is_active = true AND ticket_assignment.agent_party_id = currentUserId`.
- Kural D: hicbirine girmiyorsa -> bos sonuc.

Not: Buradaki oncelik sirasi kritiktir. Leader kapsami diger kurallari override eder.

## 3) SQL/JPA Seviyesinde Predicate Karsiliklari

Tenant gorunurlugu:

`ticket.tenant_id = :currentTenantId`

Team member gorunurlugu:

`EXISTS (SELECT 1 FROM ticket_assignment ta
         WHERE ta.ticket_id = ticket.id
           AND ta.is_active = true
           AND ta.agent_party_id = :currentUserId
           AND ta.deleted = false)`

Team leader gorunurlugu:

`TRUE` (restriction yok)

JPA Specification birlestirme prensibi:

`finalSpec = rlsSpec.and(clientFilterSpec)`

Burada `clientFilterSpec`, mevcut `TicketSpecificationBuilder.build(filters)` sonucudur.

## 4) Mevcut Kodda Durum ve Bosluklar

Su an `TicketService.findWithFilters` sadece:

- `TicketSpecificationBuilder.build(filters)` uygular.
- User/tenant/team tabanli gorunurluk filtresi uygulamaz.

Sonuc: pratikte listeleme RLS'siz calisir.

Ek olarak:

- `findById` da RLS kontrolu yok.
- `TeamTicketController` operasyon endpointleri var (`/tickets/{id}/status`, `/assign`, `/comments` vb.) ama read endpointleri yok.
- `GET /tickets` ve `GET /tickets/{id}` `TenantTicketController` uzerinden geliyor; bu da team member / leader gorunurlugu icin ayrik politika ihtiyacini netlestiriyor.

## 5) Onerilen Teknik Tasarim

### 5.1 Yeni bir "TicketVisibilityPolicy" katmani

`crm` modulunde yeni bir policy/resolver sinifi:

- Input: `currentUserId`, `currentTenantId`, kullanicinin leader/member bilgisi
- Output: `Specification<TicketEntity> rlsSpec`

Oncelik:

1. `isLeader(userId)` -> `Specification.unrestricted()`
2. `currentTenantId != null` -> `ticket.tenantId == currentTenantId`
3. `isTeamMember(userId)` -> kendine atanmis aktif ticket spec'i
4. aksi -> `id in (empty)`

### 5.2 Service entegrasyonu

`TicketService.findWithFilters`:

- `filterSpec = ticketSpecificationBuilder.build(filters)`
- `rlsSpec = ticketVisibilityPolicy.resolveReadSpec(...)`
- `ticketRepository.findAll(rlsSpec.and(filterSpec), pageable)`

`TicketService.findById`:

- `id + rlsSpec` ile erisim kontrolu yap.
- erisim yoksa `404` don (ID enumeration riskini azaltir).

### 5.3 Repository katmani

`TicketRepository` icin eklenebilir:

- `exists(Specification<TicketEntity>)`
- veya `findOne(Specification<TicketEntity>)`

Team membership / leader check icin:

- ya `TeamMemberRepository` eklenir,
- ya da `EntityManager` ile hafif sorgu kullanilir.

## 6) Team Leader / Team Member Tespiti

Minimum kurallar:

- Leader: `team_member.role = LEADER` ve bagli team aktif (`team.is_active = true`).
- Member: `team_member.role = MEMBER` veya `LEADER` ama leader yolu ilk calistigi icin member kuralina dusmez.

Ek guvenlik notu:

- Soft delete kurallari (`deleted = false`) joinlerde korunmali.
- `is_active = false` olan assignment kayitlari member gorunurlugune dahil edilmemeli.

## 7) Controller Seviyesinde Operasyonel Cizgi

Mevcut route yapisiyla uygulanabilir, ama daha temiz ayrim:

- Tenant read endpointleri: tenant view
- Team read endpointleri: member/leader view (ayri prefix, ornek `/team-tickets`)

Boylece "hangi actor tipiyle okunuyor" belirsizligi azalir.

Su anki yapida tek `GET /tickets` oldugu icin actor ayirimi policy icinde (header/context tabanli) net bir sekilde tanimlanmalidir.

## 8) Kabul Kriterleri (Test Senaryolari)

Asagidaki testler gecmeden RLS tamamlandi denmemeli:

1. Tenant A kullanicisi, Tenant B ticket'ini listede goremez.
2. Team member U1, sadece `agent_party_id = U1` olan aktif assignment ticket'larini gorur.
3. Team member U1, `agent_party_id = U2` ticket'ini goremez.
4. Team member U1, assignment'i olmayan ticket'i goremez.
5. Team leader, farkli tenant'lardaki ticket'lari gorebilir.
6. `GET /tickets/{id}` icin yetkisiz erisimde `404` doner.
7. Client filter (`status.eq`, `priority.eq`, `q`) RLS ile birlikte dogru calisir.

## 9) Sonuc

Bu modelle ticket gorunurluk kurallari deterministik hale gelir:

- tenant izolasyonu korunur,
- team member sadece kendi assignment'i kadar gorur,
- leader tam operasyonel gorunurluk alir.

En kritik nokta, bu kurallarin sadece endpoint degil, `findWithFilters` ve `findById` servis akisinin merkezinde uygulanmasidir.
