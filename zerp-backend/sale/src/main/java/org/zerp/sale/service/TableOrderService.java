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
import org.zerp.common.dto.feign.resource.StockMovementFeignRequest;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.resource.StockMovementType;
import org.zerp.common.entity.sale.MenuItem;
import org.zerp.common.entity.sale.Product;
import org.zerp.common.entity.sale.ProductRecipe;
import org.zerp.common.entity.sale.ProductRecipeItem;
import org.zerp.common.entity.sale.ShopTable;
import org.zerp.common.entity.sale.TableOrder;
import org.zerp.common.entity.sale.TableOrderItem;
import org.zerp.common.entity.sale.ShopTableStatus;
import org.zerp.common.entity.sale.TableOrderStatus;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.client.ResourceServiceClient;
import org.zerp.sale.dto.tableorder.TableOrderCreateDTO;
import org.zerp.sale.dto.tableorder.TableOrderDTO;
import org.zerp.sale.dto.tableorder.TableOrderItemCreateDTO;
import org.zerp.sale.dto.tableorder.TableOrderUpdateDTO;
import org.zerp.sale.mapper.TableOrderMapper;
import org.zerp.sale.permission.TableOrderPermissionEvaluator;
import org.zerp.sale.repository.MenuItemRepository;
import org.zerp.sale.repository.ProductRecipeRepository;
import org.zerp.sale.repository.ShopTableRepository;
import org.zerp.sale.repository.TableOrderRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Log4j2
@Service
@RequiredArgsConstructor
public class TableOrderService implements
        IResourceService<TableOrderDTO, TableOrderDTO, TableOrderCreateDTO, TableOrderUpdateDTO, UUID> {

    private final TableOrderPermissionEvaluator permissionEvaluator;
    private final TableOrderRepository repository;
    private final ShopTableRepository shopTableRepository;
    private final MenuItemRepository menuItemRepository;
    private final ProductRecipeRepository productRecipeRepository;
    private final ResourceServiceClient resourceServiceClient;
    private final TableOrderMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;
    private final FilterRefiner filterRefiner;

    @Override
    @Transactional(readOnly = true)
    public Page<TableOrderDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.trace("Finding TableOrders with filters: {}", filters);
        UUID userId = currentUserIdResolver.resolve();
        Specification<TableOrder> spec = filterRefiner.refinedOrBadRequest(filters, TableOrder.class);
        spec = permissionEvaluator.filterRead(userId).and(spec);
        Page<TableOrderDTO> results = repository.findAll(spec, pageable).map(mapper::toDTO);
        log.debug("Found {} TableOrders", results.getTotalElements());
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TableOrderDTO> findAllById(List<UUID> uuids) {
        UUID userId = currentUserIdResolver.resolve();
        List<TableOrderDTO> results = new ArrayList<>();
        for (UUID id : uuids) {
            repository.findById(id).ifPresent(order -> {
                if (permissionEvaluator.canRead(userId, order)) {
                    results.add(mapper.toDTO(order));
                }
            });
        }
        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public TableOrderDTO findById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        TableOrder order = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "TableOrder not found"));
        if (!permissionEvaluator.canRead(userId, order)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read TableOrder");
        }
        return mapper.toDTO(order);
    }

    @Override
    @Transactional
    public TableOrderDTO create(TableOrderCreateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = currentTenantIdResolver.resolve();
        ShopTable shopTable = resolveShopTable(data.getTableId());
        Shop shop = shopTable.getShop();

        if (!permissionEvaluator.canCreate(userId, shop.getId(), tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create TableOrder");
        }

        TableOrder order = new TableOrder();
        order.setShopTable(shopTable);
        order.setShop(shop);
        order.setNote(data.getNote());
        order.setStatus(TableOrderStatus.OPEN);
        order.setTenantId(tenantId);

        if (data.getItems() != null) {
            for (TableOrderItemCreateDTO itemDto : data.getItems()) {
                TableOrderItem item = buildOrderItem(itemDto, order);
                order.getItems().add(item);
            }
        }

        TableOrder saved = repository.save(order);

        shopTable.setStatus(ShopTableStatus.OCCUPIED);
        shopTableRepository.save(shopTable);

        log.info("Created TableOrder with id: {}", saved.getId());
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public TableOrderDTO patch(UUID uuid, Map<String, Object> data) {
        UUID userId = currentUserIdResolver.resolve();
        TableOrder order = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "TableOrder not found"));
        if (!permissionEvaluator.canPatch(userId, order)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to patch TableOrder");
        }
        TableOrderStatus previousStatus = order.getStatus();
        if (data.containsKey("status")) {
            order.setStatus(TableOrderStatus.valueOf((String) data.get("status")));
        }
        if (data.containsKey("note")) {
            order.setNote((String) data.get("note"));
        }
        TableOrder updated = repository.save(order);

        if (isClosed(updated.getStatus())) {
            releaseTableIfNoOpenOrders(updated.getShopTable());
        }

        if (updated.getStatus() == TableOrderStatus.PAID && previousStatus != TableOrderStatus.PAID) {
            List<StockMovementFeignRequest> requests = buildStockMovementRequests(updated);
            dispatchStockDeduction(updated.getId(), requests);
        }

        log.info("Patched TableOrder with id: {}", uuid);
        return mapper.toDTO(updated);
    }

    @Override
    @Transactional
    public TableOrderDTO update(UUID uuid, TableOrderUpdateDTO data) {
        UUID userId = currentUserIdResolver.resolve();
        TableOrder order = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "TableOrder not found"));
        if (!permissionEvaluator.canUpdate(userId, order)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to update TableOrder");
        }
        if (data.getStatus() != null) order.setStatus(data.getStatus());
        if (data.getNote() != null) order.setNote(data.getNote());

        if (data.getItems() != null) {
            order.getItems().clear();
            for (TableOrderItemCreateDTO itemDto : data.getItems()) {
                TableOrderItem item = buildOrderItem(itemDto, order);
                order.getItems().add(item);
            }
        }

        TableOrder updated = repository.save(order);
        log.info("Updated TableOrder with id: {}", uuid);
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
                log.debug("Failed to patch TableOrder with id: {}", uuid, e);
            }
        }
        return updated;
    }

    @Override
    @Transactional
    public void deleteById(UUID uuid) {
        UUID userId = currentUserIdResolver.resolve();
        TableOrder order = repository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "TableOrder not found"));
        if (!permissionEvaluator.canDelete(userId, order)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to delete TableOrder");
        }
        ShopTable shopTable = order.getShopTable();
        repository.delete(order);
        releaseTableIfNoOpenOrders(shopTable);
        log.info("Deleted TableOrder with id: {}", uuid);
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
                log.debug("Failed to delete TableOrder with id: {}", uuid, e);
            }
        }
        return deleted;
    }

    private TableOrderItem buildOrderItem(TableOrderItemCreateDTO dto, TableOrder order) {
        MenuItem menuItem = menuItemRepository.findById(dto.getMenuItemId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "MenuItem not found: " + dto.getMenuItemId()));
        TableOrderItem item = new TableOrderItem();
        item.setOrder(order);
        item.setMenuItem(menuItem);
        item.setQuantity(dto.getQuantity());
        item.setUnitPrice(menuItem.getPrice());
        item.setNotes(dto.getNotes());
        item.setTenantId(order.getTenantId());
        return item;
    }

    /**
     * Builds stock movement requests inside the active transaction so all lazy
     * collections (MenuItem.products, ProductRecipe.items, etc.) are still accessible.
     * The resulting list contains only plain POJOs and is safe to hand off to an async thread.
     */
    private List<StockMovementFeignRequest> buildStockMovementRequests(TableOrder order) {
        List<StockMovementFeignRequest> requests = new ArrayList<>();
        for (TableOrderItem item : order.getItems()) {
            MenuItem menuItem = item.getMenuItem();
            List<Product> products = menuItem.getProducts();
            if (products == null || products.isEmpty()) continue;

            for (Product product : products) {
                List<ProductRecipe> defaultRecipes = product.getRecipes();
                for (ProductRecipe recipe : defaultRecipes) {
                    for (ProductRecipeItem recipeItem : recipe.getItems()) {
                        BigDecimal qty = recipeItem.getQuantity()
                                .multiply(BigDecimal.valueOf(item.getQuantity()));
                        requests.add(StockMovementFeignRequest.builder()
                                .stockResourceId(recipeItem.getStockResource().getId())
                                .type(StockMovementType.SALE)
                                .quantity(qty)
                                .referenceType("TABLE_ORDER")
                                .referenceId(order.getId())
                                .notes(menuItem.getName() + " x" + item.getQuantity())
                                .tenantId(order.getTenantId())
                                .build());
                    }
                }
            }
        }
        return requests;
    }

    /**
     * Sends stock deduction requests to the resource service asynchronously.
     * A failure here must NOT block or roll back the completed sale.
     */
    private void dispatchStockDeduction(UUID orderId, List<StockMovementFeignRequest> requests) {
        if (requests.isEmpty()) return;
        CompletableFuture.runAsync(() -> {
            try {
                resourceServiceClient.createStockMovements(requests);
                log.info("Stock deducted for order {} ({} movements)", orderId, requests.size());
            } catch (Exception e) {
                log.error("Failed to deduct stock for order {}: {}", orderId, e.getMessage(), e);
                // TODO: Publish failed requests to a Kafka dead-letter topic (e.g. "stock.deduction.failed")
                //       so they can be retried without losing the sale record.
            }
        });
    }

    private boolean isClosed(TableOrderStatus status) {
        return status == TableOrderStatus.PAID || status == TableOrderStatus.CANCELLED;
    }

    private void releaseTableIfNoOpenOrders(ShopTable shopTable) {
        boolean hasOpenOrders = !repository
                .findByShopTableIdAndStatus(shopTable.getId(), TableOrderStatus.OPEN)
                .isEmpty();
        if (!hasOpenOrders) {
            shopTable.setStatus(ShopTableStatus.AVAILABLE);
            shopTableRepository.save(shopTable);
        }
    }

    private ShopTable resolveShopTable(UUID tableId) {
        if (tableId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tableId is required");
        }
        return shopTableRepository.findById(tableId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ShopTable not found"));
    }
}
