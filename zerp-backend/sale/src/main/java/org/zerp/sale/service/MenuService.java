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
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.menu.MenuCreateDTO;
import org.zerp.sale.dto.menu.MenuDTO;
import org.zerp.sale.dto.menu.MenuUpdateDTO;
import org.zerp.sale.mapper.MenuMapper;
import org.zerp.sale.permission.MenuPermissionEvaluator;
import org.zerp.sale.repository.MenuRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class MenuService implements
        IResourceService<MenuDTO, MenuDTO, MenuCreateDTO, MenuUpdateDTO, UUID> {
    private final MenuPermissionEvaluator permissionEvaluator;
    private final MenuRepository repository;
    private final MenuMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;
    private final FilterRefiner filterRefiner;

    @Override
    @Transactional(readOnly = true)
    public Page<MenuDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.trace("Finding Menus with filters: {}", filters);
        UUID userId = currentUserIdResolver.resolve();
        Specification<Menu> spec = filterRefiner.refinedOrBadRequest(filters, Menu.class);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<MenuDTO> results = repository.findAll(spec, pageable).map(mapper::toDTO);
        log.debug("Found {} Menus", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuDTO> findAllById(List<UUID> uuids) {
        UUID userId = currentUserIdResolver.resolve();
        List<MenuDTO> results = new ArrayList<>();
        for (UUID id : uuids) {
            repository.findById(id).ifPresent(menu -> {
                if (permissionEvaluator.canRead(userId, menu)) {
                    results.add(mapper.toDTO(menu));
                }
            });
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public MenuDTO findById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        Menu menu = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu not found"));
        if (!permissionEvaluator.canRead(userId, menu)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read Menu");
        }
        return mapper.toDTO(menu);
    }

    @Override
    @Transactional
    public MenuDTO create(MenuCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = currentTenantIdResolver.resolve();
        if (!permissionEvaluator.canCreate(userId, data.getShopId(), tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create Menu");
        }
        Menu menu = mapper.toEntity(data);
        menu.setTenantId(tenantId);
        Menu saved = repository.save(menu);
        log.info("Created Menu with id: {}", saved.getId());
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public MenuDTO patch(UUID uuid, Map<String, Object> data) {
        UUID userId = currentUserIdResolver.resolve();
        Menu menu = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu not found"));
        if (!permissionEvaluator.canPatch(userId, menu)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch Menu");
        }
        applyFieldUpdates(menu, data);
        Menu updated = repository.save(menu);
        log.info("Patched Menu with id: {}", uuid);
        return mapper.toDTO(updated);
    }

    @Override
    @Transactional
    public MenuDTO update(UUID uuid, MenuUpdateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        Menu menu = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu not found"));
        if (!permissionEvaluator.canUpdate(userId, menu)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update Menu");
        }
        mapper.updateEntityFromDTO(data, menu);
        Menu updated = repository.save(menu);
        log.info("Updated Menu with id: {}", uuid);
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
                log.debug("Failed to patch Menu with id: {}", uuid, e);
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        Menu menu = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu not found"));
        if (!permissionEvaluator.canDelete(userId, menu)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete Menu");
        }
        repository.delete(menu);
        log.info("Deleted Menu with id: {}", uuid);
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
                log.debug("Failed to delete Menu with id: {}", uuid, e);
            }
        }
        return deleted;
    }

    private void applyFieldUpdates(Menu menu, Map<String, Object> fields) {
        if (fields.containsKey("name")) menu.setName((String) fields.get("name"));
        if (fields.containsKey("description")) menu.setDescription((String) fields.get("description"));
    }
}
