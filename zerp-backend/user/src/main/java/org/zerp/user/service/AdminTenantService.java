package org.zerp.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
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
import org.zerp.common.entity.Tenant;
import org.zerp.common.error.filter.FilterError;
import org.zerp.common.error.filter.FilterErrorUtils;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.user.dto.tenant.TenantCreateRequestDTO;
import org.zerp.user.dto.tenant.TenantImageContentResponseDTO;
import org.zerp.user.dto.tenant.TenantImageUploadResponseDTO;
import org.zerp.user.dto.tenant.TenantNameCheckResponseDTO;
import org.zerp.user.dto.tenant.TenantResponseDTO;
import org.zerp.user.dto.tenant.TenantUpdateRequestDTO;
import org.zerp.user.feign.ThumborFeignClient;
import org.zerp.user.permission.AdminTenantPermissionEvaluator;
import org.zerp.user.repository.TenantRepository;
import org.zerp.s3repository.dto.S3FileDTO;
import org.zerp.s3repository.repository.S3ImageRepository;
import feign.FeignException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
@Log4j2
@RequiredArgsConstructor
public class AdminTenantService implements IResourceService<
        TenantResponseDTO,
        TenantResponseDTO,
        TenantCreateRequestDTO,
        TenantUpdateRequestDTO,
        UUID> {
    private static final int TENANT_NAME_MAX_LENGTH = 255;

    private final TenantRepository tenantRepository;
    private final AdminTenantPermissionEvaluator permissionEvaluator;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;
    private final FilterRefiner filterRefiner;
    private final S3ImageRepository s3ImageRepository;
    private final ThumborFeignClient thumborFeignClient;

    @Value("${app.user.tenant-images.folder:tenant-images}")
    private String tenantImageFolder;

    @Override
    @Transactional(readOnly = true)
    public Page<TenantResponseDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        UUID userId = resolveCurrentUserId();
        Specification<Tenant> spec = permissionEvaluator.filterRead(userId)
                .and(filterRefiner.refinedOrBadRequest(filters, Tenant.class));

        try {
            return tenantRepository.findAll(spec, pageable).map(this::toResponse);
        } catch (DataAccessException e) {
            if (e.getCause() instanceof FilterError.Runtime fe) {
                log.warn("Filter error while processing tenant filters {}: {}", filters, fe.getMessage(), e);
                throw FilterErrorUtils.toResponseStatusException(fe.getError());
            }
            log.error("Unexpected error while processing tenant filters {}: {}", filters, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred: " + e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            log.error("Invalid tenant filter parameters {}: {}", filters, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter parameters: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<TenantResponseDTO> findAllById(List<UUID> ids) {
        UUID userId = resolveCurrentUserId();
        List<TenantResponseDTO> result = new ArrayList<>();

        Map<UUID, Tenant> tenantById = new HashMap<>();
        tenantRepository.findAllById(ids).forEach(tenant -> tenantById.put(tenant.getId(), tenant));

        for (UUID id : ids) {
            Tenant tenant = tenantById.get(id);
            if (tenant != null && permissionEvaluator.canRead(userId, tenant.getId())) {
                result.add(toResponse(tenant));
            }
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public TenantResponseDTO findById(UUID id) {
        UUID userId = resolveCurrentUserId();

        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tenant not found"));

        if (!permissionEvaluator.canRead(userId, tenant.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Tenant");
        }

        return toResponse(tenant);
    }

    @Override
    @Transactional
    public TenantResponseDTO create(TenantCreateRequestDTO data) {
        UUID userId = resolveCurrentUserId();
        if (!permissionEvaluator.canCreate(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Tenant");
        }

        validateCreateRequest(data);
        String normalizedName = normalizeTenantNameOrBadRequest(data.getName());
        ensureTenantNameUniqueOrConflict(normalizedName);

        Tenant tenant = new Tenant();
        tenant.setId(UUID.randomUUID());
        applyCreateFields(tenant, data);

        Tenant saved = saveTenantOrThrow(tenant);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public TenantResponseDTO patch(UUID id, Map<String, Object> fields) {
        UUID userId = resolveCurrentUserId();

        Tenant existing = tenantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tenant not found"));

        if (!permissionEvaluator.canPatch(userId, existing.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch Tenant");
        }

        boolean hasNameUpdate = fields.containsKey("name");
        applyPatchFields(existing, fields);
        String normalizedName = normalizeTenantNameOrBadRequest(existing.getName());
        existing.setName(normalizedName);
        if (hasNameUpdate) {
            ensureTenantNameUniqueOrConflict(normalizedName, existing.getId());
        }

        return toResponse(saveTenantOrThrow(existing));
    }

    @Override
    @Transactional
    public TenantResponseDTO update(UUID id, TenantUpdateRequestDTO data) {
        UUID userId = resolveCurrentUserId();

        Tenant existing = tenantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tenant not found"));

        if (!permissionEvaluator.canUpdate(userId, existing.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Tenant");
        }

        validateUpdateRequest(data);
        String normalizedName = normalizeTenantNameOrBadRequest(data.getName());
        ensureTenantNameUniqueOrConflict(normalizedName, existing.getId());
        applyUpdateFields(existing, data);

        return toResponse(saveTenantOrThrow(existing));
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
                log.debug("Skipping patch for tenant id {}", id, e);
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID id) {
        UUID userId = resolveCurrentUserId();

        Tenant existing = tenantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tenant not found"));

        if (!permissionEvaluator.canDelete(userId, existing.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete Tenant");
        }

        tenantRepository.delete(existing);
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
                log.debug("Skipping delete for tenant id {}", id, e);
            }
        }
        return deleted;
    }

    @Transactional
    public TenantImageUploadResponseDTO uploadImage(UUID id, MultipartFile file) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "id is required");
        }
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Image file is required");
        }

        UUID userId = resolveCurrentUserId();
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tenant not found"));
        if (!permissionEvaluator.canUpdate(userId, tenant.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Tenant");
        }

        byte[] fileBytes;
        try {
            fileBytes = file.getBytes();
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to read image file", e);
        }

        String folder = resolveTenantImageFolder();
        S3FileDTO uploadedFile;
        try {
            uploadedFile = s3ImageRepository.create(folder, fileBytes);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }

        String previousImageId = normalizeNullable(tenant.getImageId());
        try {
            tenant.setImageId(uploadedFile.getFileName());
            saveTenantOrThrow(tenant);
        } catch (RuntimeException e) {
            cleanupUploadedImage(folder, uploadedFile.getFileName());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save tenant image", e);
        }

        cleanupPreviousImage(folder, previousImageId, uploadedFile.getFileName());
        return new TenantImageUploadResponseDTO(
                uploadedFile.getFileName(),
                resolveContentType(file),
                resolveOriginalFileName(file, uploadedFile.getFileName())
        );
    }

    @Transactional(readOnly = true)
    public TenantImageContentResponseDTO getImageContent(UUID id) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "id is required");
        }

        UUID userId = resolveCurrentUserId();
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tenant not found"));

        if (!canReadTenantImage(userId, tenant.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Tenant image");
        }

        String imageId = normalizeNullable(tenant.getImageId());
        if (imageId == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tenant image not found");
        }

        ResponseEntity<byte[]> thumborResponse;
        try {
            thumborResponse = thumborFeignClient.getFile(resolveTenantImageFolder(), imageId);
        } catch (FeignException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tenant image not found", e);
        } catch (FeignException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to fetch tenant image", e);
        }

        if (!thumborResponse.getStatusCode().is2xxSuccessful() || thumborResponse.getBody() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tenant image not found");
        }

        MediaType contentType = thumborResponse.getHeaders().getContentType();
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return new TenantImageContentResponseDTO(
                new ByteArrayResource(thumborResponse.getBody()),
                contentType
        );
    }

    private UUID resolveCurrentUserId() {
        return currentUserIdResolver.resolve();
    }

    private void validateCreateRequest(TenantCreateRequestDTO data) {
        if (data == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request cannot be null");
        }
        normalizeTenantNameOrBadRequest(data.getName());
    }

    private void validateUpdateRequest(TenantUpdateRequestDTO data) {
        if (data == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request cannot be null");
        }
        normalizeTenantNameOrBadRequest(data.getName());
    }

    private void applyCreateFields(Tenant tenant, TenantCreateRequestDTO data) {
        tenant.setName(normalizeTenantNameOrBadRequest(data.getName()));
        tenant.setDescription(normalizeNullable(data.getDescription()));
        tenant.setImageId(normalizeNullable(data.getImageId()));
        tenant.setAddress(normalizeNullable(data.getAddress()));
        tenant.setCity(normalizeNullable(data.getCity()));
        tenant.setState(normalizeNullable(data.getState()));
        tenant.setCountry(normalizeNullable(data.getCountry()));
        tenant.setPostalCode(normalizeNullable(data.getPostalCode()));
        tenant.setPhone(normalizeNullable(data.getPhone()));
        tenant.setEmail(normalizeNullable(data.getEmail()));
        tenant.setWebsite(normalizeNullable(data.getWebsite()));
    }

    private void applyUpdateFields(Tenant tenant, TenantUpdateRequestDTO data) {
        tenant.setName(normalizeTenantNameOrBadRequest(data.getName()));
        tenant.setDescription(normalizeNullable(data.getDescription()));
        tenant.setImageId(normalizeNullable(data.getImageId()));
        tenant.setAddress(normalizeNullable(data.getAddress()));
        tenant.setCity(normalizeNullable(data.getCity()));
        tenant.setState(normalizeNullable(data.getState()));
        tenant.setCountry(normalizeNullable(data.getCountry()));
        tenant.setPostalCode(normalizeNullable(data.getPostalCode()));
        tenant.setPhone(normalizeNullable(data.getPhone()));
        tenant.setEmail(normalizeNullable(data.getEmail()));
        tenant.setWebsite(normalizeNullable(data.getWebsite()));
    }

    private void applyPatchFields(Tenant tenant, Map<String, Object> fields) {
        if (fields.containsKey("name")) tenant.setName(normalizeNullable(stringValueOrNull(fields.get("name"))));
        if (fields.containsKey("description")) tenant.setDescription(normalizeNullable(stringValueOrNull(fields.get("description"))));
        if (fields.containsKey("imageId")) tenant.setImageId(normalizeNullable(stringValueOrNull(fields.get("imageId"))));
        if (fields.containsKey("address")) tenant.setAddress(normalizeNullable(stringValueOrNull(fields.get("address"))));
        if (fields.containsKey("city")) tenant.setCity(normalizeNullable(stringValueOrNull(fields.get("city"))));
        if (fields.containsKey("state")) tenant.setState(normalizeNullable(stringValueOrNull(fields.get("state"))));
        if (fields.containsKey("country")) tenant.setCountry(normalizeNullable(stringValueOrNull(fields.get("country"))));
        if (fields.containsKey("postalCode")) tenant.setPostalCode(normalizeNullable(stringValueOrNull(fields.get("postalCode"))));
        if (fields.containsKey("phone")) tenant.setPhone(normalizeNullable(stringValueOrNull(fields.get("phone"))));
        if (fields.containsKey("email")) tenant.setEmail(normalizeNullable(stringValueOrNull(fields.get("email"))));
        if (fields.containsKey("website")) tenant.setWebsite(normalizeNullable(stringValueOrNull(fields.get("website"))));
    }

    private String normalizeTenantNameOrBadRequest(String value) {
        String normalized = normalizeNullable(value);
        if (normalized == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
        }
        if (normalized.length() > TENANT_NAME_MAX_LENGTH) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "name must be at most " + TENANT_NAME_MAX_LENGTH + " characters"
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

    private String resolveTenantImageFolder() {
        return tenantImageFolder == null ? "" : tenantImageFolder.trim();
    }

    private String resolveContentType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            return "application/octet-stream";
        }
        return contentType;
    }

    private String resolveOriginalFileName(MultipartFile file, String fallback) {
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isBlank()) {
            return fallback;
        }
        return originalFileName;
    }

    private boolean canReadTenantImage(UUID userId, UUID tenantId) {
        if (permissionEvaluator.canRead(userId, tenantId)) {
            return true;
        }
        UUID currentTenantId = currentTenantIdResolver.resolve();
        return Objects.equals(currentTenantId, tenantId);
    }

    private void cleanupUploadedImage(String folder, String imageId) {
        try {
            s3ImageRepository.delete(folder, imageId);
        } catch (Exception cleanupEx) {
            log.error("failed to rollback uploaded tenant image with image id {}", imageId, cleanupEx);
        }
    }

    private void cleanupPreviousImage(String folder, String previousImageId, String newImageId) {
        if (previousImageId == null || previousImageId.equals(newImageId)) {
            return;
        }
        try {
            s3ImageRepository.delete(folder, previousImageId);
        } catch (Exception cleanupEx) {
            log.warn("failed to cleanup previous tenant image {}", previousImageId, cleanupEx);
        }
    }

    public TenantNameCheckResponseDTO isTenantNameAvailable(String name) {
        UUID userId = resolveCurrentUserId();
        if (!permissionEvaluator.canCreate(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Tenant");
        }

        String normalizedName = normalizeTenantNameOrBadRequest(name);
        boolean available = !tenantRepository.existsByNameIgnoreCase(normalizedName);
        return TenantNameCheckResponseDTO.builder()
                .name(normalizedName)
                .available(available)
                .build();
    }

    private void ensureTenantNameUniqueOrConflict(String normalizedName) {
        if (tenantRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tenant name already exists");
        }
    }

    private void ensureTenantNameUniqueOrConflict(String normalizedName, UUID currentTenantId) {
        if (tenantRepository.existsByNameIgnoreCaseAndIdNot(normalizedName, currentTenantId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Tenant name already exists");
        }
    }

    private Tenant saveTenantOrThrow(Tenant tenant) {
        try {
            return tenantRepository.save(tenant);
        } catch (DataIntegrityViolationException e) {
            if (isUniqueViolation(e)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Tenant name already exists", e);
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tenant save failed due to invalid data", e);
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

    private TenantResponseDTO toResponse(Tenant tenant) {
        TenantResponseDTO dto = new TenantResponseDTO();
        dto.setId(tenant.getId());
        dto.setName(tenant.getName());
        dto.setDescription(tenant.getDescription());
        dto.setImageId(tenant.getImageId());
        dto.setAddress(tenant.getAddress());
        dto.setCity(tenant.getCity());
        dto.setState(tenant.getState());
        dto.setCountry(tenant.getCountry());
        dto.setPostalCode(tenant.getPostalCode());
        dto.setPhone(tenant.getPhone());
        dto.setEmail(tenant.getEmail());
        dto.setWebsite(tenant.getWebsite());
        return dto;
    }
}
