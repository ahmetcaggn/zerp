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
import org.zerp.common.entity.sale.Menu;
import org.zerp.common.entity.sale.MenuCategory;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.menucategory.MenuCategoryCreateDTO;
import org.zerp.sale.dto.menucategory.MenuCategoryDTO;
import org.zerp.sale.dto.menucategory.MenuCategoryUpdateDTO;
import org.zerp.sale.mapper.MenuCategoryMapper;
import org.zerp.sale.permission.MenuCategoryPermissionEvaluator;
import org.zerp.sale.repository.MenuCategoryRepository;
import org.zerp.sale.repository.MenuRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class MenuCategoryService implements
        IResourceService<MenuCategoryDTO, MenuCategoryDTO, MenuCategoryCreateDTO, MenuCategoryUpdateDTO, UUID> {
    private final MenuCategoryPermissionEvaluator permissionEvaluator;
    private final MenuCategoryRepository repository;
    private final MenuRepository menuRepository;
    private final MenuCategoryMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final FilterRefiner filterRefiner;

    @Override
    @Transactional(readOnly = true)
    public Page<MenuCategoryDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.trace("Finding MenuCategories with filters: {}", filters);
        UUID userId = currentUserIdResolver.resolve();
        Specification<MenuCategory> spec = filterRefiner.refinedOrBadRequest(filters, MenuCategory.class);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<MenuCategoryDTO> results = repository.findAll(spec, pageable).map(mapper::toDTO);
        log.debug("Found {} MenuCategories", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuCategoryDTO> findAllById(List<UUID> uuids) {
        UUID userId = currentUserIdResolver.resolve();
        List<MenuCategoryDTO> results = new ArrayList<>();
        for (UUID id : uuids) {
            repository.findById(id).ifPresent(category -> {
                if (permissionEvaluator.canRead(userId, category)) {
                    results.add(mapper.toDTO(category));
                }
            });
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public MenuCategoryDTO findById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        MenuCategory category = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuCategory not found"));
        if (!permissionEvaluator.canRead(userId, category)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read MenuCategory");
        }
        return mapper.toDTO(category);
    }

    @Override
    @Transactional
    public MenuCategoryDTO create(MenuCategoryCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        Menu menu = menuRepository.findById(data.getMenuId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.BAD_REQUEST, "Menu not found"));
        UUID tenantId = menu.getTenantId();

        if (!permissionEvaluator.canCreate(userId, menu)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create MenuCategory");
        }
        MenuCategory category = mapper.toEntity(data);
        category.setMenu(menu);
        category.setTenantId(tenantId);
        MenuCategory saved = repository.save(category);
        log.info("Created MenuCategory with id: {}", saved.getId());
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public MenuCategoryDTO patch(UUID uuid, Map<String, Object> data) {
        UUID userId = currentUserIdResolver.resolve();
        MenuCategory category = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuCategory not found"));
        if (!permissionEvaluator.canPatch(userId, category)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch MenuCategory");
        }
        applyFieldUpdates(category, data);
        MenuCategory updated = repository.save(category);
        log.info("Patched MenuCategory with id: {}", uuid);
        return mapper.toDTO(updated);
    }

    @Override
    @Transactional
    public MenuCategoryDTO update(UUID uuid, MenuCategoryUpdateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        MenuCategory category = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuCategory not found"));
        if (!permissionEvaluator.canUpdate(userId, category)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update MenuCategory");
        }
        mapper.updateEntityFromDTO(data, category);
        MenuCategory updated = repository.save(category);
        log.info("Updated MenuCategory with id: {}", uuid);
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
                log.debug("Failed to patch MenuCategory with id: {}", uuid, e);
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        MenuCategory category = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "MenuCategory not found"));
        if (!permissionEvaluator.canDelete(userId, category)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete MenuCategory");
        }
        repository.delete(category);
        log.info("Deleted MenuCategory with id: {}", uuid);
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
                log.debug("Failed to delete MenuCategory with id: {}", uuid, e);
            }
        }
        return deleted;
    }

    private void applyFieldUpdates(MenuCategory category, Map<String, Object> fields) {
        if (fields.containsKey("name")) category.setName((String) fields.get("name"));
        if (fields.containsKey("description")) category.setDescription((String) fields.get("description"));
    }
}
