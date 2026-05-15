package org.zerp.sale.service;

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
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.shop.ShopDTO;
import org.zerp.sale.mapper.ShopMapper;
import org.zerp.sale.permission.ShopPermissionEvaluator;
import org.zerp.sale.repository.ShopRepository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class ShopService implements IResourceService<ShopDTO, ShopDTO, Void, Void, UUID> {
    private final ShopPermissionEvaluator permissionEvaluator;
    private final ShopRepository repository;
    private final ShopMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final FilterRefiner filterRefiner;

    @Override
    @Transactional(readOnly = true)
    public Page<ShopDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.trace("Finding Shops with filters: {}", filters);
        UUID userId = currentUserIdResolver.resolve();
        Specification<Shop> spec = filterRefiner.refinedOrBadRequest(filters, Shop.class);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<ShopDTO> results = repository.findAll(spec, pageable).map(mapper::toDTO);
        log.debug("Found {} Shops", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShopDTO> findAllById(List<UUID> ids) {
        UUID userId = currentUserIdResolver.resolve();
        return repository.findAllById(ids).stream()
                .filter(shop -> permissionEvaluator.canRead(userId, shop))
                .map(mapper::toDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ShopDTO findById(UUID id) {
        UUID userId = currentUserIdResolver.resolve();
        Shop shop = repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));

        if (!permissionEvaluator.canRead(userId, shop)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Shop");
        }

        return mapper.toDTO(shop);
    }

    @Override
    public ShopDTO create(Void data) {
        throw new UnsupportedOperationException("Create operation is not supported for Shop resource");
    }

    @Override
    public ShopDTO patch(UUID id, Map<String, Object> data) {
        throw new UnsupportedOperationException("Patch operation is not supported for Shop resource");
    }

    @Override
    public ShopDTO update(UUID id, Void data) {
        throw new UnsupportedOperationException("Update operation is not supported for Shop resource");
    }

    @Override
    public List<UUID> patchMany(List<UUID> ids, Map<String, Object> fields) {
        throw new UnsupportedOperationException("Bulk patch operation is not supported for Shop resource");
    }

    @Override
    public void deleteById(UUID id) {
        throw new UnsupportedOperationException("Delete operation is not supported for Shop resource");
    }

    @Override
    public List<UUID> deleteMany(List<UUID> ids) {
        throw new UnsupportedOperationException("Bulk delete operation is not supported for Shop resource");
    }
}
