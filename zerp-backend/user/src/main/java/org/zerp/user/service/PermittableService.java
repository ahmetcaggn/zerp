package org.zerp.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.permission.entity.Permittable;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.repository.PermittableRepository;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.user.dto.permittable.PermittableResponseDTO;
import org.zerp.user.permission.PermittablePermissionEvaluator;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class PermittableService
        implements IResourceService<PermittableResponseDTO, PermittableResponseDTO, Void, Void, UUID> {
    private final PermittableRepository permittableRepository;
    private final FilterRefiner filterRefiner;
    private final PermittablePermissionEvaluator permissionEvaluator;
    private final CurrentUserIdResolver currentUserIdResolver;

    @Override
    public Page<PermittableResponseDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        UUID userId = currentUserIdResolver.resolve();
        String targetTypeStr = filters.get("targetType");
        if (targetTypeStr == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "targetType filter is required");
        }

        PermissionTargetType targetType;
        try {
            targetType = PermissionTargetType.valueOf(targetTypeStr);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid targetType: " + targetTypeStr);
        }

        // Remove targetType from filters before passing to FilterRefiner to avoid mapping errors
        Map<String, String> entityFilters = new HashMap<>(filters);
        entityFilters.remove("targetType");

        // Handle parentId filter if present
        if (entityFilters.containsKey("parentId")) {
            String parentId = entityFilters.remove("parentId");
            if (targetType.parentIdFilter != null) {
                entityFilters.put(targetType.parentIdFilter, parentId);
            }
        }

        Class<?> entityClass = permittableRepository.getTargetTypeToEntityClass().get(targetType);
        if (entityClass == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No entity mapped to targetType: " + targetType);
        }

        Page<Permittable> page = fetchWithSecurity(targetType, entityClass, entityFilters, userId, pageable);

        List<PermittableResponseDTO> dtos = page.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    private <T> Page<Permittable> fetchWithSecurity(PermissionTargetType targetType, Class<T> entityClass, Map<String, String> filters, UUID userId, Pageable pageable) {
        Specification<T> spec = filterRefiner.refinedOrBadRequest(filters, entityClass);
        spec = spec.and(permissionEvaluator.filterRead(userId));
        return permittableRepository.findAllByTargetType(targetType, spec, pageable);
    }

    @Override
    public List<PermittableResponseDTO> findAllById(List<UUID> ids) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public PermittableResponseDTO findById(UUID id) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public PermittableResponseDTO create(Void data) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public PermittableResponseDTO patch(UUID id, Map<String, Object> fields) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public PermittableResponseDTO update(UUID id, Void data) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public List<UUID> patchMany(List<UUID> ids, Map<String, Object> fields) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public void deleteById(UUID id) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    @Override
    public List<UUID> deleteMany(List<UUID> ids) {
        throw new ResponseStatusException(HttpStatus.METHOD_NOT_ALLOWED);
    }

    private PermittableResponseDTO toDTO(Permittable permittable) {
        if (permittable == null) return null;
        return PermittableResponseDTO.builder()
                .id(permittable.getId())
                .title(permittable.getTitle())
                .targetType(PermissionTargetType.fromType(permittable))
                .build();
    }
}
