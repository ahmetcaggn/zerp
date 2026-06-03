package org.zerp.sale.service;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.dto.user.ImageSize;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.MenuLanguage;
import org.zerp.common.entity.sale.ShopCuisineCategory;
import org.zerp.common.entity.sale.ShopWorkingHour;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.s3repository.dto.S3FileDTO;
import org.zerp.s3repository.repository.S3ImageRepository;
import org.zerp.sale.dto.shop.ShopImageContentResponseDTO;
import org.zerp.sale.dto.shop.ShopDTO;
import org.zerp.sale.dto.shop.ShopImageUploadResponseDTO;
import org.zerp.sale.dto.shop.ShopWorkingHourDTO;
import org.zerp.sale.feign.ThumborFeignClient;
import org.zerp.sale.permission.ShopPermissionEvaluator;
import org.zerp.sale.repository.ShopRepository;

import java.io.IOException;
import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.Collection;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class ShopService implements IResourceService<ShopDTO, ShopDTO, Void, Void, UUID> {
    private static final int SHOP_NAME_MAX_LENGTH = 255;
    private static final String DEFAULT_CONTENT_TYPE = MediaType.APPLICATION_OCTET_STREAM_VALUE;

    private final ShopPermissionEvaluator permissionEvaluator;
    private final ShopRepository repository;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final FilterRefiner filterRefiner;
    private final S3ImageRepository s3ImageRepository;
    private final ThumborFeignClient thumborFeignClient;

    public static final String SHOP_IMAGE_FOLDER = "saleShops";

    @Override
    @Transactional(readOnly = true)
    public Page<ShopDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.trace("Finding Shops with filters: {}", filters);
        UUID userId = currentUserIdResolver.resolve();
        Specification<Shop> spec = filterRefiner.refinedOrBadRequest(filters, Shop.class);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<ShopDTO> results = repository.findAll(spec, pageable).map(this::toDTO);
        log.debug("Found {} Shops", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShopDTO> findAllById(List<UUID> ids) {
        UUID userId = currentUserIdResolver.resolve();
        return repository.findAllById(ids).stream()
                .filter(shop -> permissionEvaluator.canRead(userId, shop))
                .map(this::toDTO)
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

        return toDTO(shop);
    }

    @Override
    public ShopDTO create(Void data) {
        throw new UnsupportedOperationException("Create operation is not supported for Shop resource");
    }

    @Override
    @Transactional
    public ShopDTO patch(UUID id, Map<String, Object> data) {
        UUID userId = currentUserIdResolver.resolve();
        Shop shop = repository.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));

        if (!permissionEvaluator.canPatch(userId, shop)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch Shop");
        }

        boolean hasNameUpdate = data != null && data.containsKey("name");
        applyFieldUpdates(shop, data);

        String normalizedName = normalizeShopNameOrBadRequest(shop.getName());
        shop.setName(normalizedName);

        if (hasNameUpdate) {
            ensureShopNameUniqueOrConflict(shop.getTenantId(), normalizedName, shop.getId());
        }

        Shop updated = repository.save(shop);
        return toDTO(updated);
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

    @Transactional
    public ShopImageUploadResponseDTO uploadShopImage(UUID shopId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file is required");
        }

        UUID userId = currentUserIdResolver.resolve();
        Shop shop = repository.findById(shopId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));

        if (!permissionEvaluator.canPatch(userId, shop)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch Shop");
        }

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read image file", e);
        }

        S3FileDTO uploadedFile;
        try {
            uploadedFile = s3ImageRepository.create(SHOP_IMAGE_FOLDER, fileBytes);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }

        shop.setImageId(uploadedFile.getFileName());
        repository.save(shop);

        return new ShopImageUploadResponseDTO(
                uploadedFile.getFileName(),
                resolveContentType(file),
                resolveOriginalFileName(file, uploadedFile.getFileName())
        );
    }

    @Transactional(readOnly = true)
    public ShopImageContentResponseDTO getShopImage(UUID shopId, ImageSize imageSize) {
        UUID userId = currentUserIdResolver.resolve();
        Shop shop = repository.findById(shopId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));

        if (!permissionEvaluator.canRead(userId, shop)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Shop");
        }

        String imageId = normalizeNullable(shop.getImageId());
        if (imageId == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop image not found");
        }

        ImageSize resolvedSize = imageSize == null ? ImageSize.SMALL : imageSize;
        ResponseEntity<byte[]> thumborResponse;
        try {
            thumborResponse = thumborFeignClient.getShopImage(imageId, resolvedSize);
        } catch (FeignException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found: " + imageId, e);
        } catch (FeignException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to fetch image from thumbor", e);
        }

        if (!thumborResponse.getStatusCode().is2xxSuccessful() || thumborResponse.getBody() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found: " + imageId);
        }

        MediaType contentType = thumborResponse.getHeaders().getContentType();
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return new ShopImageContentResponseDTO(new ByteArrayResource(thumborResponse.getBody()), contentType);
    }

    private void applyFieldUpdates(Shop shop, Map<String, Object> fields) {
        if (fields == null || fields.isEmpty()) {
            return;
        }

        if (fields.containsKey("name")) {
            shop.setName(normalizeNullable(stringValueOrNull(fields.get("name"))));
        }
        if (fields.containsKey("description")) {
            shop.setDescription(normalizeNullable(stringValueOrNull(fields.get("description"))));
        }
        if (fields.containsKey("imageId")) {
            shop.setImageId(normalizeNullable(stringValueOrNull(fields.get("imageId"))));
        }
        if (fields.containsKey("address")) {
            shop.setAddress(normalizeNullable(stringValueOrNull(fields.get("address"))));
        }
        if (fields.containsKey("city")) {
            shop.setCity(normalizeNullable(stringValueOrNull(fields.get("city"))));
        }
        if (fields.containsKey("state")) {
            shop.setState(normalizeNullable(stringValueOrNull(fields.get("state"))));
        }
        if (fields.containsKey("country")) {
            shop.setCountry(normalizeNullable(stringValueOrNull(fields.get("country"))));
        }
        if (fields.containsKey("postalCode")) {
            shop.setPostalCode(normalizeNullable(stringValueOrNull(fields.get("postalCode"))));
        }
        if (fields.containsKey("phone")) {
            shop.setPhone(normalizeNullable(stringValueOrNull(fields.get("phone"))));
        }
        if (fields.containsKey("email")) {
            shop.setEmail(normalizeNullable(stringValueOrNull(fields.get("email"))));
        }
        if (fields.containsKey("website")) {
            shop.setWebsite(normalizeNullable(stringValueOrNull(fields.get("website"))));
        }
        if (fields.containsKey("latitude")) {
            shop.setLatitude(normalizeLatitude(doubleValueOrNull(fields.get("latitude"))));
        }
        if (fields.containsKey("longitude")) {
            shop.setLongitude(normalizeLongitude(doubleValueOrNull(fields.get("longitude"))));
        }
        if (fields.containsKey("cuisineCategories")) {
            shop.setCuisineCategories(resolveCuisineCategories(fields.get("cuisineCategories")));
        }
        if (fields.containsKey("workingHours")) {
            shop.setWorkingHours(resolveWorkingHours(fields.get("workingHours")));
        }
        if (fields.containsKey("defaultMenuLanguage")) {
            shop.setDefaultMenuLanguage(resolveMenuLanguage(fields.get("defaultMenuLanguage")));
        }
    }

    private ShopDTO toDTO(Shop shop) {
        ShopDTO dto = new ShopDTO();
        dto.setId(shop.getId());
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
        dto.setLatitude(shop.getLatitude());
        dto.setLongitude(shop.getLongitude());
        dto.setCuisineCategories(shop.getCuisineCategories() == null ? Set.of() : Set.copyOf(shop.getCuisineCategories()));
        dto.setWorkingHours(toWorkingHourDTOs(shop.getWorkingHours()));
        dto.setDefaultMenuLanguage(shop.getDefaultMenuLanguage());
        dto.setTenantId(shop.getTenantId());
        return dto;
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

    private Double doubleValueOrNull(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Number number) {
            return number.doubleValue();
        }

        String raw = String.valueOf(value).trim();
        if (raw.isEmpty()) {
            return null;
        }

        try {
            return Double.parseDouble(raw);
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid numeric value: " + value, ex);
        }
    }

    private Double normalizeLatitude(Double value) {
        return normalizeCoordinate(value, "latitude", -90d, 90d);
    }

    private Double normalizeLongitude(Double value) {
        return normalizeCoordinate(value, "longitude", -180d, 180d);
    }

    private Double normalizeCoordinate(Double value, String fieldName, double min, double max) {
        if (value == null) {
            return null;
        }
        if (value.isNaN() || value.isInfinite() || value < min || value > max) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    fieldName + " must be between " + min + " and " + max
            );
        }
        return value;
    }

    private void ensureShopNameUniqueOrConflict(UUID tenantId, String normalizedName, UUID shopId) {
        if (repository.existsByTenantIdAndNameIgnoreCaseAndIdNot(tenantId, normalizedName, shopId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Shop name already exists for this tenant");
        }
    }

    private MenuLanguage resolveMenuLanguage(Object rawValue) {
        switch (rawValue) {
            case null -> {
                return MenuLanguage.TR;
            }
            case MenuLanguage language -> {
                return language;
            }
            case String languageValue -> {
                try {
                    return MenuLanguage.valueOf(languageValue.trim().toUpperCase(Locale.ROOT));
                } catch (IllegalArgumentException ignored) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported menu language: " + rawValue);
                }
            }
            default -> {
            }
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported menu language: " + rawValue);
    }

    private Set<ShopCuisineCategory> resolveCuisineCategories(Object rawValue) {
        if (rawValue == null) {
            return new LinkedHashSet<>();
        }

        if (rawValue instanceof Collection<?> values) {
            Set<ShopCuisineCategory> resolved = new LinkedHashSet<>();
            for (Object value : values) {
                ShopCuisineCategory category = resolveCuisineCategory(value);
                if (category != null) {
                    resolved.add(category);
                }
            }
            return resolved;
        }

        if (rawValue instanceof String rawString) {
            String normalized = rawString.trim();
            if (normalized.isEmpty()) {
                return new LinkedHashSet<>();
            }

            Set<ShopCuisineCategory> resolved = new LinkedHashSet<>();
            for (String part : normalized.split(",")) {
                ShopCuisineCategory category = resolveCuisineCategory(part);
                if (category != null) {
                    resolved.add(category);
                }
            }
            return resolved;
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "cuisineCategories must be an array");
    }

    private ShopCuisineCategory resolveCuisineCategory(Object rawValue) {
        if (rawValue == null) {
            return null;
        }
        if (rawValue instanceof ShopCuisineCategory category) {
            return category;
        }

        String normalized = String.valueOf(rawValue).trim();
        if (normalized.isEmpty()) {
            return null;
        }

        try {
            return ShopCuisineCategory.valueOf(normalized.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ignored) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported cuisine category: " + rawValue);
        }
    }

    private Set<ShopWorkingHour> resolveWorkingHours(Object rawValue) {
        if (rawValue == null) {
            return new LinkedHashSet<>();
        }
        if (!(rawValue instanceof Collection<?> values)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "workingHours must be an array");
        }

        Set<DayOfWeek> seenDays = EnumSet.noneOf(DayOfWeek.class);
        Set<ShopWorkingHour> resolved = new LinkedHashSet<>();
        for (Object value : values) {
            if (!(value instanceof Map<?, ?> item)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "workingHours items must be objects");
            }

            DayOfWeek dayOfWeek = resolveDayOfWeek(item.get("dayOfWeek"));
            if (!seenDays.add(dayOfWeek)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Duplicate workingHours day: " + dayOfWeek);
            }

            LocalTime opensAt = resolveLocalTime(item.get("opensAt"), "opensAt");
            LocalTime closesAt = resolveLocalTime(item.get("closesAt"), "closesAt");
            boolean openAllDay = booleanValueOrFalse(item.get("openAllDay"));
            if (!openAllDay && !opensAt.isBefore(closesAt)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "opensAt must be before closesAt");
            }

            ShopWorkingHour workingHour = new ShopWorkingHour();
            workingHour.setDayOfWeek(dayOfWeek);
            workingHour.setOpensAt(opensAt);
            workingHour.setClosesAt(closesAt);
            workingHour.setOpenAllDay(openAllDay);
            resolved.add(workingHour);
        }

        if (seenDays.size() != DayOfWeek.values().length) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "workingHours must include all 7 days");
        }

        return resolved;
    }

    private DayOfWeek resolveDayOfWeek(Object rawValue) {
        if (rawValue instanceof DayOfWeek dayOfWeek) {
            return dayOfWeek;
        }

        String normalized = normalizeNullable(stringValueOrNull(rawValue));
        if (normalized == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "dayOfWeek is required");
        }

        try {
            return DayOfWeek.valueOf(normalized.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ignored) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported dayOfWeek: " + rawValue);
        }
    }

    private LocalTime resolveLocalTime(Object rawValue, String fieldName) {
        if (rawValue instanceof LocalTime localTime) {
            return localTime;
        }

        String normalized = normalizeNullable(stringValueOrNull(rawValue));
        if (normalized == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " is required");
        }

        try {
            return LocalTime.parse(normalized);
        } catch (DateTimeParseException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, fieldName + " must be HH:mm", ex);
        }
    }

    private List<ShopWorkingHourDTO> toWorkingHourDTOs(Set<ShopWorkingHour> workingHours) {
        if (workingHours == null || workingHours.isEmpty()) {
            return List.of();
        }

        return workingHours.stream()
                .sorted(Comparator.comparing(ShopWorkingHour::getDayOfWeek))
                .map(this::toWorkingHourDTO)
                .toList();
    }

    private ShopWorkingHourDTO toWorkingHourDTO(ShopWorkingHour workingHour) {
        ShopWorkingHourDTO dto = new ShopWorkingHourDTO();
        dto.setDayOfWeek(workingHour.getDayOfWeek());
        dto.setOpensAt(workingHour.getOpensAt());
        dto.setClosesAt(workingHour.getClosesAt());
        dto.setOpenAllDay(workingHour.isOpenAllDay());
        return dto;
    }

    private boolean booleanValueOrFalse(Object value) {
        if (value instanceof Boolean bool) {
            return bool;
        }
        if (value == null) {
            return false;
        }

        return Boolean.parseBoolean(String.valueOf(value));
    }

    private String resolveContentType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            return DEFAULT_CONTENT_TYPE;
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
