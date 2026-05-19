package org.zerp.sale.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.sale.MenuCategory;
import org.zerp.common.entity.sale.MenuItem;
import org.zerp.common.entity.sale.MenuItemProduct;
import org.zerp.common.entity.sale.Product;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.menuitem.MenuItemCreateDTO;
import org.zerp.sale.dto.menuitem.MenuItemDTO;
import org.zerp.sale.dto.menuitem.MenuItemImageUploadResponseDTO;
import org.zerp.sale.dto.menuitem.MenuItemProductItemDTO;
import org.zerp.sale.dto.menuitem.MenuItemUpdateDTO;
import org.zerp.sale.mapper.MenuItemMapper;
import org.zerp.sale.permission.MenuItemPermissionEvaluator;
import org.zerp.sale.repository.MenuItemRepository;
import org.zerp.sale.repository.MenuItemProductRepository;
import org.zerp.sale.repository.MenuCategoryRepository;
import org.zerp.sale.repository.ProductRepository;
import org.zerp.s3repository.dto.S3FileDTO;
import org.zerp.s3repository.repository.S3ImageRepository;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class MenuItemService implements
        IResourceService<MenuItemDTO, MenuItemDTO, MenuItemCreateDTO, MenuItemUpdateDTO, UUID> {
    private final MenuItemPermissionEvaluator permissionEvaluator;
    private final MenuItemRepository repository;
    private final MenuCategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final MenuItemProductRepository menuItemProductRepository;
    private final MenuItemMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;
    private final FilterRefiner filterRefiner;
    private final S3ImageRepository s3ImageRepository;

    @Value("${app.sale.menu-item-images.folder:saleMenuItems}")
    private String menuItemImageFolder;

    @Override
    @Transactional(readOnly = true)
    public Page<MenuItemDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.trace("Finding MenuItems with filters: {}", filters);
        UUID userId = currentUserIdResolver.resolve();
        Specification<MenuItem> spec = filterRefiner.refinedOrBadRequest(filters, MenuItem.class);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<MenuItemDTO> results = repository.findAll(spec, pageable).map(mapper::toDTO);
        log.debug("Found {} MenuItems", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDTO> findAllById(List<UUID> uuids) {
        UUID userId = currentUserIdResolver.resolve();
        List<MenuItemDTO> results = new ArrayList<>();
        for (UUID id : uuids) {
            repository.findById(id).ifPresent(item -> {
                if (permissionEvaluator.canRead(userId, item)) {
                    results.add(mapper.toDTO(item));
                }
            });
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public MenuItemDTO findById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        MenuItem item = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuItem not found"));
        if (!permissionEvaluator.canRead(userId, item)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read MenuItem");
        }
        return mapper.toDTO(item);
    }

    @Override
    @Transactional
    public MenuItemDTO create(MenuItemCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = currentTenantIdResolver.resolve();
        if (!permissionEvaluator.canCreate(userId, data.getCategoryId(), tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create MenuItem");
        }
        MenuItem item = mapper.toEntity(data);
        item.setCategory(categoryRepository.getReferenceById(data.getCategoryId()));
        item.setTenantId(tenantId);
        MenuItem saved = repository.save(item);
        log.info("Created MenuItem with id: {}", saved.getId());
        
        handleProductAssignments(saved, data.getProductItems());
        
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public MenuItemDTO patch(UUID uuid, Map<String, Object> data) {
        UUID userId = currentUserIdResolver.resolve();
        MenuItem item = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuItem not found"));
        if (!permissionEvaluator.canPatch(userId, item)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch MenuItem");
        }
        applyFieldUpdates(item, data);
        MenuItem updated = repository.save(item);
        log.info("Patched MenuItem with id: {}", uuid);
        return mapper.toDTO(updated);
    }

    @Override
    @Transactional
    public MenuItemDTO update(UUID uuid, MenuItemUpdateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        MenuItem item = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuItem not found"));
        if (!permissionEvaluator.canUpdate(userId, item)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update MenuItem");
        }
        
        mapper.updateEntityFromDTO(data, item);
        MenuItem updated = repository.save(item);
        
        handleProductAssignments(updated, data.getProductItems());
        log.info("Updated MenuItem with id: {}", uuid);
        MenuItemDTO dto = mapper.toDTO(updated);
        return dto;
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
                log.debug("Failed to patch MenuItem with id: {}", uuid, e);
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        MenuItem item = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuItem not found"));
        if (!permissionEvaluator.canDelete(userId, item)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete MenuItem");
        }
        menuItemProductRepository.deleteByMenuItemId(uuid);
        repository.delete(item);
        log.info("Deleted MenuItem with id: {}", uuid);
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
                log.debug("Failed to delete MenuItem with id: {}", uuid, e);
            }
        }
        return deleted;
    }

    @Transactional
    public MenuItemImageUploadResponseDTO uploadMenuItemImage(MultipartFile file, UUID categoryId) {
        if (categoryId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "categoryId is required");
        }
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file is required");
        }

        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = currentTenantIdResolver.resolve();
        if (!permissionEvaluator.canCreate(userId, categoryId, tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create MenuItem");
        }

        MenuCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuCategory not found"));

        UUID categoryTenantId = category.getMenu() != null && category.getMenu().getShop() != null
                ? category.getMenu().getShop().getTenantId()
                : null;
        if (!Objects.equals(categoryTenantId, tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Category does not belong to current tenant");
        }

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read image file", e);
        }

        S3FileDTO uploadedFile;
        try {
            uploadedFile = s3ImageRepository.create(resolveMenuItemImageFolder(), fileBytes);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }

        return new MenuItemImageUploadResponseDTO(
                uploadedFile.getFileName(),
                resolveContentType(file),
                resolveOriginalFileName(file, uploadedFile.getFileName())
        );
    }

    private void applyFieldUpdates(MenuItem item, Map<String, Object> fields) {
        if (fields.containsKey("name")) item.setName((String) fields.get("name"));
        if (fields.containsKey("description")) item.setDescription((String) fields.get("description"));
        if (fields.containsKey("price")) item.setPrice(new BigDecimal(fields.get("price").toString()));
        if (fields.containsKey("imageId")) item.setImageId((String) fields.get("imageId"));
        if (fields.containsKey("calories")) item.setCalories(toInteger(fields.get("calories")));
        if (fields.containsKey("weight")) item.setWeight((String) fields.get("weight"));
        if (fields.containsKey("ingredients")) item.setIngredients(toStringList(fields.get("ingredients")));
        if (fields.containsKey("allergens")) item.setAllergens(toStringList(fields.get("allergens")));
    }

    private void handleProductAssignments(MenuItem item, List<MenuItemProductItemDTO> newProductItems) {
        if (newProductItems == null) {
            return;
        }
        Map<UUID, Integer> desiredProductQuantities = toProductQuantityMap(newProductItems);
        List<MenuItemProduct> currentLinks = menuItemProductRepository.findByMenuItemId(item.getId());

        for (MenuItemProduct currentLink : currentLinks) {
            UUID productId = currentLink.getProduct().getId();
            Integer quantity = desiredProductQuantities.remove(productId);
            if (quantity == null) {
                menuItemProductRepository.delete(currentLink);
                continue;
            }
            if (!Objects.equals(currentLink.getQuantity(), quantity)) {
                currentLink.setQuantity(quantity);
                menuItemProductRepository.save(currentLink);
            }
        }

        for (Map.Entry<UUID, Integer> entry : desiredProductQuantities.entrySet()) {
            Product product = productRepository.findById(entry.getKey()).orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found: " + entry.getKey()));
            if (!Objects.equals(product.getTenantId(), item.getTenantId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Product does not belong to current tenant");
            }
            MenuItemProduct newLink = new MenuItemProduct();
            newLink.setMenuItem(item);
            newLink.setProduct(product);
            newLink.setQuantity(entry.getValue());
            newLink.setTenantId(item.getTenantId());
            menuItemProductRepository.save(newLink);
        }
    }

    private Map<UUID, Integer> toProductQuantityMap(List<MenuItemProductItemDTO> productItems) {
        Map<UUID, Integer> result = new LinkedHashMap<>();
        for (MenuItemProductItemDTO item : productItems) {
            if (item == null || item.getProductId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "productId is required");
            }
            Integer quantity = item.getQuantity();
            if (quantity == null || quantity < 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "quantity must be greater than 0");
            }
            result.put(item.getProductId(), quantity);
        }
        return result;
    }

    private Integer toInteger(Object rawValue) {
        if (rawValue == null) {
            return null;
        }
        if (rawValue instanceof Number number) {
            return number.intValue();
        }
        try {
            return Integer.parseInt(rawValue.toString());
        } catch (NumberFormatException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "calories must be a valid number", e);
        }
    }

    private List<String> toStringList(Object rawValue) {
        if (rawValue == null) {
            return new ArrayList<>();
        }
        if (!(rawValue instanceof List<?> rawList)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "value must be an array");
        }
        List<String> values = new ArrayList<>();
        for (Object value : rawList) {
            if (value == null) {
                continue;
            }
            String normalized = value.toString().trim();
            if (!normalized.isEmpty()) {
                values.add(normalized);
            }
        }
        return values;
    }

    private String resolveMenuItemImageFolder() {
        return menuItemImageFolder == null ? "" : menuItemImageFolder.trim();
    }

    private String resolveContentType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            return "application/octet-stream";
        }
        return contentType.trim();
    }

    private String resolveOriginalFileName(MultipartFile file, String fallbackFileName) {
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isBlank()) {
            return fallbackFileName;
        }
        return originalFileName.trim();
    }
}
