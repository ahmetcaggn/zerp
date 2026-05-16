# Employee Module Report

Tarih: 2026-05-09  
Kapsam: `employee` modulunun backend, tenant frontend ve mobil taraftaki mevcut durumu.  
Ana kaynaklar:

- Backend servis: `zerp-backend/employee`
- Ortak entity ve filter altyapisi: `zerp-backend/common`
- Tenant web arayuzu: `zerp-frontend/zerp-tenant/src/modules/tenant`
- Mobil placeholder ve generated client: `zerp-mobile/zerp_tenant`

## 1) Kisa Ozet

Employee modulu su anda calisan kaydi olusturma, listeleme, detay goruntuleme, guncelleme, patch, toplu patch, soft delete, toplu soft delete, arama ve silinmis calisanlari listeleme islerini yapiyor. Calisan kaydi olustururken User servisi uzerinden username kontrolu yapip Keycloak kullanicisi olusturuyor; olusan Keycloak user id'sini Employee/AppUser id'si olarak kullanip employee kaydini Postgres'e yaziyor.

Tenant frontend tarafinda `/employees` listesi, arama, yeni calisan dialog'u, detay sayfasi, edit dialog'u, silme ve silinmis calisanlar sekmesi var. Dashboard da toplam calisan sayisi ve son calisanlari employee endpointlerinden cekiyor.

Modulun en onemli eksikleri: restore akisi backend'de yok ama frontend'de butonu var, search/deleted endpointleri permission filtresini atliyor, request DTO validation anotasyonlari controller'da `@Valid` olmadigi icin tam devreye girmiyor, soft delete Keycloak hesabini kapatmiyor, employee email/status degisikligi Keycloak'a senkronize edilmiyor, manager seciminde tenant tutarliligi kontrol edilmiyor, frontend generated tiplerde UUID alanlari number gorunuyor.

## 2) Modul Haritasi

Backend dosyalari:

- `EmployeeApplication`: Spring Boot employee servisini baslatir; Eureka, OpenFeign, JPA auditing, common package scan ve repository scan acar.
- `EmployeeController`: `/employee` prefix'i altinda generic resource CRUD endpointlerini ve employee'e ozel search/deleted endpointlerini acar.
- `EmployeeService`: asil business logic, permission kontrolu, Keycloak/user-service entegrasyonu, soft delete ve filtreleme burada.
- `EmployeeRepository`: Employee icin JPA repository, soft-delete-aware sorgular, search ve deleted sorgular.
- `EmployeeMapper`: MapStruct entity/DTO mapping.
- `EmployeePermissionEvaluator`: READ/CREATE/UPDATE/DELETE employee izinlerini PermissionRepository ve PermittableService uzerinden kontrol eder.
- `UserServiceClient`: User servisine Feign ile username kontrolu, Keycloak user create/delete ve user DB endpointleri icin client.
- `GlobalExceptionHandler`: not found, duplicate, validation, bad request ve generic hata cevaplarini `ProblemDetail` olarak doner.

Ortak model dosyalari:

- `common/entity/employee/Employee`
- `common/entity/employee/EmployeeContact`
- `common/entity/employee/EmploymentStatus`
- `common/entity/employee/ContactType`
- `common/resource/util/filter/specgenerator/EmployeeFilterSpecGenerator`
- `common/permission/entity/PermissionAction`
- `common/permission/repository/PermissionRepository`

Tenant frontend dosyalari:

- `employee-client.ts`: `/employee` API client.
- `use-employees.ts`: React Query hook'lari.
- `use-username-check.ts`: username uygunluk kontrolu.
- `employee-list.tsx`: liste, arama, delete ve deleted tab.
- `employee-form-dialog.tsx`: create/edit formu.
- `employee-detail.tsx`: detay ve edit girisi.
- `deleted-employees.tsx`: silinmis kayitlar tablosu ve restore butonu.

Mobil taraf:

- `modules/openapi_employee`: generated Dart OpenAPI client.
- `feature/employee`: su anda sadece placeholder ekran ve loading state tutan basit Cubit.

## 3) Backend Veri Modeli

### 3.1 Employee

`Employee`, `AppUser` sinifindan kalitim aliyor ve `employees` tablosuna yaziliyor. `AppUser` ise joined inheritance ile temel user alanlarini tasiyor.

AppUser/BaseEntity tarafindan gelen alanlar:

- `id`: UUID. Employee create sirasinda Keycloak user id olarak set ediliyor.
- `username`: unique, nullable false.
- `email`: unique, nullable false.
- `tenantId`: `tenant_id`, nullable false, updatable false.
- `tenant`: `Tenant` many-to-one, `tenant_id` ile bagli.
- `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `deletedAt`, `deleted`, `version`.

Employee alanlari:

- `firstName`: nullable false.
- `lastName`: nullable false.
- `phoneNumber`.
- `nationalId`: unique.
- `dateOfBirth`.
- `hireDate`: nullable false.
- `terminationDate`.
- `status`: `EmploymentStatus`.
- `manager`: self many-to-one, `manager_id`.
- `salary`.
- `contacts`: one-to-many `EmployeeContact`, cascade all, orphan removal.

Employee status enum'u:

- `ACTIVE`
- `TERMINATED`
- `SUSPENDED`
- `ON_LEAVE`
- `RETIRED`
- `PROBATION`
- `DELETED`

### 3.2 EmployeeContact

`employee_contacts` tablosunda tutuluyor. Soft delete icin `@SQLDelete` ve `@SQLRestriction("deleted = false")` var.

Alanlar:

- `id`: Long, identity.
- `type`: `ContactType`, nullable false.
- `value`: telefon/e-posta/deger, nullable false.
- `contactPersonName`: emergency contact icin isim.
- `relationship`: emergency contact iliski bilgisi.
- `employee`: Employee many-to-one.

Contact type enum'u:

- `WORK_PHONE`
- `PERSONAL_PHONE`
- `WORK_EMAIL`
- `PERSONAL_EMAIL`
- `EMERGENCY_CONTACT`

## 4) Backend API Yuzeyi

`EmployeeController`, `ResourceController`'i extend ettigi icin generic resource endpointlerini otomatik aliyor.

### 4.1 Standard endpointler

`GET /employee`

- React-admin uyumlu list endpoint.
- Zorunlu pagination parametreleri: `_start`, `_end`.
- Opsiyonel sort parametreleri: `_sort`, `_order`.
- Kalan query parametreleri filter olarak isleniyor.
- Response header: `X-Total-Count`.
- Service tarafinda permission read spec ile filter spec birlestiriliyor.

`GET /employee/many?id={id}&id={id}`

- Birden fazla employee detayini dondurur.
- Bulunamayan veya read izni olmayan id'leri sessizce atlar.

`GET /employee/{id}`

- Employee detayini contacts ile beraber dondurur.
- Kayit yoksa 404.
- READ_EMPLOYEE izni yoksa 403.

`POST /employee`

- Employee ve Keycloak user olusturur.
- Basarili olursa 201.

`PUT /employee/{id}`

- DTO uzerinden guncelleme yapar.
- Null gelen alanlar mevcut degeri korur; tam replace gibi degil, pratikte partial update gibi calisir.

`PATCH /employee/{id}`

- Map alanlari uzerinden partial update yapar.
- Desteklenen scalar alanlar: `firstName`, `lastName`, `email`, `phoneNumber`, `nationalId`, `dateOfBirth`, `hireDate`, `terminationDate`, `status`, `salary`.
- `managerId` ve `contacts` icin ayrica logic var.

`PATCH /employee?id={id}&id={id}`

- Ayni patch fields'i birden fazla id'ye uygular.
- Bulunamayan id'leri sessizce atlar.

`DELETE /employee/{id}`

- Fiziksel delete yapmaz.
- Employee soft delete edilir.

`DELETE /employee?id={id}&id={id}`

- Birden fazla employee icin soft delete.
- Bulunamayan id'leri sessizce atlar.

### 4.2 Employee'e ozel endpointler

`GET /employee/search?keyword={keyword}`

- `firstName`, `lastName`, `email` alanlarinda case-insensitive contains aramasi yapar.
- Pageable alir.
- Response Spring `Page<EmployeeListResponseDto>` envelope icinde gelir.

`GET /employee/deleted`

- Soft deleted employee kayitlarini liste olarak dondurur.

`GET /employee/deleted/paginated`

- Soft deleted employee kayitlarini pageable sekilde dondurur.

## 5) Backend Is Kurallari

### 5.1 Create akisi

`EmployeeService.create` sirasiyla sunlari yapar:

1. `X-User-Id` ve `X-Tenant-Id` context header'larindan current user ve tenant id cozulur.
2. Email ve nationalId icin aktif kayitlar arasinda unique kontrolu yapilir.
3. Current user'in tenant parent uzerinde `CREATE_EMPLOYEE` izni kontrol edilir.
4. User servisi `/user/usernames/check` endpointi ile username uygunlugu kontrol edilir.
5. User servisi `/feign/keycloak/users` endpointi ile Keycloak user olusturulur.
6. Keycloak response icindeki `userId`, Employee id olarak kullanilir.
7. DTO entity'ye map edilir.
8. `tenantId`, `username`, manager ve contacts set edilir.
9. Employee repository ile kaydedilir.
10. DB save hata verirse olusturulan Keycloak user silinmeye calisilir.

Create DTO alanlari:

- `username`: zorunlu ve pattern'li.
- `tempPassword`: zorunlu, min 8.
- `firstName`, `lastName`, `email`, `hireDate`: zorunlu gibi tasarlanmis.
- `phoneNumber`, `nationalId`, `dateOfBirth`, `status`, `managerId`, `salary`, `isActive`, `contacts`: opsiyonel.

Not: `isActive` DTO'da var ama entity/service tarafinda su an kullanilmiyor.

### 5.2 Update akisi

`EmployeeService.update`:

- Employee'i contacts ile beraber aktif kayitlardan bulur.
- `UPDATE_EMPLOYEE` izni kontrol eder.
- Email/nationalId unique kontrolu yapar.
- Null olmayan alanlari entity'ye uygular.
- `managerId` employee'nin kendi id'si ise hata verir.
- Manager id varsa aktif employee olarak arar ve set eder.
- `contacts` varsa mevcut contact listesini tamamen temizleyip yeni listeyi ekler.

### 5.3 Patch akisi

`EmployeeService.patch`:

- Employee'i aktif kayitlardan bulur.
- `UPDATE_EMPLOYEE` izni ile ayni mantiktaki `canPatch` kontrolunu yapar.
- Email/nationalId icin unique kontrolu yapar.
- Map icindeki desteklenen scalar alanlari parse edip set eder.
- `managerId` varsa UUID parse edip set eder.
- `contacts` varsa tum contact listesini replace etmeye calisir.

### 5.4 Delete akisi

`deleteById` fiziksel silme yapmaz. `Employee.deleteEmployee()` cagrilir:

- `status = DELETED`
- `terminationDate = LocalDate.now()`
- `deleted = true`
- `deletedAt = LocalDateTime.now()`

Ardindan employee save edilir.

### 5.5 Filtreleme

Generic list endpointinde filter key/value map'i `FilterRefiner` uzerinden `EmployeeFilterSpecGenerator`'a gider.

Employee global search filter:

- `q` field'i global search olarak yorumlanir.
- `firstName`, `lastName`, `email` alanlarinda case-insensitive contains arar.

Standard field filter:

- `FilterProcessor` ile entity field predicate'i uretir.
- Ornek pattern repo genelinde `status.eq=ACTIVE` seklinde kullaniliyor.

### 5.6 Permission modeli

Employee icin kullanilan action'lar:

- `CREATE_EMPLOYEE`: min target type `TENANT`.
- `READ_EMPLOYEE`: target type `EMPLOYEE`.
- `UPDATE_EMPLOYEE`: target type `EMPLOYEE`.
- `DELETE_EMPLOYEE`: target type `EMPLOYEE`.

Permission hiyerarsisi:

- Employee hedefindeki permission dogrudan gecerli.
- Tenant hedefindeki permission ilgili tenant altindaki employee icin gecerli.
- Tenant root permission her tenant icin gecerli.

List endpointinde:

- `permittableService.getAllPermitted(userId, EMPLOYEE, READ_EMPLOYEE)`
- `permittableService.getAllPermitted(userId, TENANT, READ_EMPLOYEE)`

ile employee id veya tenant id bazli read spec olusturuluyor.

## 6) Frontend Durumu

### 6.1 Tenant web sayfalari

Mevcut route'lar:

- `/[locale]/employees`
- `/[locale]/employees/[id]`

Sidebar'da employees linki var. Dashboard da employee verisini kullaniyor.

### 6.2 Liste ekrani

`EmployeeList` sunlari yapiyor:

- Employee listesini sayfali ceker.
- `_start`, `_end`, `_sort`, `_order` query formatini kullanir.
- Arama input'u 400 ms debounce ile calisir.
- Arama sadece keyword uzunlugu en az 2 ise `/employee/search` endpointine gider.
- Tab 0 aktif employee listesini, tab 1 deleted employees listesini gosterir.
- Liste kolonlari: full name, email, phone, status, actions.
- Detay butonu `/employees/{id}` route'una gider.
- Delete butonu `DELETE /employee/{id}` cagirir.

### 6.3 Create/edit dialog

`EmployeeFormDialog`:

- Create modunda username ve temp password alanlarini gosterir.
- Username icin `/user/usernames/check` endpointini 400 ms debounce ile cagirir.
- Form alanlari: firstName, lastName, email, hireDate, dateOfBirth, phoneNumber, nationalId, status, salary, manager, contacts.
- Manager secenekleri ilk 50 employee kaydindan gelir.
- Contact satiri ekleme/silme vardir.
- Create icin `POST /employee`.
- Edit icin `PUT /employee/{id}`.

### 6.4 Detail ekrani

`EmployeeDetail`:

- `GET /employee/{id}` ile detay ceker.
- Avatar, ad soyad, email, status ve phone chip'leri gosterir.
- Employment bilgileri: hireDate, terminationDate, salary, manager.
- Personal bilgiler: email, nationalId, dateOfBirth, employee id.
- Contacts varsa listeler.
- createdAt/updatedAt sistem bilgilerini gosterir.
- Edit dialog'u acar.

### 6.5 Deleted employees ekrani

`DeletedEmployees`:

- `GET /employee/deleted/paginated` kullanir.
- Full name, email, phone listeler.
- Restore butonu vardir.
- Restore butonu `PATCH /employee/{id}` icin `{ isActive: true }` gonderir.

Bu restore akisi backend tarafinda su an calismaz; detaylar "Mevcut Eksikler" bolumunde.

### 6.6 Dashboard kullanimi

Dashboard employee verisini iki yerde kullaniyor:

- KPI card: `GET /employee` ile total count okur.
- Recent activity: son 5 employee kaydini ceker ve detay sayfasina linkler.

## 7) Mobil Durumu

Mobil tarafta employee icin iki seviye var:

1. `modules/openapi_employee` altinda generated Dart OpenAPI client ve test scaffold'lari var.
2. `feature/employee` ekraninda su anda gercek liste/detail/create akisi yok; sadece localized placeholder text gosteriliyor.

Yani mobil tarafta API client uretilmis durumda, fakat employee feature UI henuz implemente edilmemis.

## 8) Su Anda Ne Yapiyor?

Backend:

- Employee microservice olarak Eureka'ya kaydoluyor.
- Gateway uzerinden `/employee/**` route'u ile erisiliyor.
- Gateway JWT'den `X-User-Id` ve `X-Tenant-Id` header'larini downstream servise tasiyor.
- Employee CRUD endpointlerini sagliyor.
- Employee listelerinde pagination, sorting ve filter query parametrelerini destekliyor.
- List endpointinde READ_EMPLOYEE permission filtresi uyguluyor.
- Tekil detail endpointinde READ_EMPLOYEE kontrolu yapiyor.
- Create/update/patch/delete icin permission kontrolu yapiyor.
- Create sirasinda username uygunlugu kontrol ediyor.
- Create sirasinda Keycloak user olusturuyor.
- Keycloak user id'sini employee id olarak kullaniyor.
- DB save hatasinda Keycloak user rollback delete denemesi yapiyor.
- Email ve nationalId icin aktif kayitlar arasinda duplicate kontrolu yapiyor.
- Manager iliskisi kurabiliyor.
- Contact bilgilerini employee ile birlikte kaydedebiliyor.
- Update ile scalar alanlari, manager'i ve contact listesini guncelleyebiliyor.
- Patch ile belli scalar alanlari guncelleyebiliyor.
- Delete ile employee'i soft delete yapip status'u `DELETED` yapiyor.
- Deleted employee listesi ve paginated deleted listesi dondurebiliyor.
- Search endpointi ile firstName/lastName/email arayabiliyor.
- Service unit testleri temel happy path ve bazi hata senaryolarini kapsiyor.

Tenant frontend:

- Employee liste sayfasi var.
- Search UI var.
- Create employee dialog'u var.
- Username availability feedback'i var.
- Employee detail sayfasi var.
- Edit dialog'u var.
- Delete butonu var.
- Deleted employees tab'i var.
- Dashboard employee count ve recent employee listesi cekiyor.
- React Query cache invalidation create/update/patch/delete sonrasi calisiyor.

Mobil:

- Generated OpenAPI client var.
- Employee feature route/screen placeholder olarak var.

## 9) Su Anda Ne Yapmiyor / Eksikler

### 9.1 Restore yok

Frontend'de deleted employees tab'inda restore butonu var, fakat backend'de restore endpointi veya restore service metodu yok.

Mevcut restore cagrisi:

- `PATCH /employee/{id}`
- body: `{ "isActive": true }`

Neden calismaz:

- `patch` employee'i `findByIdWithContactsAndNotDeleted` ile ariyor; deleted kayitlar bu sorguya girmez.
- `isActive` field'i backend patch tarafinda desteklenen alanlar arasinda yok.
- Soft delete'i geri almak icin `deleted=false`, `deletedAt=null`, `status` ve gerekirse `terminationDate` alanlarini ele alan bir restore metodu yok.

### 9.2 Search ve deleted endpointlerinde permission filtresi yok

`findWithFilters`, `findById`, `findAllById`, create/update/patch/delete permission kontrolu yapiyor.

Fakat su endpointlerde employee permission filtresi uygulanmiyor:

- `GET /employee/search`
- `GET /employee/deleted`
- `GET /employee/deleted/paginated`

Bu endpointler gateway seviyesinde authenticated olsa da service seviyesinde READ_EMPLOYEE permission spec'i ile kisitlanmiyor. Bu, tenant/employee gorunurlugu acisindan kritik bosluk.

### 9.3 DTO validation anotasyonlari tam devrede degil

Create/Update DTO'larinda `@NotBlank`, `@NotNull`, `@Email`, `@PastOrPresent`, `@Pattern`, `@Size` var. Ancak generic `IResourceController` request body parametrelerinde `@Valid` yok.

Sonuc:

- Controller seviyesinde validation beklenen sekilde calismayabilir.
- `GlobalExceptionHandler.handleMethodArgumentNotValid` hazir olsa da bu endpointlerde tetiklenmeyebilir.
- Zorunlu alan eksikleri service yerine DB constraint veya baska downstream hatalarla ortaya cikabilir.

### 9.4 Soft delete Keycloak hesabini kapatmiyor

`DELETE /employee/{id}` sadece employee DB kaydini soft delete ediyor. Keycloak user:

- disable edilmiyor,
- delete edilmiyor,
- role/session tarafinda revoke edilmiyor.

Bu nedenle employee silinse bile Keycloak hesabi aktif kalabilir. Sistemin diger katmanlari bu hesabi engellemiyorsa kullanici login olmaya devam edebilir.

### 9.5 Employee status Keycloak veya access control ile senkron degil

`SUSPENDED`, `TERMINATED`, `RETIRED`, `ON_LEAVE`, `DELETED` gibi status degisiklikleri sadece employee DB kaydinda tutuluyor.

Su an status degisince:

- Keycloak user enabled/disabled durumu degismiyor.
- Token/role/permission otomatik degismiyor.
- Aktif session sonlandirilmiyor.

### 9.6 Email guncellemesi Keycloak'a senkronize edilmiyor

Create sirasinda Keycloak user email'i set ediliyor. Ancak update/patch ile employee email'i degistirilirse:

- DB email degisir.
- Keycloak email'i degismez.
- User servisindeki varsa ilgili user kaydi ile tutarlilik garanti edilmez.

### 9.7 Username update yok

Create sonrasi employee username'i degistiren endpoint/akis yok.

### 9.8 Role/permission atama yok

Employee create sadece Keycloak user ve employee DB kaydi olusturuyor. Employee modulu su islemleri yapmiyor:

- Yeni calisana default permission atamak.
- Keycloak role atamak.
- Team membership olusturmak.
- Tenant employee rolunu garanti etmek.

Bu isler baska bir modulde yapilmiyorsa yeni calisan sisteme girse bile hangi kaynaklari gorecegi belirsiz kalir.

### 9.9 Manager tenant tutarliligi kontrol edilmiyor

Manager lookup sadece `findByIdAndNotDeleted(managerId)` ile yapiliyor. Current tenant'a gore sinirlanmiyor.

Risk:

- Id biliniyorsa baska tenant'taki employee manager olarak atanabilir.
- Manager icin READ/UPDATE permission kontrolu ayrica yapilmiyor.

### 9.10 Manager cycle kontrolu sadece self-check

Update/patch sirasinda employee'nin kendi kendisinin manager'i olmasi engelleniyor. Fakat daha uzun donguler engellenmiyor.

Ornek:

- A'nin manager'i B yapilabilir.
- Sonra B'nin manager'i A yapilabilir.

Bu hiyerarsi raporlama/organizasyon agaci gerekecekse problem yaratir.

### 9.11 Soft-deleted kayitlar unique constraint ile carpisabilir

Service unique kontrolu sadece `deleted=false` kayitlara bakiyor. Ancak entity seviyesinde `email` ve `nationalId` unique olarak tanimli.

Risk:

- Soft-deleted employee ile ayni email/nationalId tekrar create edilmeye calisilirsa service duplicate bulmayabilir.
- DB unique constraint yine de kaydi reddedebilir.

Bu durum partial unique index veya restore/reuse stratejisi netlesmeden sorun cikarabilir.

### 9.12 `isActive` alani kullanilmiyor

`CreateEmployeeRequestDto` icinde `isActive` var, frontend restore de `isActive: true` gonderiyor. Ancak Employee entity'sinde `isActive` yok ve service bu alani okumuyor.

### 9.13 PATCH contacts akisi riskli

`PATCH /employee/{id}` icin `contacts` map'ten `List<EmployeeContactDto>` olarak cast ediliyor. JSON body'den gelen nested list elemanlari pratikte `LinkedHashMap` olarak deserialize edilebilecegi icin bu akis runtime cast/mapping hatasi uretebilir.

Contacts icin daha guvenli yol:

- PUT DTO kullanmak,
- veya patch body'yi ObjectMapper ile typed DTO listesine convert etmek.

### 9.14 Contacts update replace-only

Update/patch contacts geldigi anda mevcut contact listesi tamamen temizlenip yeni liste ekleniyor.

Su an yok:

- Tek contact ekleme endpointi.
- Tek contact update endpointi.
- Tek contact delete endpointi.
- Contact id bazli merge.

### 9.15 Deleted endpoints audit amacli ama yetki modeli eksik

Deleted employees endpointleri admin/audit yorumu ile yazilmis. Ancak admin permission veya tenant permission kontrolu yok.

Beklenen netlestirme:

- Sadece tenant admin mi gorecek?
- Tenant owner mi gorecek?
- Tenant root mu gorecek?
- Deleted employee listesi tenant bazli mi olacak?

### 9.16 Frontend restore butonu yanlis beklenti olusturuyor

UI restore butonu kullaniciya calisir gibi gorunuyor ama backend bunu desteklemiyor. Bu buton su haliyle 404 veya etkisiz patch sonucuna gider.

### 9.17 Frontend generated type uyumsuzluklari var

Generated OpenAPI TypeScript tiplerinde bazi UUID alanlari `number` olarak gorunuyor:

- `EmployeeResponseDto.id`
- `EmployeeListResponseDto.id`
- `ManagerDto.id`
- `CreateEmployeeRequestDto.managerId`

Backend bu alanlari UUID bekliyor. Frontend bazi yerlerde `String(id)` ve `managerId as unknown as number` gibi cast'lerle bunu asiyor. Bu type safety'yi bozuyor.

### 9.18 Frontend enum seti backend ile tam uyumlu degil

Backend `EmploymentStatus` icinde `DELETED` var. Generated frontend enum'larinda su an `DELETED` yok.

Normal listede deleted kayitlar donmedigi icin her zaman gorunmeyebilir, ama deleted endpointleri veya regenerate sonrasi type mismatch olusabilir.

### 9.19 Frontend contact formu emergency contact detaylarini girmiyor

Backend contact DTO'sunda `contactPersonName` ve `relationship` var. Frontend formu mevcut kayittan bu alanlari koruyabiliyor gibi map ediyor, ancak UI'da bu alanlari duzenleme/girme input'u yok.

### 9.20 Frontend delete confirm yok

Employee listesinde delete icon'una basinca direkt delete mutation calisiyor. Kullanici onayi veya geri alma yok.

### 9.21 Bulk operasyon UI'i yok

Backend bulk patch/delete endpointleri var. Tenant frontend hook tarafinda deleteMany var, fakat UI'da bulk select/delete/patch akisi yok.

### 9.22 Mobil employee feature henuz yapilmamis

Mobilde generated API client var ama gercek employee liste/detail/create/edit ekranlari yok.

### 9.23 Test kapsami sinirli

Mevcut `EmployeeServiceTest` service seviyesinde su alanlari kapsiyor:

- list/filter happy path,
- findById/findAllById,
- create happy path ve duplicate/manager-not-found,
- update alanlari ve manager self-check,
- patchMany,
- delete/deleteMany,
- search,
- deleted list.

Eksik testler:

- Controller validation testleri.
- Permission denied testleri.
- Search/deleted endpointleri icin permission izolasyonu.
- Keycloak rollback edge case'leri.
- Keycloak email/status sync beklentisi.
- Restore akisi.
- Manager cross-tenant ve cycle senaryolari.
- PATCH contacts JSON deserialize senaryosu.
- Frontend component/integration testleri.
- Mobil feature testleri.

## 10) Oncelikli Iyilestirme Onerileri

1. Restore icin net backend endpointi ekle: `POST /employee/{id}/restore` veya `PATCH /employee/{id}/restore`.
2. `searchEmployees`, `getDeletedEmployees`, `getDeletedEmployeesPaginated` icin permission ve tenant izolasyonunu `findWithFilters` ile ayni seviyeye getir.
3. Generic controller request body'lerine `@Valid` ekle.
4. Soft delete ve status degisikliklerinde Keycloak hesabi icin karar ver: disable, delete, session revoke veya hicbir sey yapmama politikasini dokumante et.
5. Email update icin Keycloak/User service sync akisi ekle ya da email update'i kapat.
6. Manager atamasinda current tenant ve permission kontrolu ekle.
7. Manager cycle detection ekle.
8. Soft-deleted kayitlar icin unique stratejisini belirle: partial unique index, restore-first akisi veya deleted kayitlarda unique alanlari mask'leme.
9. PATCH contacts icin typed conversion veya ayri contact endpointleri ekle.
10. Frontend generated OpenAPI tiplerini UUID icin dogru uretecek sekilde duzelt ve castsiz kullan.
11. Frontend restore butonunu backend tamamlanana kadar kaldir ya da disabled hale getir.
12. Contact formuna emergency contact name/relationship input'larini ekle.
13. Delete icin confirmation ekle.
14. Mobil employee ekranlarini generated client uzerinden gercek liste/detail akisi ile implemente et.

## 11) Kabul Kriterleri

Employee modulu "tamamlandi" denmeden once en az su senaryolar gecmeli:

1. Tenant A kullanicisi Tenant B employee kaydini listede, search'te ve detail'da goremez.
2. READ_EMPLOYEE izni olmayan kullanici employee listesinde bos sonuc alir veya 403 politikasi neyse ona gore engellenir.
3. `GET /employee/search` permission filtresiyle calisir.
4. `GET /employee/deleted/paginated` sadece yetkili actor'lere veri dondurur.
5. Create request validation eksik username/tempPassword/firstName/lastName/email/hireDate icin 400 doner.
6. Duplicate email/nationalId aktif kayitlarda 409 doner.
7. Soft-deleted employee restore edilebilir ve normal listede tekrar gorunur.
8. Delete sonrasi Keycloak/access davranisi beklenen politikaya gore test edilir.
9. Email update Keycloak ile senkronize olur veya endpoint email degisikligini reddeder.
10. Manager baska tenant'tan atanamaz.
11. Manager cycle olusturulamaz.
12. Contacts create/update/delete senaryolari JSON request ile stabil calisir.
13. Frontend restore butonu gercek backend restore akisini kullanir.
14. Frontend UUID tipleri castsiz calisir.
15. Mobil employee ekranlari en az liste ve detay seviyesinde gercek veriyi kullanir.

## 12) Sonuc

Employee modulu temel CRUD ve tenant web deneyimi acisindan kullanilabilir bir iskelete sahip. En guclu taraflari generic resource altyapisina oturmasi, Keycloak user create entegrasyonu, soft delete ve React Query tabanli frontend akisi.

Ancak permission izolasyonu bazi ozel endpointlerde eksik, restore UI/backend uyumsuz, DTO validation ve Keycloak senkronizasyonu tamamlanmamis durumda. Modulun production'a daha yakin hale gelmesi icin once authorization/restore/validation/identity-sync konulari kapatilmali.
