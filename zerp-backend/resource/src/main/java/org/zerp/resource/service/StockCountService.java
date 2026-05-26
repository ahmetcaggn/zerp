package org.zerp.resource.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.resource.StockCount;
import org.zerp.common.entity.resource.StockCountItem;
import org.zerp.common.entity.resource.StockCountStatus;
import org.zerp.common.entity.resource.StockReconciliationItem;
import org.zerp.common.entity.resource.StockResource;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.resource.dto.stockcount.StockCountCreateDTO;
import org.zerp.resource.dto.stockcount.StockCountDTO;
import org.zerp.resource.dto.stockcount.StockCountItemUpdateDTO;
import org.zerp.resource.dto.stockcount.StockCountUpdateDTO;
import org.zerp.resource.mapper.StockCountMapper;
import org.zerp.resource.permission.StockCountPermissionEvaluator;
import org.zerp.resource.repository.ShopRepository;
import org.zerp.resource.repository.StockCountRepository;
import org.zerp.resource.repository.StockMovementRepository;
import org.zerp.resource.repository.StockReconciliationItemRepository;
import org.zerp.resource.repository.StockResourceRepository;
import org.zerp.resource.repository.projection.StockMovementSummaryProjection;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class StockCountService implements
        IResourceService<StockCountDTO, StockCountDTO, StockCountCreateDTO, StockCountUpdateDTO, UUID> {
    private static final int QUANTITY_SCALE = 3;
    private static final LocalDateTime DEFAULT_MOVEMENT_WINDOW_START = LocalDateTime.of(1970, 1, 1, 0, 0);

    private final StockCountPermissionEvaluator permissionEvaluator;
    private final StockCountRepository repository;
    private final ShopRepository shopRepository;
    private final StockResourceRepository stockResourceRepository;
    private final StockMovementRepository stockMovementRepository;
    private final StockReconciliationItemRepository stockReconciliationItemRepository;
    private final StockCountMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final FilterRefiner filterRefiner;

    @Override
    @Transactional(readOnly = true)
    public Page<StockCountDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.trace("Finding StockCounts with filters: {}", filters);
        UUID userId = currentUserIdResolver.resolve();
        Specification<StockCount> spec = filterRefiner.refinedOrBadRequest(filters, StockCount.class);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<StockCountDTO> results = repository.findAll(spec, pageable).map(this::toDTOWithItems);
        log.debug("Found {} StockCounts", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockCountDTO> findAllById(List<UUID> uuids) {
        UUID userId = currentUserIdResolver.resolve();
        List<StockCountDTO> results = new ArrayList<>();
        for (UUID id : uuids) {
            repository.findById(id).ifPresent(stockCount -> {
                if (permissionEvaluator.canRead(userId, stockCount)) {
                    results.add(toDTOWithItems(stockCount));
                }
            });
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public StockCountDTO findById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        StockCount stockCount = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "StockCount not found"));
        if (!permissionEvaluator.canRead(userId, stockCount)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read StockCount");
        }
        return toDTOWithItems(stockCount);
    }

    /**
     * Creates a StockCount session and auto-populates items with theoretical quantities
     * from all StockResources in the shop.
     */
    @Override
    @Transactional
    public StockCountDTO create(StockCountCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        Shop shop = resolveShop(data.getShopId());
        UUID tenantId = shop.getTenantId();
        LocalDateTime snapshotAt = LocalDateTime.now();

        if (!permissionEvaluator.canCreate(userId, shop)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create StockCount");
        }

        StockCount stockCount = mapper.toEntity(data);
        stockCount.setShop(shop);
        stockCount.setTenantId(tenantId);
        stockCount.setStatus(StockCountStatus.DRAFT);

        stockResourceRepository.findAll(
                (root, _, _) -> root.get("shop").get("id").in(data.getShopId())
        ).forEach(stockResource -> {
            BigDecimal previousQuantity = nullSafe(stockResource.getQuantity());
            StockMovementSummaryProjection summary = stockMovementRepository.summarizeForResource(
                    stockResource.getId(),
                    resolveMovementWindowStart(stockResource.getLastCountedAt()),
                    snapshotAt
            );
            BigDecimal movementDelta = resolveNetDelta(summary);
            BigDecimal expectedQuantity = previousQuantity.add(movementDelta);

            StockCountItem item = new StockCountItem();
            item.setStockCount(stockCount);
            item.setStockResource(stockResource);
            item.setTheoreticalQuantity(expectedQuantity);
            item.setPreviousQuantity(previousQuantity);
            item.setMovementDelta(movementDelta);
            item.setExpectedQuantity(expectedQuantity);
            item.setTenantId(tenantId);
            stockCount.getItems().add(item);
        });

        StockCount saved = repository.save(stockCount);
        log.info("Created StockCount with id: {}, itemCount: {}", saved.getId(), saved.getItems().size());
        return toDTOWithItems(saved);
    }

    @Override
    @Transactional
    public StockCountDTO patch(UUID uuid, Map<String, Object> data) {
        UUID userId = currentUserIdResolver.resolve();
        StockCount stockCount = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "StockCount not found"));
        if (!permissionEvaluator.canPatch(userId, stockCount)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch StockCount");
        }
        if (stockCount.getStatus() == StockCountStatus.COMPLETED || stockCount.getStatus() == StockCountStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Completed or cancelled StockCount cannot be patched");
        }
        if (data.containsKey("status")) {
            StockCountStatus nextStatus = StockCountStatus.valueOf((String) data.get("status"));
            if (nextStatus == StockCountStatus.COMPLETED) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use approve endpoint to complete a stock count");
            }
            stockCount.setStatus(nextStatus);
        }
        if (data.containsKey("notes")) stockCount.setNotes((String) data.get("notes"));
        if (data.containsKey("countDate")) stockCount.setCountDate(LocalDate.parse((String) data.get("countDate")));
        StockCount updated = repository.save(stockCount);
        return toDTOWithItems(updated);
    }

    /**
     * Updates StockCount including actual quantities from physical count. If status is set to COMPLETED,
     * discrepancies are calculated and persisted.
     */
    @Override
    @Transactional
    public StockCountDTO update(UUID uuid, StockCountUpdateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        StockCount stockCount = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "StockCount not found"));
        if (!permissionEvaluator.canUpdate(userId, stockCount)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update StockCount");
        }
        if (stockCount.getStatus() == StockCountStatus.COMPLETED || stockCount.getStatus() == StockCountStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Completed or cancelled StockCount cannot be updated");
        }

        if (data.getStatus() == StockCountStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use approve endpoint to complete a stock count");
        }
        if (data.getStatus() != null) stockCount.setStatus(data.getStatus());
        if (data.getNotes() != null) stockCount.setNotes(data.getNotes());
        if (data.getCountDate() != null) stockCount.setCountDate(data.getCountDate());

        if (data.getItems() != null) {
            for (StockCountItemUpdateDTO itemUpdate : data.getItems()) {
                stockCount.getItems().stream()
                        .filter(item -> item.getId().equals(itemUpdate.getStockCountItemId()))
                        .findFirst()
                        .ifPresent(item -> {
                            BigDecimal normalizedActual = normalizeCountQuantity(itemUpdate.getActualQuantity());
                            item.setActualQuantity(normalizedActual);
                            item.setNotes(itemUpdate.getNotes());
                            if (normalizedActual != null) {
                                item.setCountedBy(userId);
                                item.setCountedAt(LocalDateTime.now());
                                item.setDiscrepancy(normalizedActual
                                        .subtract(resolveExpected(item))
                                        .setScale(QUANTITY_SCALE, RoundingMode.HALF_UP));
                            }
                        });
            }
        }

        StockCount updated = repository.save(stockCount);
        log.info("Updated StockCount with id: {}", uuid);
        return toDTOWithItems(updated);
    }

    @Transactional
    public StockCountDTO approve(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        StockCount stockCount = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "StockCount not found"));
        if (!permissionEvaluator.canApprove(userId, stockCount)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to approve StockCount");
        }
        if (stockCount.getStatus() == StockCountStatus.COMPLETED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "StockCount already completed");
        }
        if (stockCount.getStatus() == StockCountStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cancelled StockCount cannot be approved");
        }

        LocalDateTime approvedAt = LocalDateTime.now();
        LocalDateTime snapshotTo = stockCount.getCreatedAt() != null ? stockCount.getCreatedAt() : approvedAt;

        for (StockCountItem item : stockCount.getItems()) {
            if (item.getActualQuantity() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "All stock count items must have actualQuantity before approval");
            }

            StockResource stockResource = item.getStockResource();
            BigDecimal previousQuantity = nullSafe(item.getPreviousQuantity());
            BigDecimal movementDelta = nullSafe(item.getMovementDelta());
            BigDecimal expectedQuantity = resolveExpected(item);
            BigDecimal actualQuantity = normalizeCountQuantity(item.getActualQuantity());
            BigDecimal variance = actualQuantity.subtract(expectedQuantity).setScale(QUANTITY_SCALE, RoundingMode.HALF_UP);

            item.setActualQuantity(actualQuantity);
            item.setDiscrepancy(variance);

            StockMovementSummaryProjection summary = stockMovementRepository.summarizeForResource(
                    stockResource.getId(),
                    resolveMovementWindowStart(stockResource.getLastCountedAt()),
                    snapshotTo
            );
            StockReconciliationItem reconciliationItem = new StockReconciliationItem();
            reconciliationItem.setStockCount(stockCount);
            reconciliationItem.setStockCountItem(item);
            reconciliationItem.setStockResource(stockResource);
            reconciliationItem.setPreviousQuantity(previousQuantity);
            reconciliationItem.setMovementDelta(movementDelta);
            reconciliationItem.setExpectedQuantity(expectedQuantity);
            reconciliationItem.setActualQuantity(actualQuantity);
            reconciliationItem.setVariance(variance);
            reconciliationItem.setSaleDelta(summary == null ? BigDecimal.ZERO : nullSafe(summary.getSaleTotal()));
            reconciliationItem.setWasteDelta(summary == null ? BigDecimal.ZERO : nullSafe(summary.getWasteTotal()));
            reconciliationItem.setPurchaseDelta(summary == null ? BigDecimal.ZERO : nullSafe(summary.getPurchaseTotal()));
            reconciliationItem.setReturnDelta(summary == null ? BigDecimal.ZERO : nullSafe(summary.getReturnTotal()));
            reconciliationItem.setAdjustmentDelta(summary == null ? BigDecimal.ZERO : nullSafe(summary.getAdjustmentTotal()));
            reconciliationItem.setApprovedBy(userId);
            reconciliationItem.setApprovedAt(approvedAt);
            reconciliationItem.setTenantId(stockCount.getTenantId());
            stockReconciliationItemRepository.save(reconciliationItem);

            stockResource.setQuantity(actualQuantity);
            stockResource.setLastCountId(stockCount.getId());
            stockResource.setLastCountedAt(approvedAt);
            stockResource.setLastCountedBy(userId);
            stockResource.setLastCountQuantity(actualQuantity);
            stockResource.setLastExpectedQuantity(expectedQuantity);
            stockResourceRepository.save(stockResource);
        }

        stockCount.setStatus(StockCountStatus.COMPLETED);
        stockCount.setApprovedAt(approvedAt);
        stockCount.setApprovedBy(userId);

        StockCount approved = repository.save(stockCount);
        return toDTOWithItems(approved);
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
                log.debug("Failed to patch StockCount with id: {}", uuid, e);
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        StockCount stockCount = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "StockCount not found"));
        if (!permissionEvaluator.canDelete(userId, stockCount)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete StockCount");
        }
        repository.delete(stockCount);
        log.info("Deleted StockCount with id: {}", uuid);
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
                log.debug("Failed to delete StockCount with id: {}", uuid, e);
            }
        }
        return deleted;
    }

    private StockCountDTO toDTOWithItems(StockCount stockCount) {
        StockCountDTO dto = mapper.toDTO(stockCount);
        dto.setItems(stockCount.getItems().stream().map(mapper::toItemDTO).toList());
        return dto;
    }

    private Shop resolveShop(UUID shopId) {
        if (shopId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "shopId is required");
        }
        return shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
    }

    private BigDecimal resolveExpected(StockCountItem item) {
        if (item.getExpectedQuantity() != null) {
            return item.getExpectedQuantity();
        }
        return nullSafe(item.getTheoreticalQuantity());
    }

    private BigDecimal resolveNetDelta(StockMovementSummaryProjection summary) {
        return summary == null ? BigDecimal.ZERO : nullSafe(summary.getNetDelta());
    }

    private BigDecimal nullSafe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private BigDecimal normalizeCountQuantity(BigDecimal quantity) {
        if (quantity == null) {
            return null;
        }
        if (quantity.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "actualQuantity cannot be negative");
        }
        return quantity.setScale(QUANTITY_SCALE, RoundingMode.HALF_UP);
    }

    private LocalDateTime resolveMovementWindowStart(LocalDateTime lastCountedAt) {
        return lastCountedAt == null ? DEFAULT_MOVEMENT_WINDOW_START : lastCountedAt;
    }
}
