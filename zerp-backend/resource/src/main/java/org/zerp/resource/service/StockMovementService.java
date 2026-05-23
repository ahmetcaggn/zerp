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
import org.zerp.common.dto.feign.resource.StockMovementFeignRequest;
import org.zerp.common.entity.resource.StockMovement;
import org.zerp.common.entity.resource.StockMovementType;
import org.zerp.common.entity.resource.StockResource;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.resource.dto.stockmovement.StockMovementCreateDTO;
import org.zerp.resource.dto.stockmovement.StockMovementDTO;
import org.zerp.resource.mapper.StockMovementMapper;
import org.zerp.resource.permission.StockMovementPermissionEvaluator;
import org.zerp.resource.repository.StockMovementRepository;
import org.zerp.resource.repository.StockResourceRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class StockMovementService implements
        IResourceService<StockMovementDTO, StockMovementDTO, StockMovementCreateDTO, StockMovementCreateDTO, UUID> {
    private final StockMovementPermissionEvaluator permissionEvaluator;
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
     * Creates a stock movement and updates the StockResource quantity accordingly.
     */
    @Override
    @Transactional
    public StockMovementDTO create(StockMovementCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        StockResource stockResource = stockResourceRepository.findById(data.getStockResourceId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.BAD_REQUEST, "StockResource not found"));
        UUID tenantId = stockResource.getTenantId();

        if (!permissionEvaluator.canCreate(userId, stockResource)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create StockMovement");
        }


        BigDecimal previousQuantity = stockResource.getQuantity();
        BigDecimal newQuantity = calculateNewQuantity(previousQuantity, data.getQuantity(), data.getType());

        StockMovement movement = mapper.toEntity(data);
        movement.setStockResource(stockResource);
        movement.setTenantId(tenantId);
        movement.setPreviousQuantity(previousQuantity);
        movement.setNewQuantity(newQuantity);

        stockResource.setQuantity(newQuantity);
        stockResourceRepository.save(stockResource);

        StockMovement saved = repository.save(movement);
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

        BigDecimal previous = resource.getQuantity();
        BigDecimal next = calculateNewQuantity(previous, req.getQuantity(), req.getType());

        StockMovement movement = new StockMovement();
        movement.setStockResource(resource);
        movement.setType(req.getType());
        movement.setQuantity(req.getQuantity());
        movement.setPreviousQuantity(previous);
        movement.setNewQuantity(next);
        movement.setReferenceType(req.getReferenceType());
        movement.setReferenceId(req.getReferenceId());
        movement.setNotes(req.getNotes());
        movement.setTenantId(req.getTenantId());

        repository.save(movement);

        log.info("Internal StockMovement created: resource={}, type={}, qty={}", resource.getId(), req.getType(), req.getQuantity());
    }

    private BigDecimal calculateNewQuantity(BigDecimal current, BigDecimal delta, StockMovementType movementType) {
        return switch (movementType) {
            case SALE, WASTE, TRANSFER -> current.subtract(delta);
            default -> current.add(delta);
        };
    }
}
