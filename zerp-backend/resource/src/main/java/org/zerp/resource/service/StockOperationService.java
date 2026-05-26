package org.zerp.resource.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.resource.StockMovement;
import org.zerp.common.entity.resource.StockMovementDirection;
import org.zerp.common.entity.resource.StockMovementType;
import org.zerp.common.entity.resource.StockOperation;
import org.zerp.common.entity.resource.StockOperationItem;
import org.zerp.common.entity.resource.StockOperationItemDirection;
import org.zerp.common.entity.resource.StockOperationType;
import org.zerp.common.entity.resource.StockResource;
import org.zerp.common.permission.entity.PermissionAction;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.resource.dto.stockoperation.StockAdjustmentCreateDTO;
import org.zerp.resource.dto.stockoperation.StockAdjustmentItemDTO;
import org.zerp.resource.dto.stockoperation.StockEntryCreateDTO;
import org.zerp.resource.dto.stockoperation.StockEntryItemDTO;
import org.zerp.resource.dto.stockoperation.StockOperationItemDTO;
import org.zerp.resource.dto.stockoperation.StockOperationDTO;
import org.zerp.resource.permission.StockMovementPermissionEvaluator;
import org.zerp.resource.repository.ShopRepository;
import org.zerp.resource.repository.StockOperationRepository;
import org.zerp.resource.repository.StockResourceRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class StockOperationService {
    private static final int DEFAULT_HISTORY_LIMIT = 100;
    private static final int MAX_HISTORY_LIMIT = 500;

    private final ShopRepository shopRepository;
    private final StockResourceRepository stockResourceRepository;
    private final StockOperationRepository stockOperationRepository;
    private final StockMovementPermissionEvaluator stockMovementPermissionEvaluator;
    private final StockMovementService stockMovementService;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;

    @Transactional
    public StockOperationDTO createEntry(StockEntryCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = currentTenantIdResolver.resolve();
        Shop shop = resolveShop(data.getShopId(), tenantId);

        List<StockEntryItemDTO> items = data.getItems() == null ? List.of() : data.getItems();
        if (items.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "items is required");
        }

        StockOperation operation = new StockOperation();
        operation.setShop(shop);
        operation.setOperationType(StockOperationType.ENTRY);
        operation.setReferenceNo(data.getReferenceNo());
        operation.setNotes(data.getNotes());
        operation.setTenantId(tenantId);
        operation = stockOperationRepository.save(operation);

        List<StockOperationItem> operationItems = new ArrayList<>(items.size());
        for (StockEntryItemDTO itemDto : items) {
            StockResource resource = resolveResource(itemDto.getStockResourceId(), shop.getId(), tenantId);
            ensureCanCreateOperation(userId, shop, PermissionAction.CREATE_STOCK_ENTRY, resource.getId());
            BigDecimal quantity = normalizeQuantity(itemDto.getQuantity());

            StockMovement movement = stockMovementService.createInternalLedgerOnly(
                    tenantId,
                    resource,
                    StockMovementType.PURCHASE,
                    StockMovementDirection.IN,
                    quantity,
                    "STOCK_ENTRY",
                    operation.getId(),
                    itemDto.getNotes()
            );

            StockOperationItem operationItem = new StockOperationItem();
            operationItem.setOperation(operation);
            operationItem.setStockResource(resource);
            operationItem.setQuantity(quantity);
            operationItem.setDirection(StockOperationItemDirection.INCREASE);
            operationItem.setUnitCost(resource.getCostPerUnit());
            operationItem.setReferenceNo(itemDto.getReferenceNo() != null ? itemDto.getReferenceNo() : data.getReferenceNo());
            operationItem.setNotes(itemDto.getNotes());
            operationItem.setStockMovement(movement);
            operationItem.setTenantId(tenantId);
            operationItems.add(operationItem);

            stockResourceRepository.save(applyRealDelta(resource, quantity));
        }

        operation.getItems().clear();
        operation.getItems().addAll(operationItems);
        StockOperation saved = stockOperationRepository.save(operation);
        log.info("Stock entry operation created: id={}, shopId={}, itemCount={}", saved.getId(), shop.getId(), operationItems.size());
        return toDTO(saved);
    }

    @Transactional
    public StockOperationDTO createAdjustment(StockAdjustmentCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = currentTenantIdResolver.resolve();
        Shop shop = resolveShop(data.getShopId(), tenantId);

        List<StockAdjustmentItemDTO> items = data.getItems() == null ? List.of() : data.getItems();
        if (items.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "items is required");
        }

        StockOperation operation = new StockOperation();
        operation.setShop(shop);
        operation.setOperationType(StockOperationType.ADJUSTMENT);
        operation.setReferenceNo(data.getReferenceNo());
        operation.setNotes(data.getNotes());
        operation.setTenantId(tenantId);
        operation = stockOperationRepository.save(operation);

        List<StockOperationItem> operationItems = new ArrayList<>(items.size());
        for (StockAdjustmentItemDTO itemDto : items) {
            StockResource resource = resolveResource(itemDto.getStockResourceId(), shop.getId(), tenantId);
            ensureCanCreateOperation(userId, shop, PermissionAction.CREATE_STOCK_ADJUSTMENT, resource.getId());
            BigDecimal quantity = normalizeQuantity(itemDto.getQuantity());
            StockOperationItemDirection itemDirection = itemDto.getDirection();
            if (itemDirection == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "direction is required for adjustment items");
            }

            StockMovementDirection movementDirection = itemDirection == StockOperationItemDirection.DECREASE
                    ? StockMovementDirection.OUT
                    : StockMovementDirection.IN;

            StockMovement movement = stockMovementService.createInternalLedgerOnly(
                    tenantId,
                    resource,
                    StockMovementType.ADJUSTMENT,
                    movementDirection,
                    quantity,
                    "STOCK_ADJUSTMENT",
                    operation.getId(),
                    itemDto.getNotes()
            );

            StockOperationItem operationItem = new StockOperationItem();
            operationItem.setOperation(operation);
            operationItem.setStockResource(resource);
            operationItem.setQuantity(quantity);
            operationItem.setDirection(itemDirection);
            operationItem.setReason(itemDto.getReason());
            operationItem.setReferenceNo(data.getReferenceNo());
            operationItem.setNotes(itemDto.getNotes());
            operationItem.setStockMovement(movement);
            operationItem.setTenantId(tenantId);
            operationItems.add(operationItem);

            BigDecimal realDelta = itemDirection == StockOperationItemDirection.DECREASE
                    ? quantity.negate()
                    : quantity;
            stockResourceRepository.save(applyRealDelta(resource, realDelta));
        }

        operation.getItems().clear();
        operation.getItems().addAll(operationItems);
        StockOperation saved = stockOperationRepository.save(operation);
        log.info("Stock adjustment operation created: id={}, shopId={}, itemCount={}", saved.getId(), shop.getId(), operationItems.size());
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<StockOperationDTO> getHistory(
            UUID shopId,
            StockOperationType operationType,
            LocalDateTime from,
            LocalDateTime to,
            String referenceNo,
            Integer limit
    ) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = currentTenantIdResolver.resolve();
        Shop shop = resolveShop(shopId, tenantId);

        if (!stockMovementPermissionEvaluator.canReadByShop(userId, shop.getId(), tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read stock operation history");
        }

        int safeLimit = limit == null
                ? DEFAULT_HISTORY_LIMIT
                : Math.max(1, Math.min(limit, MAX_HISTORY_LIMIT));

        validateHistoryWindow(from, to);
        Specification<StockOperation> spec = buildHistorySpec(shop.getId(), operationType, from, to, referenceNo);
        PageRequest pageable = PageRequest.of(0, safeLimit, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<StockOperation> page = stockOperationRepository.findAll(spec, pageable);
        return page.getContent()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private Specification<StockOperation> buildHistorySpec(
            UUID shopId,
            StockOperationType operationType,
            LocalDateTime from,
            LocalDateTime to,
            String referenceNo
    ) {
        Specification<StockOperation> spec = (root, _, cb) -> cb.equal(root.get("shop").get("id"), shopId);

        if (operationType != null) {
            spec = spec.and((root, _, cb) -> cb.equal(root.get("operationType"), operationType));
        }
        if (from != null) {
            spec = spec.and((root, _, cb) -> cb.greaterThanOrEqualTo(root.get("createdAt"), from));
        }
        if (to != null) {
            spec = spec.and((root, _, cb) -> cb.lessThanOrEqualTo(root.get("createdAt"), to));
        }
        if (referenceNo != null && !referenceNo.isBlank()) {
            String pattern = "%" + referenceNo.trim().toLowerCase() + "%";
            spec = spec.and((root, _, cb) -> cb.like(cb.lower(root.get("referenceNo")), pattern));
        }

        return spec;
    }

    private void validateHistoryWindow(LocalDateTime from, LocalDateTime to) {
        if (from != null && to != null && from.isAfter(to)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "`from` must be before or equal to `to`");
        }
    }

    private void ensureCanCreateOperation(UUID userId, Shop shop, PermissionAction action, UUID stockResourceId) {
        if (!stockMovementPermissionEvaluator.canCreateWithAction(
                userId,
                stockResourceId,
                shop.getId(),
                shop.getTenantId(),
                action
        )) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission for this stock operation");
        }
    }

    private Shop resolveShop(UUID shopId, UUID tenantId) {
        if (shopId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "shopId is required");
        }
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
        if (!tenantId.equals(shop.getTenantId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shop tenant mismatch");
        }
        return shop;
    }

    private StockResource resolveResource(UUID stockResourceId, UUID shopId, UUID tenantId) {
        if (stockResourceId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "stockResourceId is required");
        }
        StockResource stockResource = stockResourceRepository.findById(stockResourceId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "StockResource not found"));
        if (!tenantId.equals(stockResource.getTenantId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "StockResource tenant mismatch");
        }
        if (!shopId.equals(stockResource.getShop().getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "StockResource does not belong to selected shop");
        }
        return stockResource;
    }

    private BigDecimal normalizeQuantity(BigDecimal quantity) {
        if (quantity == null || quantity.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "quantity must be greater than zero");
        }
        return quantity.setScale(6, RoundingMode.HALF_UP);
    }

    private StockOperationDTO toDTO(StockOperation operation) {
        StockOperationDTO dto = new StockOperationDTO();
        dto.setId(operation.getId());
        dto.setShopId(operation.getShop().getId());
        dto.setShopName(operation.getShop().getName());
        dto.setOperationType(operation.getOperationType());
        dto.setStatus(operation.getStatus());
        dto.setReferenceNo(operation.getReferenceNo());
        dto.setNotes(operation.getNotes());
        dto.setItemCount(operation.getItems() == null ? 0 : operation.getItems().size());
        dto.setCreatedAt(operation.getCreatedAt());
        dto.setTenantId(operation.getTenantId());
        dto.setItems(operation.getItems() == null
                ? List.of()
                : operation.getItems().stream().map(this::toItemDTO).toList());
        return dto;
    }

    private StockOperationItemDTO toItemDTO(StockOperationItem item) {
        StockOperationItemDTO dto = new StockOperationItemDTO();
        dto.setId(item.getId());
        dto.setStockResourceId(item.getStockResource().getId());
        dto.setStockResourceName(item.getStockResource().getName());
        dto.setUnitType(item.getStockResource().getUnitType());
        dto.setQuantity(item.getQuantity());
        dto.setDirection(item.getDirection());
        dto.setUnitCost(item.getUnitCost());
        dto.setReason(item.getReason());
        dto.setReferenceNo(item.getReferenceNo());
        dto.setNotes(item.getNotes());
        dto.setStockMovementId(item.getStockMovement() == null ? null : item.getStockMovement().getId());
        return dto;
    }

    private StockResource applyRealDelta(StockResource resource, BigDecimal delta) {
        resource.setQuantity(nullSafe(resource.getQuantity()).add(delta));
        return resource;
    }

    private BigDecimal nullSafe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}
