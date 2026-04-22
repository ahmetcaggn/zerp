# Socket Service Report

## Ozet

`socket_service/` modulu yari domain-spesifik bir websocket taslagiyken, Kafka ile tetiklenen ve Redis uzerinde connection/subscription registry tutan genel amacli bir socket servisine donusturuldu.

Yeni tasarimda:

- WebSocket/STOMP baglantilari Redis'e kaydedilir.
- Topic subscription bilgileri Redis'te tutulur.
- Kafka'dan gelen event'ler aktif local subscriber varsa ilgili topic'e push edilir.
- Redis key-expiration event yaklasimi tamamen kaldirildi.
- Domain'e ozel `presence/privacy/friends` mantigi temizlendi.

## Mimari

### 1. Websocket katmani

- Endpoint: `app.socket.endpoint` varsayilan olarak `/ws`
- Client message prefix: `/app`
- Broker prefix: `/topic`, `/queue`
- Heartbeat endpoint: `/app/system/heartbeat`

Handshake sirasinda:

- `x-user-id` zorunlu kimlik basligi olarak okunur.
- `x-tenant-id` opsiyonel metadata olarak tasinir.
- `remoteAddress` ve `userAgent` session metadata'ya yazilir.

### 2. Redis registry katmani

Redis artik event source degil, registry ve index katmani olarak kullaniliyor.

Tutulan ana bilgiler:

- Session metadata
- User -> session index
- Node -> session index
- Destination -> session index
- Session -> subscriptionId/destination index
- Node heartbeat

### 3. Kafka dispatch katmani

Kafka consumer, gelen JSON event'i `SocketTopicEvent` modeline parse eder.

Ardindan:

1. Destination validation yapilir.
2. Bu node uzerinde ilgili topic icin local subscriber var mi kontrol edilir.
3. Varsa `SimpMessagingTemplate` ile `/topic/...` destination'ina publish edilir.

Bu tasarim, her node'un kendi consumer group id'si ile Kafka event'lerini alip sadece kendi local websocket client'larina publish etmesine uygundur.

## Redis key stratejisi

`RedisKeyFactory` ile butun key yapisi merkezilestirildi.

Key prefix:

- `ws:{namespace}:...`

Dynamic segmentler Base64 URL-safe encode edilerek tutulur. Bu sayede:

- `/topic/orders/42` gibi destination'lar key kirmaz
- `userId`, `sessionId`, `nodeId` icinde ozel karakter olsa bile key formati bozulmaz
- key semasi tek bir sinifta tutuldugu icin ileride versionlama kolaylasir

Baslica key tipleri:

- `ws:{namespace}:session:{encodedSessionId}`
- `ws:{namespace}:session:{encodedSessionId}:subscriptions`
- `ws:{namespace}:user:{encodedUserId}:sessions`
- `ws:{namespace}:destination:{encodedDestination}:sessions`
- `ws:{namespace}:node:{encodedNodeId}:sessions`
- `ws:{namespace}:node:{encodedNodeId}:destination:{encodedDestination}:sessions`
- `ws:{namespace}:node:{encodedNodeId}:heartbeat`
- `ws:{namespace}:nodes`

## Silinen eski parcalar

Asagidaki eski template parcalari kaldirildi:

- `PresenceService`
- `Notification`
- `PrivacyEventSubscriber`
- `RedisKeyExpirationListener`
- Presence controller ve ona bagli exception/template kalintilari
- `org.pomocra.*` package yapisi

Bu dosyalar artik genel template hedefiyle uyusmuyordu cunku:

- domain bilgisi iceriyordu
- Redis keyspace event mantigina dayaniyordu
- yorum satirina alinmis yarim is akislarina sahipti

## Eklenen ana dosyalar

- `org.zerp.socket_service.config.SocketServiceProperties`
- `org.zerp.socket_service.config.WebSocketConfig`
- `org.zerp.socket_service.config.KafkaConsumerConfig`
- `org.zerp.socket_service.interceptor.SocketHandshakeInterceptor`
- `org.zerp.socket_service.interceptor.StompPrincipalInterceptor`
- `org.zerp.socket_service.interceptor.InboundRateLimitInterceptor`
- `org.zerp.socket_service.listener.StompSessionEventListener`
- `org.zerp.socket_service.listener.KafkaSocketEventConsumer`
- `org.zerp.socket_service.service.RedisKeyFactory`
- `org.zerp.socket_service.service.RedisSocketRegistry`
- `org.zerp.socket_service.service.SocketNotificationDispatcher`
- `org.zerp.socket_service.service.SocketMaintenanceService`
- `org.zerp.socket_service.controller.SocketHeartbeatController`
- `org.zerp.socket_service.controller.SocketRegistryController`

## Konfig ayarlari

`src/main/resources/application.properties` icinde asagidaki temel ayarlar eklendi:

- `app.socket.namespace`
- `app.socket.instance-id`
- `app.socket.allowed-origin-patterns`
- `app.socket.session-timeout-seconds`
- `app.socket.node-heartbeat-interval-seconds`
- `app.socket.node-heartbeat-ttl-seconds`
- `app.socket.cleanup-interval-seconds`
- `app.socket.maintenance-enabled`
- `app.socket.kafka.topic`
- `app.socket.kafka.consumer-group-prefix`
- `app.socket.rate-limit.*`

## Kafka event payload ornegi

```json
{
  "eventId": "crm-ticket-42-updated",
  "destination": "/topic/crm/tickets/42",
  "payload": {
    "ticketId": 42,
    "status": "IN_PROGRESS",
    "updatedBy": "employee-17"
  },
  "headers": {
    "eventType": "ticket.updated"
  },
  "tenantId": "tenant-a",
  "sourceService": "crm-service",
  "occurredAt": "2026-04-16T00:00:00Z"
}
```

## Template'i gelistirmek icin sonraki mantikli adimlar

### 1. Auth gerceklemestirme

Su an handshake kimligi header bazli. Gercek sistemde:

- gateway tarafindan inject edilen claim'ler
- JWT parsing
- tenant/role validation

eklenebilir.

### 2. Cluster routing iyilestirme

Su an her node Kafka event'ini alip kendi local subscriber'ina publish edecek sekilde tasarlandi.

Gerekirse:

- event filtering
- tenant-aware destination routing
- user queue dispatch

kolayca eklenebilir.

### 3. Admin / observability

Eklenebilecekler:

- destination bazli metrics
- online session sayilari
- node bazli subscriber dagilimi
- dead node cleanup metric ve alarms

## Dogrulama

Calistirilan komut:

```bash
mvn -f socket_service/pom.xml test
```

Test basarili.

Notlar:

- Bu ortamda JDK 21 oldugu icin `socket_service/pom.xml` icinde module bazli `release 21` override eklendi.
- Test loglarinda sandbox kaynakli `NetworkInterface` ve Spring test ortaminda `Mockito self-attaching` uyarilari gorulebilir.
- Redis/Kafka yokken servis fail-safe olacak sekilde registry metodlari korunmustur; ancak gercek entegrasyon icin Redis ve Kafka endpoint'lerinin ayarlanmasi gerekir.
