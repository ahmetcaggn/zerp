# Zerp Admin Prometheus Metrics Context

## Amaç

`zerp-admin` dashboard içinde Docker metriklerini Grafana iframe yerine doğrudan Prometheus verisiyle göstermek.

Yeni akış:

```text
zerp-admin
  -> client gateway /api
    -> user service
      -> permission check
      -> metricId -> PromQL map
      -> Prometheus /api/v1/query_range
      -> response
  -> frontend chart render
```

## Neden iframe kaldırıldı?

Grafana iframe yaklaşımında tarayıcı güvenlik ve embedding problemleri yaşandı.

Örnek hata:

```text
Firefox bu sayfayı başka bir site gömdüyse localhost:2000 güvenliğiniz için izin vermez
```

Bu tip sorunlar genelde Grafana tarafındaki `X-Frame-Options`, `Content-Security-Policy`, `allow_embedding`, cookie ve domain ayarlarından kaynaklanır.

Yeni yapıda iframe yoktur. Frontend, backend üzerinden Prometheus datasını alır ve kendi chart UI'ını render eder.

## Backend Yapısı

Metrikler `user` servisi üzerinden okunur.

Endpoint:

```http
GET /user/admin/metrics/query-range
```

Query params:

```text
metricId=docker.memoryUsage
start=1780769371
end=1780770271
step=15s
```

Örnek request:

```http
GET /user/admin/metrics/query-range?metricId=docker.memoryUsage&start=1780769371&end=1780770271&step=15s
```

Frontend bunu gateway üzerinden çağırır:

```text
/api/user/admin/metrics/query-range
```

İlgili backend dosyaları:

```text
zerp-backend/user/src/main/java/org/zerp/user/controller/SystemMetricsController.java
zerp-backend/user/src/main/java/org/zerp/user/service/SystemMetricsService.java
zerp-backend/user/src/main/java/org/zerp/user/config/PrometheusProperties.java
zerp-backend/user/src/main/java/org/zerp/user/dto/metrics/MetricQueryRangeRequest.java
zerp-backend/user/src/main/java/org/zerp/user/permission/SystemMetricsPermissionEvaluator.java
```

## Permission

Yeni permission action:

```java
READ_SYSTEM_METRICS(TENANT_ROOT)
```

Dosya:

```text
zerp-backend/common/src/main/java/org/zerp/common/permission/entity/PermissionAction.java
```

Permission evaluator:

```text
zerp-backend/user/src/main/java/org/zerp/user/permission/SystemMetricsPermissionEvaluator.java
```

Kontrol mantığı:

```text
Kullanıcıda TENANT_ROOT seviyesinde READ_SYSTEM_METRICS varsa izin ver
veya TENANT_ROOT seviyesinde ADMIN varsa izin ver
```

Metrikleri görecek kullanıcıya verilmesi gereken permission:

```text
targetType: TENANT_ROOT
action: READ_SYSTEM_METRICS
```

## Backend Metric ID -> PromQL Map

Frontend raw PromQL göndermez. Sadece `metricId` gönderir.

PromQL map backend içinde tutulur:

```text
zerp-backend/user/src/main/java/org/zerp/user/service/SystemMetricsService.java
```

Mevcut metric ID'ler:

```text
docker.cpu
docker.memoryUsage
docker.memoryCached
docker.ioReads
docker.ioWrites
docker.networkReceived
docker.networkSent
docker.containersInfo
```

Örnek mapping:

```java
"docker.memoryUsage", "sum(container_memory_usage_bytes{name!=\"\"})"
```

Bu yapı sayesinde frontend'den keyfi PromQL çalıştırılamaz. Metrik sorguları backend'in izin verdiği ID listesiyle sınırlıdır.

## Prometheus Config

Prometheus domain/backend bağlantısı sadece backend tarafında env ile yönetilir.

Docker ortamı için örnek:

```env
PROMETHEUS_BASE_URL=http://prometheus:9090
PROMETHEUS_MAX_RANGE_SECONDS=604800
```

Local ortam için örnek:

```env
PROMETHEUS_BASE_URL=http://localhost:9095
PROMETHEUS_MAX_RANGE_SECONDS=604800
```

İlgili config property:

```properties
app.prometheus.base-url=${PROMETHEUS_BASE_URL:http://prometheus:9090}
app.prometheus.max-range-seconds=${PROMETHEUS_MAX_RANGE_SECONDS:604800}
```

Frontend tarafında ayrıca metrik API path environment'ı yoktur. Backend API path'i frontend içinde sabittir:

```ts
const SYSTEM_METRICS_API_PATH = '/user/admin/metrics'
```

Dosya:

```text
zerp-frontend/zerp-admin/src/modules/admin/api/prometheus-client.ts
```

## Frontend Yapısı

Admin dashboard'da iki tab vardır:

```text
Docker
Service Metrics
```

Docker tab gerçek Prometheus datasını çeker.

Service Metrics tab şu an placeholder card'larla doludur. Sonradan service metric'leri eklenebilir.

Ana frontend dosyaları:

```text
zerp-frontend/zerp-admin/src/modules/admin/ui/admin-dashboard.tsx
zerp-frontend/zerp-admin/src/modules/admin/ui/prometheus-metric-card.tsx
zerp-frontend/zerp-admin/src/modules/admin/hooks/use-prometheus-metric.ts
zerp-frontend/zerp-admin/src/modules/admin/api/prometheus-client.ts
zerp-frontend/zerp-admin/src/modules/admin/types/prometheus.ts
```

Frontend akışı:

```text
AdminDashboard
  -> PrometheusMetricCard
    -> usePrometheusMetric
      -> prometheusClient.queryRange
        -> GET /user/admin/metrics/query-range
```

## Frontend Permission Davranışı

Docker tab açıldığında frontend önce current user permission bilgisini kullanır.

Yetki varsa:

```text
Docker metric card'ları backend'e query atar.
```

Yetki yoksa:

```text
Backend'e metric query atılmaz.
Kullanıcıya metrikleri görüntüleme yetkisi olmadığı gösterilir.
```

Backend yine asıl güvenlik katmanıdır. Frontend kontrolü sadece gereksiz request atmamak ve daha temiz UI göstermek içindir.

## Önemli Fix'ler

### PromQL URI Template Hatası

PromQL içinde şu ifade vardır:

```promql
{name!=""}
```

İlk implementasyonda Spring `UriBuilder` bunu URI template variable sanıp şu hatayı döndü:

```text
Not enough variable values available to expand 'name!=""'
```

Çözüm:

```java
.uri(
    "/api/v1/query_range?query={query}&start={start}&end={end}&step={step}",
    query,
    request.start(),
    request.end(),
    request.step()
)
```

Bu şekilde PromQL query param olarak doğru encode edilir.

### Jackson 3 JsonNode Hatası

Alınan hata:

```text
Cannot construct instance of com.fasterxml.jackson.databind.JsonNode
```

Sebep:

```text
Spring Boot 4, HTTP converter tarafında Jackson 3 namespace'i olan tools.jackson.* kullanır.
Endpoint ise com.fasterxml.jackson.databind.JsonNode dönüyordu.
```

Çözüm:

```java
import tools.jackson.databind.JsonNode;
```

Bu değişiklik şu dosyalarda yapılır:

```text
zerp-backend/user/src/main/java/org/zerp/user/controller/SystemMetricsController.java
zerp-backend/user/src/main/java/org/zerp/user/service/SystemMetricsService.java
```

## Build Notu

Proje Java 25 hedefler.

Temporary Java 25 environment:

```bash
export JAVA_HOME="/Users/ahmetcan/Library/Java/JavaVirtualMachines/corretto-25.0.2/Contents/Home"
```

Compile/package doğrulama:

```bash
JAVA_HOME="/Users/ahmetcan/Library/Java/JavaVirtualMachines/corretto-25.0.2/Contents/Home" mvn -q -pl user -am -DskipTests package
```

Testlerde Java 25 + Mockito self attach problemi görülebilir:

```text
Mockito is unable to load inline Byte Buddy mock maker
```

Bu metrik kodundan bağımsızdır. `common` test altyapısındaki Mockito inline mock maker/Byte Buddy agent attach davranışıyla ilgilidir.

## Kurulum Checklist

```text
1. Prometheus ayakta olmalı.
2. cAdvisor metricleri Prometheus'a düşmeli.
3. user service PROMETHEUS_BASE_URL env değerini görmeli.
4. user service yeniden build/restart edilmeli.
5. Kullanıcıda READ_SYSTEM_METRICS permission olmalı.
6. zerp-admin dashboard Docker tab açılmalı.
```

Prometheus UI'da elle test edilebilecek örnek query:

```promql
sum(container_memory_usage_bytes{name!=""})
```

Bu query sonuç dönüyorsa `zerp-admin` dashboard'daki `Memory Usage` kartı da veri gösterebilir.

## Yeni Metric Eklemek

Yeni bir metric eklemek için önerilen akış:

1. Backend `SystemMetricsService` içindeki `PROMQL_BY_METRIC_ID` map'ine yeni `metricId -> PromQL` eklenir.
2. Frontend `admin-dashboard.tsx` içindeki Docker veya Service Metrics card config listesine aynı `metricId` eklenir.
3. Metric unit tipi gerekiyorsa `prometheus.ts` içindeki unit union'ına eklenir.
4. Prometheus UI'da PromQL elle test edilir.
5. `zerp-admin` dashboard'da card'ın veri gösterdiği doğrulanır.

Örnek:

Backend:

```java
"docker.someMetric", "sum(rate(container_some_metric_total{name!=\"\"}[5m]))"
```

Frontend:

```ts
{
  id: 'docker.someMetric',
  title: 'Some Metric',
  caption: 'Metric description',
  color: '#20b486',
  unit: 'count',
}
```
