package org.zerp.resource.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.dto.feign.resource.StockMovementFeignRequest;
import org.zerp.common.entity.resource.StockMovement;
import org.zerp.common.entity.resource.StockMovementDirection;
import org.zerp.common.entity.resource.StockMovementType;
import org.zerp.common.entity.resource.StockResource;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.resource.dto.stockmovement.StockMovementCreateDTO;
import org.zerp.resource.dto.stockmovement.StockMovementDTO;
import org.zerp.resource.dto.stockmovement.StockMovementTimelineBucketDTO;
import org.zerp.resource.dto.stockmovement.StockMovementTimelineDTO;
import org.zerp.resource.mapper.StockMovementMapper;
import org.zerp.resource.permission.StockMovementPermissionEvaluator;
import org.zerp.resource.permission.StockResourcePermissionEvaluator;
import org.zerp.resource.repository.StockMovementRepository;
import org.zerp.resource.repository.StockResourceRepository;
import org.zerp.resource.repository.projection.StockMovementSummaryProjection;
import org.zerp.resource.repository.projection.StockMovementTimelineBucketProjection;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class StockMovementService implements
        IResourceService<StockMovementDTO, StockMovementDTO, StockMovementCreateDTO, StockMovementCreateDTO, UUID> {
    private static final LocalDateTime DEFAULT_MOVEMENT_WINDOW_START = LocalDateTime.of(1970, 1, 1, 0, 0);
    private static final Set<StockMovementType> MANUAL_ALLOWED_TYPES =
            Set.of(StockMovementType.WASTE, StockMovementType.RETURN, StockMovementType.SALE);

    private final StockMovementPermissionEvaluator permissionEvaluator;
    private final StockResourcePermissionEvaluator stockResourcePermissionEvaluator;
    private final StockMovementRepository repository;
    private final StockResourceRepository stockResourceRepository;
    private final StockMovementMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final FilterRefiner filterRefiner;

    @Override
    @Transactional(readOnly = true)
    public Page<StockMovementDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.trace("Finding StockMovements with filters: {}", filters);
        UUID userId = currentUserIdResolver.resolve();
        Specification<StockMovement> spec = filterRefiner.refinedOrBadRequest(filters, StockMovement.class);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<StockMovementDTO> results = repository.findAll(spec, pageable).map(mapper::toDTO);
        log.debug("Found {} StockMovements", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockMovementDTO> findAllById(List<UUID> uuids) {
        UUID userId = currentUserIdResolver.resolve();
        List<StockMovementDTO> results = new ArrayList<>();
        for (UUID id : uuids) {
            repository.findById(id).ifPresent(movement -> {
                if (permissionEvaluator.canRead(userId, movement)) {
                    results.add(mapper.toDTO(movement));
                }
            });
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public StockMovementDTO findById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        StockMovement movement = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "StockMovement not found"));
        if (!permissionEvaluator.canRead(userId, movement)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read StockMovement");
        }
        return mapper.toDTO(movement);
    }

    /**
     * Creates a stock movement ledger record. Real stock is NOT changed by movements.
     */
    @Override
    @Transactional
    public StockMovementDTO create(StockMovementCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        StockResource stockResource = stockResourceRepository.findById(data.getStockResourceId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "StockResource not found"));
        UUID tenantId = stockResource.getTenantId();

        if (!permissionEvaluator.canCreate(userId, stockResource)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create StockMovement");
        }

        validateManualMovement(data.getType());

        PermissionAction requiredAction = resolveManualCreatePermissionAction(data.getType());
        if (!permissionEvaluator.canCreateWithAction(
                userId,
                stockResource.getId(),
                stockResource.getShop().getId(),
                tenantId,
                requiredAction
        )) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create this movement type");
        }

        StockMovement movement = mapper.toEntity(data);
        movement.setStockResource(stockResource);
        movement.setTenantId(tenantId);
        movement.setDirection(resolveDirection(data.getType(), data.getDirection()));
        StockMovement saved = persistMovement(
                movement,
                stockResource,
                data.getType(),
                movement.getDirection(),
                normalizeQuantity(data.getQuantity())
        );
        log.info("Created StockMovement with id: {}, type: {}, quantity: {}", saved.getId(), data.getType(), data.getQuantity());
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public StockMovementDTO patch(UUID uuid, Map<String, Object> data) {
        UUID userId = currentUserIdResolver.resolve();
        StockMovement movement = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "StockMovement not found"));
        if (!permissionEvaluator.canPatch(userId, movement)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch StockMovement");
        }
        if (data.containsKey("notes")) movement.setNotes((String) data.get("notes"));
        StockMovement updated = repository.save(movement);
        return mapper.toDTO(updated);
    }

    @Override
    @Transactional
    public StockMovementDTO update(UUID uuid, StockMovementCreateDTO data) {
        return patch(uuid, Map.of("notes", data.getNotes() != null ? data.getNotes() : ""));
    }

    @Override
    @Transactional
    public List<UUID> patchMany(List<UUID> uuids, Map<String, Object> fields) {
        List<UUID> updated = new ArrayList<>();
        for (UUID uuid : uuids) {
            try {
                patch(uuid, fields);
                updated.add(uuid);
            } catch (ResponseStatusException e) {
                log.debug("Failed to patch StockMovement with id: {}", uuid, e);
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        StockMovement movement = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "StockMovement not found"));
        if (!permissionEvaluator.canDelete(userId, movement)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete StockMovement");
        }
        repository.delete(movement);
        log.info("Deleted StockMovement with id: {}", uuid);
    }

    @Override
    @Transactional
    public List<UUID> deleteMany(List<UUID> uuids) {
        List<UUID> deleted = new ArrayList<>();
        for (UUID uuid : uuids) {
            try {
                deleteById(uuid);
                deleted.add(uuid);
            } catch (ResponseStatusException e) {
                log.debug("Failed to delete StockMovement with id: {}", uuid, e);
            }
        }
        return deleted;
    }

    /**
     * Internal entry point for inter-service stock movement creation (e.g. from sale service via Feign).
     * Bypasses user permission checks; tenantId is taken from the request.
     */
    @Transactional
    public void createInternal(StockMovementFeignRequest req) {
        StockResource resource = stockResourceRepository.findById(req.getStockResourceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "StockResource not found: " + req.getStockResourceId()));
        if (req.getTenantId() == null || !req.getTenantId().equals(resource.getTenantId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "StockResource and request tenant mismatch");
        }
        if (req.getType() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Movement type is required");
        }

        createInternalLedgerOnly(
                req.getTenantId(),
                resource,
                req.getType(),
                req.getDirection(),
                req.getQuantity(),
                req.getReferenceType(),
                req.getReferenceId(),
                req.getNotes()
        );

        log.info("Internal StockMovement created: resource={}, type={}, qty={}", resource.getId(), req.getType(), req.getQuantity());
    }

    /**
     * Creates a movement record from internal operation flows and keeps ledger snapshots consistent.
     */
    @Transactional
    public StockMovement createInternalLedgerOnly(
            UUID tenantId,
            StockResource stockResource,
            StockMovementType type,
            StockMovementDirection direction,
            BigDecimal quantity,
            String referenceType,
            UUID referenceId,
            String notes
    ) {
        if (stockResource == null || type == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "StockResource and type are required");
        }
        if (tenantId == null || !tenantId.equals(stockResource.getTenantId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "StockResource and tenant mismatch");
        }

        StockMovement movement = new StockMovement();
        movement.setStockResource(stockResource);
        movement.setType(type);
        movement.setDirection(resolveDirection(type, direction));
        movement.setQuantity(normalizeQuantity(quantity));
        movement.setReferenceType(referenceType);
        movement.setReferenceId(referenceId);
        movement.setNotes(notes);
        movement.setTenantId(tenantId);

        return persistMovement(movement, stockResource, type, movement.getDirection(), movement.getQuantity());
    }

    @Transactional(readOnly = true)
    public StockMovementTimelineDTO getTimeline(
            UUID shopId,
            UUID stockResourceId,
            LocalDateTime from,
            LocalDateTime to,
            String bucket
    ) {
        validateTimelineRequest(shopId, from, to);

        UUID userId = currentUserIdResolver.resolve();
        TimelineBucket timelineBucket = TimelineBucket.fromInput(bucket);
        List<StockResource> scopedResources = resolveScopedResources(userId, shopId, stockResourceId);

        StockMovementTimelineDTO dto = new StockMovementTimelineDTO();
        dto.setFrom(from);
        dto.setTo(to);
        dto.setBucket(timelineBucket.name());

        if (scopedResources.isEmpty()) {
            dto.setBaselineQuantity(BigDecimal.ZERO);
            dto.setBuckets(List.of());
            return dto;
        }

        List<UUID> resourceIds = scopedResources.stream().map(StockResource::getId).toList();
        BigDecimal baselineQuantity = resolveBaselineQuantity(scopedResources, from);
        List<StockMovementTimelineBucketProjection> aggregate = repository.aggregateTimelineByBucket(
                resourceIds, from, to, timelineBucket.bucketKey
        );
        Map<LocalDateTime, StockMovementTimelineBucketProjection> aggregateByStart = new HashMap<>(aggregate.size());
        for (StockMovementTimelineBucketProjection row : aggregate) {
            aggregateByStart.put(row.getBucketStart(), row);
        }

        List<StockMovementTimelineBucketDTO> buckets = new ArrayList<>();
        BigDecimal running = baselineQuantity;
        for (LocalDateTime bucketStart = timelineBucket.floor(from); bucketStart.isBefore(to); bucketStart = timelineBucket.next(bucketStart)) {
            StockMovementTimelineBucketProjection row = aggregateByStart.get(bucketStart);
            StockMovementTimelineBucketDTO bucketDto = new StockMovementTimelineBucketDTO();
            bucketDto.setBucketStart(bucketStart);
            bucketDto.setBucketEnd(timelineBucket.next(bucketStart));
            bucketDto.setMovementDelta(row == null ? BigDecimal.ZERO : nullSafe(row.getMovementDelta()));
            bucketDto.setPreviousQuantity(running);
            BigDecimal expectedDelta = row == null ? BigDecimal.ZERO : nullSafe(row.getExpectedDelta());
            running = running.add(expectedDelta);
            bucketDto.setCurrentQuantity(running);
            bucketDto.setMovementCount(row == null || row.getMovementCount() == null ? 0L : row.getMovementCount());
            buckets.add(bucketDto);
        }

        dto.setBaselineQuantity(baselineQuantity);
        dto.setBuckets(buckets);
        return dto;
    }

    @Transactional(readOnly = true)
    public List<StockMovementDTO> getDrillDownMovements(
            UUID shopId,
            UUID stockResourceId,
            LocalDateTime from,
            LocalDateTime to,
            Integer limit
    ) {
        validateTimelineRequest(shopId, from, to);
        UUID userId = currentUserIdResolver.resolve();
        List<StockResource> scopedResources = resolveScopedResources(userId, shopId, stockResourceId);
        if (scopedResources.isEmpty()) {
            return List.of();
        }

        int safeLimit = limit == null ? 250 : Math.max(1, Math.min(limit, 1000));
        List<UUID> resourceIds = scopedResources.stream().map(StockResource::getId).toList();

        return repository.findDrillDownMovements(resourceIds, from, to, PageRequest.of(0, safeLimit))
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    private StockMovement persistMovement(
            StockMovement movement,
            StockResource stockResource,
            StockMovementType type,
            StockMovementDirection direction,
            BigDecimal quantity
    ) {
        BigDecimal expectedBefore = resolveExpectedQuantity(stockResource, LocalDateTime.now());
        BigDecimal expectedAfter = calculateNewQuantity(expectedBefore, type, direction, quantity);

        movement.setType(type);
        movement.setDirection(direction);
        movement.setQuantity(quantity);
        movement.setPreviousQuantity(expectedBefore);
        movement.setNewQuantity(expectedAfter);
        return repository.save(movement);
    }

    private BigDecimal resolveExpectedQuantity(StockResource stockResource, LocalDateTime at) {
        StockMovementSummaryProjection summary = repository.summarizeForResource(
                stockResource.getId(),
                resolveMovementWindowStart(stockResource.getLastCountedAt()),
                at
        );
        BigDecimal netDelta = summary == null || summary.getNetDelta() == null ? BigDecimal.ZERO : summary.getNetDelta();
        return nullSafe(stockResource.getQuantity()).add(netDelta);
    }

    private LocalDateTime resolveMovementWindowStart(LocalDateTime lastCountedAt) {
        return lastCountedAt == null ? DEFAULT_MOVEMENT_WINDOW_START : lastCountedAt;
    }

    private BigDecimal nullSafe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private BigDecimal calculateNewQuantity(
            BigDecimal current,
            StockMovementType type,
            StockMovementDirection direction,
            BigDecimal quantity
    ) {
        return current.add(resolveSignedDelta(type, direction, quantity));
    }

    private BigDecimal resolveSignedDelta(
            StockMovementType type,
            StockMovementDirection direction,
            BigDecimal quantity
    ) {
        if (type == StockMovementType.ADJUSTMENT) {
            return (direction == StockMovementDirection.OUT ? quantity.negate() : quantity);
        }

        return switch (type) {
            case PURCHASE, RETURN -> quantity;
            case SALE, WASTE, TRANSFER -> quantity.negate();
            default -> quantity;
        };
    }

    private StockMovementDirection resolveDirection(StockMovementType type, StockMovementDirection requestedDirection) {
        if (type == StockMovementType.ADJUSTMENT) {
            return requestedDirection != null ? requestedDirection : StockMovementDirection.IN;
        }
        return switch (type) {
            case PURCHASE, RETURN -> StockMovementDirection.IN;
            case SALE, WASTE, TRANSFER -> StockMovementDirection.OUT;
            default -> requestedDirection != null ? requestedDirection : StockMovementDirection.IN;
        };
    }

    private void validateManualMovement(StockMovementType type) {
        if (type == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Movement type is required");
        }
        if (!MANUAL_ALLOWED_TYPES.contains(type)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This movement type must be created through its dedicated operation flow"
            );
        }
    }

    private PermissionAction resolveManualCreatePermissionAction(StockMovementType type) {
        return switch (type) {
            case WASTE -> PermissionAction.CREATE_STOCK_WASTE;
            case RETURN -> PermissionAction.CREATE_STOCK_RETURN;
            default -> PermissionAction.CREATE_STOCK_MOVEMENT;
        };
    }

    private BigDecimal normalizeQuantity(BigDecimal quantity) {
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "quantity must be greater than zero");
        }
        return quantity.setScale(6, RoundingMode.HALF_UP);
    }

    private void validateTimelineRequest(UUID shopId, LocalDateTime from, LocalDateTime to) {
        if (shopId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "shopId is required");
        }
        if (from == null || to == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "from and to are required");
        }
        if (!from.isBefore(to)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "from must be before to");
        }
    }

    private List<StockResource> resolveScopedResources(UUID userId, UUID shopId, UUID stockResourceId) {
        Specification<StockResource> scope = stockResourcePermissionEvaluator.filterRead(userId)
                .and((root, _, cb) -> cb.equal(root.get("shop").get("id"), shopId));

        if (stockResourceId != null) {
            scope = scope.and((root, _, cb) -> cb.equal(root.get("id"), stockResourceId));
        }

        return stockResourceRepository.findAll(scope);
    }

    private BigDecimal resolveBaselineQuantity(List<StockResource> resources, LocalDateTime from) {
        BigDecimal total = BigDecimal.ZERO;
        for (StockResource resource : resources) {
            StockMovementSummaryProjection summary = repository.summarizeForResource(
                    resource.getId(),
                    resolveMovementWindowStart(resource.getLastCountedAt()),
                    from
            );
            BigDecimal netDelta = summary == null || summary.getNetDelta() == null ? BigDecimal.ZERO : summary.getNetDelta();
            BigDecimal baselineForResource = nullSafe(resource.getQuantity()).add(netDelta);
            total = total.add(baselineForResource);
        }
        return total;
    }

    private enum TimelineBucket {
        DAY("day"),
        WEEK("week"),
        MONTH("month");

        private final String bucketKey;

        TimelineBucket(String bucketKey) {
            this.bucketKey = bucketKey;
        }

        static TimelineBucket fromInput(String input) {
            if (input == null || input.isBlank()) {
                return WEEK;
            }
            try {
                return TimelineBucket.valueOf(input.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid bucket. Use DAY, WEEK, or MONTH");
            }
        }

        LocalDateTime next(LocalDateTime start) {
            return switch (this) {
                case DAY -> start.plusDays(1);
                case WEEK -> start.plusWeeks(1);
                case MONTH -> start.plusMonths(1);
            };
        }

        LocalDateTime floor(LocalDateTime value) {
            return switch (this) {
                case DAY -> value.toLocalDate().atStartOfDay();
                case WEEK -> value.toLocalDate()
                        .with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY))
                        .atStartOfDay();
                case MONTH -> value.toLocalDate().withDayOfMonth(1).atStartOfDay();
            };
        }
    }
}
