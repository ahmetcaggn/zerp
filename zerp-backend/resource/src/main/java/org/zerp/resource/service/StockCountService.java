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
import org.zerp.common.entity.resource.StockCount;
import org.zerp.common.entity.resource.StockCountItem;
import org.zerp.common.entity.resource.StockCountStatus;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.resource.dto.stockcount.StockCountCreateDTO;
import org.zerp.resource.dto.stockcount.StockCountDTO;
import org.zerp.resource.dto.stockcount.StockCountItemUpdateDTO;
import org.zerp.resource.dto.stockcount.StockCountUpdateDTO;
import org.zerp.resource.mapper.StockCountMapper;
import org.zerp.resource.permission.StockCountPermissionEvaluator;
import org.zerp.resource.repository.StockCountRepository;
import org.zerp.resource.repository.StockResourceRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class StockCountService implements
        IResourceService<StockCountDTO, StockCountDTO, StockCountCreateDTO, StockCountUpdateDTO, UUID> {
    private final StockCountPermissionEvaluator permissionEvaluator;
    private final StockCountRepository repository;
    private final StockResourceRepository stockResourceRepository;
    private final StockCountMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;
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
        UUID tenantId = currentTenantIdResolver.resolve();
        if (!permissionEvaluator.canCreate(userId, data.getShopId(), tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create StockCount");
        }

        StockCount stockCount = mapper.toEntity(data);
        stockCount.setTenantId(tenantId);
        stockCount.setStatus(StockCountStatus.DRAFT);

        stockResourceRepository.findAll(
                (root, _, _) -> root.get("shop").get("id").in(data.getShopId())
        ).forEach(stockResource -> {
            StockCountItem item = new StockCountItem();
            item.setStockCount(stockCount);
            item.setStockResource(stockResource);
            item.setTheoreticalQuantity(stockResource.getQuantity());
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
        if (data.containsKey("status")) stockCount.setStatus(StockCountStatus.valueOf((String) data.get("status")));
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

        if (data.getStatus() != null) stockCount.setStatus(data.getStatus());
        if (data.getNotes() != null) stockCount.setNotes(data.getNotes());
        if (data.getCountDate() != null) stockCount.setCountDate(data.getCountDate());

        if (data.getItems() != null) {
            for (StockCountItemUpdateDTO itemUpdate : data.getItems()) {
                stockCount.getItems().stream()
                        .filter(item -> item.getId().equals(itemUpdate.getStockCountItemId()))
                        .findFirst()
                        .ifPresent(item -> {
                            item.setActualQuantity(itemUpdate.getActualQuantity());
                            item.setWasteQuantity(itemUpdate.getWasteQuantity());
                            item.setNotes(itemUpdate.getNotes());
                            if (itemUpdate.getActualQuantity() != null) {
                                item.setDiscrepancy(itemUpdate.getActualQuantity()
                                        .subtract(item.getTheoreticalQuantity()));
                            }
                        });
            }
        }

        StockCount updated = repository.save(stockCount);
        log.info("Updated StockCount with id: {}", uuid);
        return toDTOWithItems(updated);
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
}
