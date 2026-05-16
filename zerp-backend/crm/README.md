# CRM SLA Tracking

Bu dokuman CRM modulundeki `TicketSlaTrackingEntity` mekanizmasinin ne icin
kullanildigini, mevcut kodun bunu nasil ele aldigini ve uretim icin hangi
parcalarin eklenmesi gerektigini anlatir.

## Amac

SLA tracking, bir ticket icin iki ana sureyi takip etmelidir:

- `first_response`: Musteriye verilen ilk gecerli agent cevabinin hedef sure
  icinde verilip verilmedigi.
- `resolution`: Ticket'in hedef sure icinde cozulup cozulmedigi.

Bu mekanizma sadece tarih alanlari tutmak icin degil, operasyonel karar almak
icin de kullanilmalidir: geciken ticket'lari listelemek, escalation tetiklemek,
dashboard metrikleri uretmek ve history uzerinden SLA olaylarini izlemek.

## Mevcut Model

SLA verisi `TicketSlaTrackingEntity` icinde tutulur ve her ticket icin tekil bir
tracker vardir:

- `ticket`: takip edilen ticket.
- `firstResponseDueAt`: ilk cevap icin son hedef zaman.
- `firstResponseAt`: ilk cevap verilen zaman.
- `isFirstResponseBreached`: ilk cevap SLA'i asildi mi.
- `resolutionDueAt`: cozum icin son hedef zaman.
- `resolutionAt`: ticket'in cozuldugu zaman.
- `isResolutionBreached`: cozum SLA'i asildi mi.
- `isPaused`: SLA su an duraklatilmis mi.
- `pausedAt`: aktif pause'un baslangic zamani.
- `totalPausedTimeMinutes`: toplam pause suresi.

`TicketEntity` tarafinda bu iliski `@OneToOne(mappedBy = "ticket", cascade =
CascadeType.ALL, orphanRemoval = true)` ile tutulur. Bu nedenle ticket save
edildiginde tracker da persist edilir.

## Mevcut Kod Akisi

Ticket olusturulurken `TicketService.createTicket` icinde `initializeSla`
cagrilir. Mevcut hesap:

```java
firstResponseDueAt = now + priority.defaultResponseTimeMinutes
resolutionDueAt = now + priority.defaultResponseTimeMinutes * 4
```

Bu basit bir MVP hesabi olarak calisir, fakat policy/config tablosu yerine
priority enum'una gomulu oldugu icin esnek degildir.

Ilk cevap `TicketService.addComment` icinde set edilir. Mevcut davranis:

```java
if (!isInternal && slaTracking != null && firstResponseAt == null) {
    firstResponseAt = now;
    isFirstResponseBreached = now > firstResponseDueAt;
}
```

Bu noktada dikkat edilmesi gereken kritik detay: `!isInternal` tek basina
"agent musteriyi yanitladi" demek degildir. Musteri tarafindan yazilan public
comment de internal degildir. Bu yuzden first response icin ideal kosul
`authorType == AGENT && !isInternal` olmalidir.

Resolution bilgisi `changeStatus` ve `changeStatusInternal` icinde status
`RESOLVED` oldugunda `recordSlaResolution` ile set edilir. Burada da breach,
resolve aninda `now > resolutionDueAt` olarak hesaplanir.

## Olmasi Gereken Yasam Dongusu

Onerilen net akis:

1. Ticket `OPEN` olarak olusturulur.
2. SLA tracker olusturulur ve due alanlari SLA policy'ye gore hesaplanir.
3. Ticket ilgili takima atanir ve normal operasyon baslar.
4. Ilk public agent cevabinda `firstResponseAt` set edilir.
5. Ticket `WAITING_CUSTOMER` durumuna alinirsa SLA pause edilir.
6. Ticket `IN_PROGRESS` veya `OPEN` durumuna donerse SLA resume edilir.
7. Ticket `RESOLVED` olursa `resolutionAt` set edilir.
8. Sure asimlari periyodik job ile isaretlenir.
9. SLA olaylari `TicketHistoryEntity.EventType` ile history'ye yazilir.

## Status ve SLA Iliskisi

Onerilen varsayilan durum matrisi:

| Status | SLA davranisi |
| --- | --- |
| `OPEN` | SLA calisir |
| `IN_PROGRESS` | SLA calisir |
| `WAITING_CUSTOMER` | SLA pause edilir |
| `RESOLVED` | Resolution SLA kapanir |
| `CLOSED` | SLA kapali kalir |
| `CANCELLED` | SLA iptal/kapatilmis kabul edilir |

`WAITING_CUSTOMER` durumunda bekleme suresi agent'in kontrolunde olmadigi icin
due zamanlari bu kadar ileri atilmalidir. Aksi halde musteri bekleme suresi
agent SLA'ini haksiz sekilde bozar.

## Pause ve Resume Kurali

Pause:

- Sadece aktif ticket'larda uygulanmali.
- `isPaused = true`
- `pausedAt = now`
- History'ye `SLA_PAUSED` yazilmali.

Resume:

- Sadece `isPaused = true` ise uygulanmali.
- `pausedMinutes = minutesBetween(pausedAt, now)`
- `totalPausedTimeMinutes += pausedMinutes`
- `firstResponseDueAt` henuz cevap verilmediyse ileri atilmali.
- `resolutionDueAt` henuz resolve edilmediyse ileri atilmali.
- `isPaused = false`
- `pausedAt = null`
- History'ye `SLA_RESUMED` yazilmali.

Bu davranis `changeStatus` ve `changeStatusInternal` icinde merkezi bir helper
ile calismalidir. Aksi halde assign/unassign gibi internal status degisimleri
SLA state'ini atlayabilir.

## Breach Tespiti

Breach sadece ticket uzerinde islem yapildiginda hesaplanmamalidir. Ticket'a
kimse dokunmazsa sure asimi fark edilmez. Bunun icin CRM modulune scheduled job
eklenmelidir.

Onerilen job:

- Her 1-5 dakikada bir calisir.
- Aktif ve pause edilmemis tracker'lari tarar.
- `firstResponseAt == null && firstResponseDueAt < now` ise
  `isFirstResponseBreached = true` yapar.
- `resolutionAt == null && resolutionDueAt < now` ise
  `isResolutionBreached = true` yapar.
- Ilk kez breach oluyorsa history'ye `SLA_BREACHED` ekler.
- Gerekirse notification/escalation event'i publish eder.

Bu is icin ayri bir `TicketSlaTrackingRepository` ve `TicketSlaService`
olusturmak daha temiz olur. `TicketService` ticket operasyonlarini yonetmeli,
SLA hesap/monitoring detayi ayri servise alinmalidir.

## Policy Tasarimi

Mevcut kodda SLA suresi `TicketPriority` enum'undaki
`defaultResponseTimeMinutes` alanindan geliyor. Kisa vadede yeterli, fakat
gercek kullanimda SLA kurallari daha fazla boyuta bagli olur:

- tenant
- ticket type
- priority
- musteri segmenti
- calisma saatleri
- tatiller
- team

Onerilen model:

```text
ticket_sla_policy
- id
- tenant_id
- issue_type
- priority
- first_response_minutes
- resolution_minutes
- business_hours_only
- active
```

`initializeSla` bu policy tablosundan kural bulmali. Kural yoksa default
fallback kullanilabilir.

## Current Code Icin Eklenebilecekler

Oncelik sirasiyla:

1. `addComment` icinde first response kosulunu duzelt:
   `authorType == AGENT && !isInternal`.
2. `changeStatus` ve `changeStatusInternal` icine pause/resume hook'u ekle.
3. `reopen` durumunda `resolutionAt` ve resolution breach davranisini netlestir.
   Reopen edilen ticket tekrar cozulmeye aciliyorsa `resolutionAt = null`
   yapilmali veya yeni bir SLA cycle modeli kurulmalidir.
4. `changePriority` sonrasi due alanlari yeniden hesaplanmali mi karar ver.
   Eger recalculation yapilacaksa sadece kapanmamis hedefler etkilenmeli.
5. `TicketResponse.SlaTrackingResponse` icine `isPaused`, `pausedAt`,
   `remainingFirstResponseMinutes`, `remainingResolutionMinutes` gibi UI icin
   gerekli alanlar ekle.
6. `TicketFilterSpecGenerator` veya genel filter altyapisinda SLA alanlari icin
   filtre destegi ekle:
   `slaTracking.isResolutionBreached`, `slaTracking.resolutionDueAt`,
   `slaTracking.firstResponseDueAt`.
7. `LocalDateTime.now()` dogrudan cagirmak yerine `Clock` inject et. Boylece SLA
   testleri deterministik olur.
8. Scheduled breach checker ekle.
9. SLA event'lerini history'ye yaz ve notification modulune event publish et.

## Ornek Helper Sorumluluklari

`TicketSlaService` icin mantikli metodlar:

```java
TicketSlaTrackingEntity initialize(TicketEntity ticket);

void recordFirstResponseIfEligible(
        TicketEntity ticket,
        TicketCommentEntity.AuthorType authorType,
        boolean internal);

void recordResolution(TicketEntity ticket);

void pause(TicketEntity ticket);

void resume(TicketEntity ticket);

void recomputeOnPriorityChange(TicketEntity ticket, TicketPriority oldPriority);

int markBreaches(LocalDateTime now);
```

Bu ayrim `TicketService` icindeki business operasyonlarini sade tutar ve SLA
hesaplarini tek yerde toplar.

## API Kullanimi

Ticket response icinde `slaTracking` client'a donuyor. Bu alan frontend'de su
sekilde kullanilmali:

- `firstResponseAt == null`: Ilk cevap bekleniyor.
- `isFirstResponseBreached == true`: Ilk cevap SLA'i gecilmis.
- `resolutionAt == null`: Cozum SLA'i devam ediyor.
- `isResolutionBreached == true`: Cozum SLA'i gecilmis.
- `isPaused == true`: Sure sayaci durmus, genellikle musteri bekleniyor.
- Due tarihleri yaklastikca UI warning gosterebilir.

Tenant kullanicisi icin SLA alanlari gorunurlugu permission'a bagli kalmali.
Mevcut kod `READ_TICKET_SLA_TRACKING` izni yoksa response icindeki
`slaTracking` alanini `null` donuyor. Bu davranis korunmali.

## Test Senaryolari

SLA tamamlandi demek icin minimum testler:

1. Ticket create edildiginde tracker olusur.
2. Public customer comment first response set etmez.
3. Public agent comment first response set eder.
4. Internal agent comment first response set etmez.
5. First response due gecildiyse breach true olur.
6. Status `WAITING_CUSTOMER` olunca SLA pause edilir.
7. Pause sonrasi `IN_PROGRESS` olunca SLA resume edilir ve due tarihleri ileri
   atilir.
8. `RESOLVED` olunca `resolutionAt` set edilir.
9. Resolution due gecildiyse breach true olur.
10. Scheduled checker dokunulmayan ticket'lari breach olarak isaretler.
11. Permission yoksa response icinde `slaTracking` null doner.

## Kisa Sonuc

Mevcut kod SLA tracking icin iyi bir baslangic yapiyor: entity, create-time
initialization, first response ve resolution alanlari mevcut. Eksik kisim,
SLA'in bir operasyonel state machine gibi ele alinmasi. Bunu tamamlamak icin
pause/resume, dogru first-response eligibility, scheduled breach detection,
history eventleri ve policy tablosu eklenmelidir.
