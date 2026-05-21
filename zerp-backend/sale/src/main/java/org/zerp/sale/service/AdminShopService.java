package org.zerp.sale.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.Tenant;
import org.zerp.common.error.filter.FilterError;
import org.zerp.common.error.filter.FilterErrorUtils;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.adminshop.AdminShopCreateRequestDTO;
import org.zerp.sale.dto.adminshop.AdminShopNameCheckResponseDTO;
import org.zerp.sale.dto.adminshop.AdminShopResponseDTO;
import org.zerp.sale.dto.adminshop.AdminShopUpdateRequestDTO;
import org.zerp.sale.permission.AdminShopPermissionEvaluator;
import org.zerp.sale.repository.ShopRepository;
import org.zerp.sale.repository.TenantRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Log4j2
@RequiredArgsConstructor
public class AdminShopService implements IResourceService<
        AdminShopResponseDTO,
        AdminShopResponseDTO,
        AdminShopCreateRequestDTO,
        AdminShopUpdateRequestDTO,
        UUID> {
    private static final int SHOP_NAME_MAX_LENGTH = 255;

    private final ShopRepository shopRepository;
    private final TenantRepository tenantRepository;
    private final AdminShopPermissionEvaluator permissionEvaluator;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final FilterRefiner filterRefiner;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminShopResponseDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        UUID userId = resolveCurrentUserId();

        Specification<Shop> spec = permissionEvaluator.filterRead(userId)
                .and(filterRefiner.refinedOrBadRequest(filters, Shop.class));

        try {
            return shopRepository.findAll(spec, pageable).map(this::toResponse);
        } catch (DataAccessException e) {
            if (e.getCause() instanceof FilterError.Runtime fe) {
                log.warn("Filter error while processing shop filters {}: {}", filters, fe.getMessage(), e);
                throw FilterErrorUtils.toResponseStatusException(fe.getError());
            }
            log.error("Unexpected error while processing shop filters {}: {}", filters, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred: " + e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            log.error("Invalid shop filter parameters {}: {}", filters, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter parameters: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminShopResponseDTO> findAllById(List<UUID> ids) {
        UUID userId = resolveCurrentUserId();
        List<AdminShopResponseDTO> result = new ArrayList<>();

        Map<UUID, Shop> shopsById = new HashMap<>();
        shopRepository.findAllById(ids).forEach(shop -> shopsById.put(shop.getId(), shop));

        for (UUID id : ids) {
            Shop shop = shopsById.get(id);
            if (shop != null && permissionEvaluator.canRead(userId, shop)) {
                result.add(toResponse(shop));
            }
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminShopResponseDTO findById(UUID id) {
        UUID userId = resolveCurrentUserId();

        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));

        if (!permissionEvaluator.canRead(userId, shop)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Shop");
        }

        return toResponse(shop);
    }

    @Override
    @Transactional
    public AdminShopResponseDTO create(AdminShopCreateRequestDTO data) {
        UUID userId = resolveCurrentUserId();
        validateCreateRequest(data);

        UUID tenantId = data.getTenantId();
        if (!permissionEvaluator.canCreate(userId, tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Shop");
        }

        ensureTenantExistsOrNotFound(tenantId);
        String normalizedName = normalizeShopNameOrBadRequest(data.getName());
        ensureShopNameUniqueOrConflict(tenantId, normalizedName);

        Shop shop = new Shop();
        shop.setTenantId(tenantId);
        applyCreateFields(shop, data);

        return toResponse(saveShopOrThrow(shop));
    }

    @Override
    @Transactional
    public AdminShopResponseDTO patch(UUID id, Map<String, Object> fields) {
        UUID userId = resolveCurrentUserId();

        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));

        if (!permissionEvaluator.canPatch(userId, shop.getTenantId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch Shop");
        }

        boolean hasNameUpdate = fields.containsKey("name");
        applyPatchFields(shop, fields);

        String normalizedName = normalizeShopNameOrBadRequest(shop.getName());
        shop.setName(normalizedName);

        if (hasNameUpdate) {
            ensureShopNameUniqueOrConflict(shop.getTenantId(), normalizedName, shop.getId());
        }

        return toResponse(saveShopOrThrow(shop));
    }

    @Override
    @Transactional
    public AdminShopResponseDTO update(UUID id, AdminShopUpdateRequestDTO data) {
        UUID userId = resolveCurrentUserId();
        validateUpdateRequest(data);

        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));

        if (!permissionEvaluator.canUpdate(userId, shop.getTenantId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Shop");
        }

        String normalizedName = normalizeShopNameOrBadRequest(data.getName());
        ensureShopNameUniqueOrConflict(shop.getTenantId(), normalizedName, shop.getId());
        applyUpdateFields(shop, data);

        return toResponse(saveShopOrThrow(shop));
    }

    @Override
    @Transactional
    public List<UUID> patchMany(List<UUID> ids, Map<String, Object> fields) {
        List<UUID> updated = new ArrayList<>();
        for (UUID id : ids) {
            try {
                patch(id, fields);
                updated.add(id);
            } catch (ResponseStatusException e) {
                log.debug("Skipping patch for shop id {}", id, e);
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID id) {
        UUID userId = resolveCurrentUserId();

        Shop shop = shopRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));

        if (!permissionEvaluator.canDelete(userId, shop.getTenantId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete Shop");
        }

        shopRepository.delete(shop);
    }

    @Override
    @Transactional
    public List<UUID> deleteMany(List<UUID> ids) {
        List<UUID> deleted = new ArrayList<>();
        for (UUID id : ids) {
            try {
                deleteById(id);
                deleted.add(id);
            } catch (ResponseStatusException e) {
                log.debug("Skipping delete for shop id {}", id, e);
            }
        }
        return deleted;
    }

    @Transactional(readOnly = true)
    public AdminShopNameCheckResponseDTO isShopNameAvailable(UUID tenantId, String name, UUID shopId) {
        if (tenantId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tenantId is required");
        }

        UUID userId = resolveCurrentUserId();
        if (!permissionEvaluator.canCreate(userId, tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to manage Shop");
        }

        ensureTenantExistsOrNotFound(tenantId);
        String normalizedName = normalizeShopNameOrBadRequest(name);

        boolean exists;
        if (shopId == null) {
            exists = shopRepository.existsByTenantIdAndNameIgnoreCase(tenantId, normalizedName);
        } else {
            exists = shopRepository.existsByTenantIdAndNameIgnoreCaseAndIdNot(tenantId, normalizedName, shopId);
        }

        return AdminShopNameCheckResponseDTO.builder()
                .tenantId(tenantId)
                .name(normalizedName)
                .available(!exists)
                .build();
    }

    private UUID resolveCurrentUserId() {
        return currentUserIdResolver.resolve();
    }

    private void validateCreateRequest(AdminShopCreateRequestDTO data) {
        if (data == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request cannot be null");
        }
        if (data.getTenantId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tenantId is required");
        }
        normalizeShopNameOrBadRequest(data.getName());
    }

    private void validateUpdateRequest(AdminShopUpdateRequestDTO data) {
        if (data == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request cannot be null");
        }
        normalizeShopNameOrBadRequest(data.getName());
    }

    private void ensureTenantExistsOrNotFound(UUID tenantId) {
        if (!tenantRepository.existsById(tenantId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tenant not found");
        }
    }

    private void applyCreateFields(Shop shop, AdminShopCreateRequestDTO data) {
        shop.setName(normalizeShopNameOrBadRequest(data.getName()));
        shop.setDescription(normalizeNullable(data.getDescription()));
        shop.setImageId(normalizeNullable(data.getImageId()));
        shop.setAddress(normalizeNullable(data.getAddress()));
        shop.setCity(normalizeNullable(data.getCity()));
        shop.setState(normalizeNullable(data.getState()));
        shop.setCountry(normalizeNullable(data.getCountry()));
        shop.setPostalCode(normalizeNullable(data.getPostalCode()));
        shop.setPhone(normalizeNullable(data.getPhone()));
        shop.setEmail(normalizeNullable(data.getEmail()));
        shop.setWebsite(normalizeNullable(data.getWebsite()));
    }

    private void applyUpdateFields(Shop shop, AdminShopUpdateRequestDTO data) {
        shop.setName(normalizeShopNameOrBadRequest(data.getName()));
        shop.setDescription(normalizeNullable(data.getDescription()));
        shop.setImageId(normalizeNullable(data.getImageId()));
        shop.setAddress(normalizeNullable(data.getAddress()));
        shop.setCity(normalizeNullable(data.getCity()));
        shop.setState(normalizeNullable(data.getState()));
        shop.setCountry(normalizeNullable(data.getCountry()));
        shop.setPostalCode(normalizeNullable(data.getPostalCode()));
        shop.setPhone(normalizeNullable(data.getPhone()));
        shop.setEmail(normalizeNullable(data.getEmail()));
        shop.setWebsite(normalizeNullable(data.getWebsite()));
    }

    private void applyPatchFields(Shop shop, Map<String, Object> fields) {
        if (fields.containsKey("name")) shop.setName(normalizeNullable(stringValueOrNull(fields.get("name"))));
        if (fields.containsKey("description")) shop.setDescription(normalizeNullable(stringValueOrNull(fields.get("description"))));
        if (fields.containsKey("imageId")) shop.setImageId(normalizeNullable(stringValueOrNull(fields.get("imageId"))));
        if (fields.containsKey("address")) shop.setAddress(normalizeNullable(stringValueOrNull(fields.get("address"))));
        if (fields.containsKey("city")) shop.setCity(normalizeNullable(stringValueOrNull(fields.get("city"))));
        if (fields.containsKey("state")) shop.setState(normalizeNullable(stringValueOrNull(fields.get("state"))));
        if (fields.containsKey("country")) shop.setCountry(normalizeNullable(stringValueOrNull(fields.get("country"))));
        if (fields.containsKey("postalCode")) shop.setPostalCode(normalizeNullable(stringValueOrNull(fields.get("postalCode"))));
        if (fields.containsKey("phone")) shop.setPhone(normalizeNullable(stringValueOrNull(fields.get("phone"))));
        if (fields.containsKey("email")) shop.setEmail(normalizeNullable(stringValueOrNull(fields.get("email"))));
        if (fields.containsKey("website")) shop.setWebsite(normalizeNullable(stringValueOrNull(fields.get("website"))));
    }

    private String normalizeShopNameOrBadRequest(String value) {
        String normalized = normalizeNullable(value);
        if (normalized == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
        }
        if (normalized.length() > SHOP_NAME_MAX_LENGTH) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "name must be at most " + SHOP_NAME_MAX_LENGTH + " characters"
            );
        }
        return normalized;
    }

    private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String stringValueOrNull(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private void ensureShopNameUniqueOrConflict(UUID tenantId, String normalizedName) {
        if (shopRepository.existsByTenantIdAndNameIgnoreCase(tenantId, normalizedName)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Shop name already exists for this tenant");
        }
    }

    private void ensureShopNameUniqueOrConflict(UUID tenantId, String normalizedName, UUID shopId) {
        if (shopRepository.existsByTenantIdAndNameIgnoreCaseAndIdNot(tenantId, normalizedName, shopId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Shop name already exists for this tenant");
        }
    }

    private Shop saveShopOrThrow(Shop shop) {
        try {
            return shopRepository.save(shop);
        } catch (DataIntegrityViolationException e) {
            if (isUniqueViolation(e)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Shop name already exists for this tenant", e);
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Shop save failed due to invalid data", e);
        }
    }

    private boolean isUniqueViolation(DataIntegrityViolationException exception) {
        return hasSqlState(exception, "23505");
    }

    private boolean hasSqlState(Throwable throwable, String sqlState) {
        Throwable current = throwable;
        while (current != null) {
            if (current instanceof java.sql.SQLException sqlException
                    && sqlState.equals(sqlException.getSQLState())) {
                return true;
            }
            current = current.getCause();
        }
        return false;
    }

    private AdminShopResponseDTO toResponse(Shop shop) {
        AdminShopResponseDTO dto = new AdminShopResponseDTO();
        dto.setId(shop.getId());
        dto.setTenantId(shop.getTenantId());
        Tenant tenant = shop.getTenant();
        dto.setTenantName(tenant != null ? tenant.getName() : null);
        dto.setName(shop.getName());
        dto.setDescription(shop.getDescription());
        dto.setImageId(shop.getImageId());
        dto.setAddress(shop.getAddress());
        dto.setCity(shop.getCity());
        dto.setState(shop.getState());
        dto.setCountry(shop.getCountry());
        dto.setPostalCode(shop.getPostalCode());
        dto.setPhone(shop.getPhone());
        dto.setEmail(shop.getEmail());
        dto.setWebsite(shop.getWebsite());
        return dto;
    }
}
