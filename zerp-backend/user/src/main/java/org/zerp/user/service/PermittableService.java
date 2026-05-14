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
import org.zerp.user.dto.permittable.PermittableResponseDTO;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class PermittableService
        implements IResourceService<PermittableResponseDTO, PermittableResponseDTO, Void, Void, UUID> {
    private final PermittableRepository permittableRepository;
    private final FilterRefiner filterRefiner;

    @Override
    public Page<PermittableResponseDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
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
            String parentField = resolveParentField(targetType);
            if (parentField != null) {
                entityFilters.put(parentField, parentId);
            }
        }

        Class<?> entityClass = permittableRepository.getTargetTypeToEntityClass().get(targetType);
        if (entityClass == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No entity mapped to targetType: " + targetType);
        }

        Specification<?> spec = filterRefiner.refinedOrBadRequest(entityFilters, entityClass);

        Page<Permittable> page = permittableRepository.findAllByTargetType(targetType, spec, pageable);

        List<PermittableResponseDTO> dtos = page.getContent().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, page.getTotalElements());
    }

    private String resolveParentField(PermissionTargetType targetType) {
        return switch (targetType) {
            case USER, EMPLOYEE, TICKET, TEAM, SHOP -> "tenantId";
            case TICKET_HISTORY, TICKET_COMMENT, TICKET_ASSIGNMENT, TICKET_ATTACHMENT, TICKET_SLA_TRACKING, TICKET_WATCHER -> "ticket.id";
            case TEAM_MEMBER -> "team.id";
            case SHOP_TABLE, STOCK_COUNT, STOCK_RESOURCE, PRODUCT, MENU -> "shop.id";
            case STOCK_MOVEMENT -> "stockResource.id";
            case PRODUCT_RECIPE, PRODUCT_EXTRA_OPTION -> "product.id";
            case MENU_CATEGORY -> "menu.id";
            case MENU_ITEM -> "menuCategory.id";
            default -> null;
        };
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
                .targetType(PermissionTargetType.fromType(permittable.getClass()))
                .build();
    }
}
