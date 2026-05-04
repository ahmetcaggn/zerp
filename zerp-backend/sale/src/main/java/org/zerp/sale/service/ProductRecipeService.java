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
import org.zerp.common.entity.sale.ProductRecipe;
import org.zerp.common.entity.sale.ProductRecipeItem;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.productrecipe.ProductRecipeCreateDTO;
import org.zerp.sale.dto.productrecipe.ProductRecipeDTO;
import org.zerp.sale.dto.productrecipe.ProductRecipeUpdateDTO;
import org.zerp.sale.mapper.ProductRecipeMapper;
import org.zerp.sale.permission.ProductRecipePermissionEvaluator;
import org.zerp.sale.repository.ProductRecipeRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class ProductRecipeService implements
        IResourceService<ProductRecipeDTO, ProductRecipeDTO, ProductRecipeCreateDTO, ProductRecipeUpdateDTO, UUID> {
    private final ProductRecipePermissionEvaluator permissionEvaluator;
    private final ProductRecipeRepository repository;
    private final ProductRecipeMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;
    private final FilterRefiner filterRefiner;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductRecipeDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.trace("Finding ProductRecipes with filters: {}", filters);
        UUID userId = currentUserIdResolver.resolve();
        Specification<ProductRecipe> spec = filterRefiner.refinedOrBadRequest(filters, ProductRecipe.class);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<ProductRecipeDTO> results = repository.findAll(spec, pageable).map(this::toDTOWithItems);
        log.debug("Found {} ProductRecipes", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductRecipeDTO> findAllById(List<UUID> uuids) {
        UUID userId = currentUserIdResolver.resolve();
        List<ProductRecipeDTO> results = new ArrayList<>();
        for (UUID id : uuids) {
            repository.findById(id).ifPresent(recipe -> {
                if (permissionEvaluator.canRead(userId, recipe)) {
                    results.add(toDTOWithItems(recipe));
                }
            });
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public ProductRecipeDTO findById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        ProductRecipe recipe = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductRecipe not found"));
        if (!permissionEvaluator.canRead(userId, recipe)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read ProductRecipe");
        }
        return toDTOWithItems(recipe);
    }

    @Override
    @Transactional
    public ProductRecipeDTO create(ProductRecipeCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = currentTenantIdResolver.resolve();
        if (!permissionEvaluator.canCreate(userId, data.getProductId(), tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create ProductRecipe");
        }

        ProductRecipe recipe = mapper.toEntity(data);
        recipe.setTenantId(tenantId);

        if (data.getItems() != null) {
            data.getItems().forEach(itemDTO -> {
                ProductRecipeItem item = mapper.toItemEntity(itemDTO);
                item.setRecipe(recipe);
                recipe.getItems().add(item);
            });
        }

        ProductRecipe saved = repository.save(recipe);
        log.info("Created ProductRecipe with id: {}", saved.getId());
        return toDTOWithItems(saved);
    }

    @Override
    @Transactional
    public ProductRecipeDTO patch(UUID uuid, Map<String, Object> data) {
        UUID userId = currentUserIdResolver.resolve();
        ProductRecipe recipe = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductRecipe not found"));
        if (!permissionEvaluator.canPatch(userId, recipe)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch ProductRecipe");
        }
        if (data.containsKey("name")) recipe.setName((String) data.get("name"));
        if (data.containsKey("description")) recipe.setDescription((String) data.get("description"));
        if (data.containsKey("isDefault")) recipe.setDefault((Boolean) data.get("isDefault"));
        ProductRecipe updated = repository.save(recipe);
        return toDTOWithItems(updated);
    }

    @Override
    @Transactional
    public ProductRecipeDTO update(UUID uuid, ProductRecipeUpdateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        ProductRecipe recipe = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductRecipe not found"));
        if (!permissionEvaluator.canUpdate(userId, recipe)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update ProductRecipe");
        }

        mapper.updateEntityFromDTO(data, recipe);

        if (data.getItems() != null) {
            recipe.getItems().clear();
            data.getItems().forEach(itemDTO -> {
                ProductRecipeItem item = mapper.toItemEntity(itemDTO);
                item.setRecipe(recipe);
                recipe.getItems().add(item);
            });
        }

        ProductRecipe updated = repository.save(recipe);
        log.info("Updated ProductRecipe with id: {}", uuid);
        return toDTOWithItems(updated);
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
                log.debug("Failed to patch ProductRecipe with id: {}", uuid, e);
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        ProductRecipe recipe = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "ProductRecipe not found"));
        if (!permissionEvaluator.canDelete(userId, recipe)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete ProductRecipe");
        }
        repository.delete(recipe);
        log.info("Deleted ProductRecipe with id: {}", uuid);
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
                log.debug("Failed to delete ProductRecipe with id: {}", uuid, e);
            }
        }
        return deleted;
    }

    private ProductRecipeDTO toDTOWithItems(ProductRecipe recipe) {
        ProductRecipeDTO dto = mapper.toDTO(recipe);
        dto.setItems(recipe.getItems().stream().map(mapper::toItemDTO).toList());
        return dto;
    }
}
