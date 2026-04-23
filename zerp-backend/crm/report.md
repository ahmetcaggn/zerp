# CRM B2B Ticket Support Report

Tarih: 2026-04-23
Kapsam: `crm` modulu (controller + service + dto + entity katmanlari)

## 1. Genel Durum

Kisa sonuc: modul temel ticket/team akislarini calistirabilecek seviyede, ama B2B production destegi icin hala "kismi hazir".

Su an iyi olan kisimlar:
- Ticket icin temel lifecycle var: create, read/list/filter, assign, unassign, status/priority degisimi, comment, close.
- Team icin temel lifecycle var: create, read/list/filter, activate/deactivate, member ekle/sil/rol degistir.
- Soft delete yaklasimi bircok entityde mevcut.
- Ticket tarafinda servis parcalanmasi baslatilmis (`TicketResponseMapper`, `TicketSpecificationBuilder`, `TicketValueParser`).

Eksik/yarim kalan ana alanlar:
- Auth/actor ve tenant izolasyonu gercek anlamda implement edilmemis.
- SLA breach/pause/resume otomasyonu tamam degil.
- History olayi yaziliyor ama tam kapsama ve sorgulama tarafi eksik.
- Team ile Ticket arasinda domain dogrulamalari (team var mi, aktif mi, ajan team icinde mi) eksik.

## 2. Ticket Mantigi - Neler Eklenebilir

Mevcut durumda makul ve "ekstrem olmayan" eklemeler:

- Team ve agent dogrulamasi:
  `assignTicket` team id aliyor ama team var mi/aktif mi kontrol etmiyor.
- Tenant guvenligi:
  Ticket `tenantId` tasiyor ama service seviyesinde tenant bazli authorization/validation yok.
- Actor guvenligi:
  Controller ve service tarafinda hardcoded actor kullaniliyor (`CURRENT_USER_ID`, `SYSTEM_ACTOR_ID`).
- Patch guvenligi:
  `patch` ile `tenantId` degisebiliyor; B2B icin genelde bu alan immutable olmali.
- Watcher/attachment operasyon endpointleri:
  Response modelde var, ama ekleme/silme/isleme endpoint ve service mantigi yok.
- Validasyon anotasyonlari:
  Request DTO'larda `@NotNull`, `@Size`, `@NotBlank` yok; validasyon service icinde parcali.
- Event consistency:
  `closeTicket` de `CLOSED` eventi yerine `STATUS_CHANGED` yaziliyor; enumdaki bircok event hic kullanilmiyor.

Ticket tarafinda kritik teknik riskler:

- Assignment persistence riski:
  `TicketEntity.currentAssignment` alaninda cascade yok (`@OneToOne(mappedBy = "ticket")`).
  Service yeni assignment olusturup ticket save ediyor; gercek JPA akisinda persist davranisi garanti degil.
- Audit alan cakismasi riski:
  `BaseEntity` icinde `created_at`/`updated_at` var, `TicketEntity` ayni kolonlari tekrar tanimliyor.
  Bu JPA mapleme tarafinda tekrarli kolon riski olusturabilir.
- Bulk operasyon davranisi:
  `patchMany`/`deleteMany` `IllegalArgumentException` yakaliyor ama not-found `ResponseStatusException`.
  Beklenen "hatali id'yi atla devam et" davranisi tam calismayabilir.

## 3. Team Mantigi - Neler Eklenebilir

Mevcut durumda makul ve oncelikli eklemeler:

- Team tenant baglantisi:
  Team entity'de tenant/account alani yok; B2B modelde tenant boundary net olmali.
- Team-ticket tutarliligi:
  Ticket assignment team'e gidiyor ama team inaktifse ya da farkli tenant'taysa engel yok.
- Uye rol kurallari:
  "Takimda en az 1 lider kalmali" gibi kural yok.
- DB seviyesinde benzersizlik:
  `team_member` icin `(team_id, user_id)` unique constraint gorunmuyor; race condition ile duplicate uye riski var.
- Uye ekleme/silme icin yetki modeli:
  Su an role/permission kontrolu yok (kim team yonetebilir belirsiz).

Team tarafi genel degerlendirme:
- Temel mantik sade ve okunakli.
- Ama B2B operasyonu icin governance/authorization/tenant guardlari eksik.

## 4. SLA Tracking - Su an Ne Kadar Tam?

Su an implement edilenler:

- Ticket olusurken SLA initialize ediliyor.
  - first response due: priority bazli
  - resolution due: first response suresinin 4 kati
- Agent public comment geldiginde first response kaydi atiliyor.
- Ticket RESOLVED oldugunda resolution kaydi atiliyor ve breach flag hesaplaniyor.

Kismi/eksik kalanlar:

- Proactive breach yok:
  Sure doldugunda otomatik `SLA_BREACHED` set eden scheduler/background job yok.
- Pause/resume yok:
  Entityde `isPaused`, `pausedAt`, `totalPausedTimeMinutes` var ama service tarafinda aktif kullanimi yok.
- Priority degisiminde SLA yeniden hesaplama yok.
- Reopen durumunda SLA politikasinin nasil resetlenecegi tanimli degil.
- SLA event history entegrasyonu eksik (`SLA_BREACHED`, `SLA_PAUSED`, `SLA_RESUMED` kullanilmiyor).

Karar:
- SLA tracking "tam implementasyon" degil.
- Temel alanlar var, ama operasyonel B2B SLA yonetimi icin orta seviye eksik.

## 5. History Yonetimi - Su an Ne Durumda?

Su an implement edilenler:

- Asagidaki operasyonlarda history kaydi yaziliyor:
  - create
  - status degisimi
  - priority degisimi
  - assign / reassign / unassign
  - comment ekleme
- Event tipi + actor id + payload + occurredAt tutuluyor.

Kismi/eksik kalanlar:

- Tum update tipleri history'ye dusmuyor:
  `patch/update` ile title/description/type/tags/customAttributes degisimi icin event yok.
- Event semantigi tutarsiz:
  Enumda `CLOSED`, `RESOLVED`, `UPDATED`, `CANCELLED`, `ASSIGNMENT_CLEARED` var, ama pratikte cogu yazilmiyor.
- reference alanlari kullanimsiz:
  `referenceType` ve `referenceId` doldurulmuyor.
- History read API yok:
  Ticket detayinda comments/attachments/watchers var ama history listesi donmuyor.
- Actor kimligi guvenilir degil:
  Hardcoded actor kullanimi audit guvenini dusuruyor.

Karar:
- History mekanizmasi mevcut ama "tam audit trail" seviyesinde degil.

## 6. B2B Ticket Support icin Eksik/Yarim Backlog (Onceliklendirilmis)

P0 - Kisa vadede gerekli:

- Hardcoded actor yapisini kaldir, auth context'ten actor/tenant al.
- Team ve ticket icin tenant isolation kurallarini zorunlu hale getir.
- Assignment persistence modelini netlestir (cascade/owner tarafi) ve integration test ile dogrula.
- TicketEntity audit alanlarinda BaseEntity ile kolon cakismasini gider.

P1 - Isletim kalitesi:

- SLA icin scheduled breach evaluator + pause/resume logic ekle.
- History event coverage'i genislet (update, close/resolved ayrimi, cancellation, sla events).
- History read endpointi ekle (ticket timeline).
- Team member icin DB unique constraint + lider kurali ekle.

P2 - Urun olgunlugu:

- Watcher/attachment yonetim endpointlerini tamamla.
- Notification/escalation tetiklerini SLA/history ile bagla.
- Team kapasite/skill metadata (hafif seviye) ekle.

## 7. Son Cumle

CRM modulu su an "temel ticket support" icin iyi bir cekirdek sunuyor.
Ama B2B ticket support'un kritik beklentileri olan tenant guvenligi, gercek SLA otomasyonu ve tam audit trail acisindan implementasyon halen yarim.
