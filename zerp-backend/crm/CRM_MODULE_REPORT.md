# CRM Modülü — Adapter & Domain Katmanı Raporu

> **Tarih:** 27 Şubat 2026  
> **Modül:** `zerp-backend/crm`  
> **Mimari Desen:** Hexagonal Architecture (Ports & Adapters) + DDD (Domain-Driven Design)

---

## 📐 Genel Mimari Özet

CRM modülü, **Hexagonal Architecture** prensiplerini takip ederek iki ana **bounded context** üzerine inşa edilmiştir:

| Bounded Context | Aggregate Root | Alt Domain Nesneleri |
|-----------------|----------------|---------------------|
| **Team** | `Team` | `TeamMember`, `TeamId`, `TeamRole` |
| **Ticket** | `Ticket` | `Comment`, `History`, `SlaTracking`, `TicketAssignment`, `TicketId`, `TicketStatus`, `TicketPriority` |

Katman yapısı:

```
Controller → Service → Domain (Port interface) ← Adapter (JPA implementation)
```

- **Domain katmanı** iş kurallarını ve repository kontratlarını (port) tanımlar.
- **Adapter katmanı** bu kontratları JPA ile implemente eder.
- **Service katmanı** domain nesnelerini orkestra eder; iş mantığını domain'e delege eder.

---

## 🏛️ Domain Katmanı

### 1. Team Aggregate

#### `Team` — Aggregate Root (163 satır)
Takım yönetiminin tüm iş kurallarını kapsüller.

**Factory Metodları:**
| Metod | Amaç |
|-------|------|
| `Team.create(name, description)` | Yeni takım oluşturma (id=0, isActive=true, boş üye listesi) |
| `Team.reconstitute(id, name, description, isActive, members)` | Persistence'tan geri yükleme (yan etkisiz) |

**İş Kuralları (Business Rules):**
- `addMember(userId, role)` — Aktif olmayan takıma üye eklenemez; aynı kullanıcı tekrar eklenemez
- `removeMember(userId)` — Üye bulunamazsa hata fırlatılır
- `changeMemberRole(userId, newRole)` — Üye rolü değiştirme
- `promoteToLeader(userId)` — Liderliğe terfi
- `deactivate()` / `activate()` — Takım yaşam döngüsü yönetimi
- `updateDetails(name, description)` — İsim validasyonlu güncelleme

**Validasyonlar:**
- İsim boş olamaz, maksimum 100 karakter
- `getMembers()` → `Collections.unmodifiableList` ile immutable döner

#### `TeamMember` — Entity (54 satır)
| Alan | Tip | Açıklama |
|------|-----|----------|
| `id` | `Integer` | JPA tarafından atanır |
| `userId` | `Integer` | Kullanıcı kimliği (zorunlu) |
| `role` | `TeamRole` | Üye rolü (zorunlu) |
| `joinedAt` | `LocalDateTime` | Katılım tarihi |

- `create(userId, role)` → Yeni üye (id=null)
- `reconstitute(id, userId, role, joinedAt)` → Persistence'tan geri yükleme
- `changeRole(newRole)` → Rol değişikliği

#### `TeamId` — Value Object (45 satır)
- Immutable, `Integer` sarmalayan Value Object
- `equals()`, `hashCode()`, `toString()` override edilmiş
- `of(Integer)` / `of(String)` factory metodları

#### `TeamRole` — Enum
```
LEADER("Leader"), MEMBER("Member")
```

#### `TeamRepository` — Port Interface (37 satır)
```java
Team save(Team team);
Optional<Team> findById(TeamId teamId);
List<Team> findByMemberUserId(Integer userId);
void delete(TeamId teamId);
boolean exists(TeamId teamId);
```

---

### 2. Ticket Aggregate

#### `Ticket` — Aggregate Root (378 satır)
Ticket yaşam döngüsünün tamamını yönetir. En karmaşık domain nesnesi.

**Factory Metodları:**
| Metod | Amaç |
|-------|------|
| `Ticket.create(title, description, tenantId, createdByPartyId, priority)` | Yeni ticket oluşturma → SLA başlatır, ilk history kaydı oluşturur |
| `Ticket.reconstitute(...)` | 14 parametreli persistence'tan geri yükleme (yan etkisiz) |

**İş Kuralları:**

| Metod | Kural |
|-------|-------|
| `addComment(...)` | Kapalı/iptal ticket'a yorum eklenemez; AGENT ilk yanıtı → SLA first response kaydedilir |
| `changeStatus(newStatus, actorId)` | Durum geçiş matrisi kontrol edilir (`canTransitionTo`); RESOLVED → resolvedAt set, CLOSED → closedAt set |
| `changePriority(newPriority, actorId)` | Aynı öncelik ignorlanır, history kaydı oluşturulur |
| `assignToAgent(teamId, agentPartyId, assignedByPartyId)` | Reassignment varsa önce deactivate, yeni atama oluşturulur; OPEN ise IN_PROGRESS'e geçiş |
| `assignToTeam(teamId, actorId)` | Agent olmadan takıma atama |
| `unassign(actorId)` | Mevcut atama deactivate edilir, status OPEN'a döner |
| `pauseSla(minutes)` | Aktif ticket'larda SLA sürelerini uzatır |

**Durum Geçiş Matrisi (`TicketStatus.canTransitionTo`):**

```
OPEN          → IN_PROGRESS, CANCELLED
IN_PROGRESS   → WAITING_CUSTOMER, RESOLVED, CANCELLED, OPEN
WAITING_CUSTOMER → IN_PROGRESS, RESOLVED, CANCELLED, OPEN
RESOLVED      → CLOSED, OPEN (reopen)
CLOSED        → (terminal — geçiş yok)
CANCELLED     → (terminal — geçiş yok)
```

**Validasyonlar:**
- Başlık boş olamaz, maksimum 200 karakter
- Kapalı/iptal ticket'lara assign/comment yapılamaz
- `getComments()`, `getHistoryEntries()` → immutable listeler döner

#### `Comment` — Entity (74 satır)
| Alan | Tip | Açıklama |
|------|-----|----------|
| `authorId` | `Integer` | Yazar kimliği (zorunlu) |
| `authorType` | `AuthorType` | CUSTOMER / AGENT / SYSTEM |
| `content` | `String` | İçerik (1–10.000 karakter) |
| `isInternal` | `boolean` | Dahili not mu? |
| `createdAt` | `LocalDateTime` | Oluşturulma tarihi |

- `create(authorId, authorType, content, isInternal)` → Yeni yorum
- `systemComment(content)` → Sistem yorumu (authorId=0, internal=true)

#### `History` — Entity (77 satır)
Ticket üzerindeki tüm olayları denetim izi (audit trail) olarak kaydeder.

**Event Tipleri:**
```
CREATED, STATUS_CHANGED, PRIORITY_CHANGED, ASSIGNED, UNASSIGNED, REASSIGNED,
COMMENT_ADDED, UPDATED, RESOLVED, CLOSED, REOPENED,
SLA_BREACHED, SLA_PAUSED, SLA_RESUMED, CANCELLED, ASSIGNMENT_CLEARED
```

| Alan | Açıklama |
|------|----------|
| `eventType` | Olay türü |
| `actorId` | İşlemi yapan kişi |
| `referenceType` / `referenceId` | İlişkili nesne (ör. "COMMENT", commentId) |
| `payload` | Olay detayı (string) |
| `occurredAt` | Olay zamanı |

#### `SlaTracking` — Value Object (127 satır)
Servis Seviyesi Anlaşması (SLA) takibi.

| İş Kuralı | Açıklama |
|------------|----------|
| `initialize(priority)` | Önceliğe göre first response ve resolution süreleri hesaplanır |
| `recordFirstResponse()` | İlk agent yanıtı → breach kontrolü |
| `recordResolution()` | Çözüm kaydı → breach kontrolü |
| `pauseTracking(minutes)` | SLA süreleri uzatılır |
| `isFirstResponseOverdue()` | Yanıt süresi aşıldı mı? |
| `isResolutionOverdue()` | Çözüm süresi aşıldı mı? |

**Varsayılan SLA Süreleri (`TicketPriority`):**
| Öncelik | İlk Yanıt | Çözüm (4x) |
|---------|-----------|-------------|
| LOW | 8 saat (480 dk) | 32 saat |
| MEDIUM | 4 saat (240 dk) | 16 saat |
| HIGH | 2 saat (120 dk) | 8 saat |
| CRITICAL | 1 saat (60 dk) | 4 saat |

#### `TicketAssignment` — Entity (154 satır)
Ticket'ın takıma veya agent'a atanmasını modelleyen entity.

| Factory | Açıklama |
|---------|----------|
| `assignToTeam(ticketId, teamId, assignedByPartId, reason)` | Takıma atama (agentPartyId=null) |
| `assignToAgent(ticketId, teamId, assignedByPartId, agentPartyId, reason)` | Agent'a atama |
| `reconstitute(...)` | Persistence'tan geri yükleme |

- `deactivate()` → active=false, unassignedAt set edilir
- Zaten inactive ise `IllegalStateException` fırlatılır

#### `TicketId` — Value Object (43 satır)
- `TeamId` ile aynı yapıda, `Integer` sarmalayan immutable Value Object

#### `TicketRepository` — Port Interface (57 satır)
```java
Ticket save(Ticket ticket);
Optional<Ticket> findById(TicketId ticketId);
List<Ticket> findByCustomerId(Integer customerId);
List<Ticket> findByAssignedAgentId(Integer agentPartyId);
List<Ticket> findByTeamId(Integer teamId);
List<Ticket> findByStatus(TicketStatus status);
List<Ticket> findSlaBreachedTickets();
void delete(TicketId ticketId);
boolean exists(TicketId ticketId);
```

---

## 🔌 Adapter Katmanı (Persistence)

### JPA Repository Arayüzleri

| Interface | Entity | Açıklama |
|-----------|--------|----------|
| `JpaTeamRepository` | `TeamEntity` | `JpaRepository<TeamEntity, Integer>` — Spring Data JPA otomatik implementasyon |
| `JpaTicketRepository` | `TicketEntity` | `JpaRepository<TicketEntity, Integer>` — Spring Data JPA otomatik implementasyon |

> **Not:** Entity sınıfları (`TeamEntity`, `TicketEntity`, vb.) `org.zerp.common.entity.crm` paketinde tanımlıdır (ortak modül).

---

### `TeamRepositoryAdapter` (149 satır)

`TeamRepository` port arayüzünü implemente eder.

**Temel Strateji: Create vs Merge**

```
save(Team) → isNew?
  ├── YES → createNewEntity() → yepyeni entity oluştur
  └── NO  → findById() → mergeIntoEntity() → mevcut managed entity'yi güncelle
```

**Merge Mantığı (`mergeMembers`):**
1. Mevcut entity üyeleri ID ile indekslenir
2. Domain'den kaldırılan üyeler entity'den `removeIf` ile silinir
3. Mevcut üyeler → in-place güncellenir (sadece role)
4. Yeni üyeler (id=null) → koleksiyona eklenir

**Mapping:**
- `toDomain(TeamEntity)` → `Team.reconstitute(...)` ile domain nesnesine dönüşüm
- `TeamMember.reconstitute(id, userId, role, joinedAt)` ile üye dönüşümü
- Enum dönüşümleri `valueOf(name())` ile yapılır

**İmplemente Edilmemiş Metodlar:**
- `findByMemberUserId()` → `List.of()` dönüyor (TODO)

---

### `TicketRepositoryAdapter` (357 satır)

`TicketRepository` port arayüzünü implemente eder. En karmaşık adapter.

**Temel Strateji — Aynı Create vs Merge Deseni:**

```
save(Ticket) → isNew?
  ├── YES → createNewEntity()
  │         ├── applyScalarFields()
  │         ├── assignment → toNewAssignmentEntity()
  │         ├── comments → forEach toNewCommentEntity()
  │         ├── history → forEach toNewHistoryEntity()
  │         └── sla → toNewSlaEntity()
  └── NO → findById() → mergeIntoEntity()
            ├── applyScalarFields()
            ├── mergeAssignment()
            ├── mergeComments()
            ├── mergeHistory()
            └── mergeSla()
```

**Merge Stratejileri (Alt Koleksiyonlar):**

| Koleksiyon | Strateji | Detay |
|------------|----------|-------|
| **Assignment** | ID eşleşmesi → in-place güncelleme | Aynı ID → tüm alanlar güncellenir; farklı ID veya yeni → yeni entity replace |
| **Comments** | Append-only | ID ile indeksle → yeni olanlar (id=null veya id eşleşmez) eklenir; mevcut yorumlar immutable kabul edilir |
| **History** | Append-only | Comments ile aynı strateji; mevcut history kayıtları immutable |
| **SLA** | Singleton merge | Mevcut var → tüm alanlar in-place güncellenir; yoksa yeni oluşturulur |

**Entity → Domain Dönüşümü (`toDomain`):**
- Comments → `Comment.create(...)` + `setId()` ile reconstitute
- History → `History.createWithReference(...)` + `setId()` ile reconstitute
- SLA → `SlaTracking.initialize(MEDIUM)` + tüm alanlar setter ile override
- Assignment → `TicketAssignment.reconstitute(...)` ile tam reconstitute

**İmplemente Edilmemiş Metodlar (TODO):**
- `findByCustomerId()` → `List.of()`
- `findByAssignedAgentId()` → `List.of()`
- `findByTeamId()` → `List.of()`
- `findByStatus()` → `List.of()`
- `findSlaBreachedTickets()` → `List.of()`

---

## 📊 Dosya Özet Tablosu

### Domain Katmanı (14 dosya)

| Dosya | Tip | Satır | Açıklama |
|-------|-----|-------|----------|
| `domain/team/Team.java` | Aggregate Root | 163 | Takım iş kuralları |
| `domain/team/TeamMember.java` | Entity | 54 | Takım üyesi |
| `domain/team/TeamId.java` | Value Object | 45 | Takım kimliği |
| `domain/team/TeamRole.java` | Enum | 17 | LEADER, MEMBER |
| `domain/team/TeamRepository.java` | Port Interface | 37 | Takım repository kontratı |
| `domain/ticket/Ticket.java` | Aggregate Root | 378 | Ticket iş kuralları |
| `domain/ticket/Comment.java` | Entity | 74 | Ticket yorumu |
| `domain/ticket/History.java` | Entity | 77 | Denetim izi (audit trail) |
| `domain/ticket/SlaTracking.java` | Value Object | 127 | SLA takibi |
| `domain/ticket/TicketAssignment.java` | Entity | 154 | Ticket ataması |
| `domain/ticket/TicketId.java` | Value Object | 43 | Ticket kimliği |
| `domain/ticket/TicketStatus.java` | Enum | 37 | 6 durum + geçiş matrisi |
| `domain/ticket/TicketPriority.java` | Enum | 25 | 4 öncelik + SLA süreleri |
| `domain/ticket/TicketRepository.java` | Port Interface | 57 | Ticket repository kontratı |

### Adapter Katmanı (4 dosya)

| Dosya | Tip | Satır | Açıklama |
|-------|-----|-------|----------|
| `adapter/persistence/TeamRepositoryAdapter.java` | Adapter | 149 | Team port implementasyonu |
| `adapter/persistence/TicketRepositoryAdapter.java` | Adapter | 357 | Ticket port implementasyonu |
| `adapter/persistence/JpaTeamRepository.java` | JPA Interface | 8 | Spring Data JPA |
| `adapter/persistence/JpaTicketRepository.java` | JPA Interface | 8 | Spring Data JPA |

**Toplam:** 18 Java dosyası | ~1.645 satır kod

---

## 🔍 Önemli Tasarım Kararları

1. **Create vs Reconstitute Ayrımı:** Tüm aggregate root'lar ve entity'ler iki farklı constructor sunar — `create()` yan etkili (history oluşturma, SLA başlatma), `reconstitute()` yan etkisiz. Bu, persistence'tan yüklenen nesnelerin gereksiz yan etki üretmemesini garanti eder.

2. **Managed Entity Merge Stratejisi:** Adapter'lar güncellemede `jpaRepository.findById()` ile Hibernate-managed entity'yi yükler ve üzerine merge eder. Bu, Hibernate'in dirty-checking mekanizmasıyla uyum sağlar ve orphan/detach sorunlarını önler.

3. **Immutable Koleksiyonlar:** Domain dışına verilen listeler `Collections.unmodifiableList()` ile korunur; koleksiyon değişiklikleri yalnızca aggregate root'un iş metotları üzerinden yapılabilir.

4. **Append-only Koleksiyonlar:** Comments ve History koleksiyonları adapter'da append-only olarak ele alınır — bir kez oluşturulan yorum veya history kaydı güncellenmez.

5. **Entity'ler `common` Modülde:** JPA entity sınıfları (`TeamEntity`, `TicketEntity`, vb.) `org.zerp.common.entity.crm` paketinde tanımlıdır. Bu, diğer mikroservislerden (Feign vb.) ortak erişim sağlar.

---

## ⚠️ Eksikler & TODO'lar

| Konum | Eksik | Etki |
|-------|-------|------|
| `TeamRepositoryAdapter.findByMemberUserId()` | İmplemente edilmemiş | Kullanıcının üye olduğu takımları sorgulama |
| `TicketRepositoryAdapter.findByCustomerId()` | İmplemente edilmemiş | Müşteriye ait ticketları listeleme |
| `TicketRepositoryAdapter.findByAssignedAgentId()` | İmplemente edilmemiş | Agent'a atanan ticketları listeleme |
| `TicketRepositoryAdapter.findByTeamId()` | İmplemente edilmemiş | Takıma atanan ticketları listeleme |
| `TicketRepositoryAdapter.findByStatus()` | İmplemente edilmemiş | Duruma göre ticket filtreleme |
| `TicketRepositoryAdapter.findSlaBreachedTickets()` | İmplemente edilmemiş | SLA ihlali olan ticketları bulma |
| `SlaTracking` toDomain mapping | `initialize(MEDIUM)` hardcoded | Gerçek öncelik yerine sabit MEDIUM ile başlatılıp setter'larla override ediliyor |
