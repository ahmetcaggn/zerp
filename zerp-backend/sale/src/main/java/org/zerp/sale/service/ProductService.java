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
import org.zerp.common.entity.sale.Product;
import org.zerp.common.entity.sale.ProductMetric;
import org.zerp.common.entity.sale.ProductType;
import org.zerp.common.entity.sale.MenuItem;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.product.ProductCreateDTO;
import org.zerp.sale.dto.product.ProductDTO;
import org.zerp.sale.dto.product.ProductUpdateDTO;
import org.zerp.sale.mapper.ProductMapper;
import org.zerp.sale.permission.ProductPermissionEvaluator;
import org.zerp.sale.repository.MenuItemRepository;
import org.zerp.sale.repository.ProductMetricRepository;
import org.zerp.sale.repository.ProductTypeRepository;
import org.zerp.sale.repository.ShopRepository;
import org.zerp.sale.repository.ProductRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class ProductService implements
        IResourceService<ProductDTO, ProductDTO, ProductCreateDTO, ProductUpdateDTO, UUID> {
    private final ProductPermissionEvaluator permissionEvaluator;
    private final ProductRepository repository;
    private final ShopRepository shopRepository;
    private final ProductTypeRepository productTypeRepository;
    private final ProductMetricRepository productMetricRepository;
    private final MenuItemRepository menuItemRepository;
    private final ProductMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;
    private final FilterRefiner filterRefiner;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.trace("Finding Products with filters: {}", filters);
        UUID userId = currentUserIdResolver.resolve();
        Specification<Product> spec = filterRefiner.refinedOrBadRequest(filters, Product.class);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<ProductDTO> results = repository.findAll(spec, pageable).map(mapper::toDTO);
        log.debug("Found {} Products", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> findAllById(List<UUID> uuids) {
        UUID userId = currentUserIdResolver.resolve();
        List<ProductDTO> results = new ArrayList<>();
        for (UUID id : uuids) {
            repository.findById(id).ifPresent(product -> {
                if (permissionEvaluator.canRead(userId, product)) {
                    results.add(mapper.toDTO(product));
                }
            });
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO findById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        Product product = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if (!permissionEvaluator.canRead(userId, product)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Product");
        }
        return mapper.toDTO(product);
    }

    @Override
    @Transactional
    public ProductDTO create(ProductCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = currentTenantIdResolver.resolve();
        Shop shop = resolveShop(data.getShopId());
        if (!permissionEvaluator.canCreate(userId, shop.getId(), tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Product");
        }
        Product product = mapper.toEntity(data);
        product.setShop(shop);
        product.setType(resolveProductType(data.getTypeId()));
        product.setMetric(resolveProductMetric(data.getMetricId()));
        product.setMenuItem(resolveMenuItem(data.getMenuItemId()));
        product.setTenantId(tenantId);
        Product saved = repository.save(product);
        log.info("Created Product with id: {}", saved.getId());
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public ProductDTO patch(UUID uuid, Map<String, Object> data) {
        UUID userId = currentUserIdResolver.resolve();
        Product product = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if (!permissionEvaluator.canPatch(userId, product)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch Product");
        }
        applyFieldUpdates(product, data);
        Product updated = repository.save(product);
        log.info("Patched Product with id: {}", uuid);
        return mapper.toDTO(updated);
    }

    @Override
    @Transactional
    public ProductDTO update(UUID uuid, ProductUpdateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        Product product = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if (!permissionEvaluator.canUpdate(userId, product)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Product");
        }
        mapper.updateEntityFromDTO(data, product);
        if (data.getTypeId() != null) product.setType(resolveProductType(data.getTypeId()));
        if (data.getMetricId() != null) product.setMetric(resolveProductMetric(data.getMetricId()));
        if (data.getMenuItemId() != null) product.setMenuItem(resolveMenuItem(data.getMenuItemId()));
        Product updated = repository.save(product);
        log.info("Updated Product with id: {}", uuid);
        return mapper.toDTO(updated);
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
                log.debug("Failed to patch Product with id: {}", uuid, e);
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        Product product = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        if (!permissionEvaluator.canDelete(userId, product)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete Product");
        }
        repository.delete(product);
        log.info("Deleted Product with id: {}", uuid);
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
                log.debug("Failed to delete Product with id: {}", uuid, e);
            }
        }
        return deleted;
    }

    private void applyFieldUpdates(Product product, Map<String, Object> fields) {
        if (fields.containsKey("name")) product.setName((String) fields.get("name"));
        if (fields.containsKey("description")) product.setDescription((String) fields.get("description"));
        if (fields.containsKey("price")) product.setPrice(new BigDecimal(fields.get("price").toString()));
        if (fields.containsKey("isActive")) product.setActive((Boolean) fields.get("isActive"));
        if (fields.containsKey("preparationTime")) product.setPreparationTime((Integer) fields.get("preparationTime"));
    }

    private Shop resolveShop(UUID shopId) {
        if (shopId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "shopId is required");
        }
        return shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
    }

    private ProductType resolveProductType(UUID typeId) {
        if (typeId == null ) {
            return null;
        }
        return productTypeRepository.findById(typeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductType not found"));
    }

    private ProductMetric resolveProductMetric(UUID metricId) {
        if (metricId == null) {
            return null;
        }
        return productMetricRepository.findById(metricId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductMetric not found"));
    }

    private MenuItem resolveMenuItem(UUID menuItemId) {
        if (menuItemId == null) {
            return null;
        }
        return menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuItem not found"));
    }
}
