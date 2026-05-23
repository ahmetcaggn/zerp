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
import org.zerp.common.entity.sale.MenuItemProduct;
import org.zerp.common.entity.sale.ProductExtraOption;
import org.zerp.common.entity.sale.ProductExtraOptionItem;
import org.zerp.common.entity.sale.Product;
import org.zerp.common.entity.sale.ProductRecipe;
import org.zerp.common.entity.sale.ProductRecipeItem;
import org.zerp.common.entity.sale.PublicCartOrder;
import org.zerp.common.entity.sale.PublicCartOrderItem;
import org.zerp.common.entity.sale.ShopTable;
import org.zerp.common.entity.sale.TableOrder;
import org.zerp.common.entity.sale.TableOrderItem;
import org.zerp.common.entity.sale.TableOrderItemSelectedExtraOption;
import org.zerp.common.entity.sale.ShopTableStatus;
import org.zerp.common.entity.sale.TableOrderStatus;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.client.ResourceServiceClient;
import org.zerp.sale.dto.tableorder.PublicCartOrderPreviewDTO;
import org.zerp.sale.dto.tableorder.PublicCartOrderPreviewItemDTO;
import org.zerp.sale.dto.tableorder.TableOrderCreateDTO;
import org.zerp.sale.dto.tableorder.TableOrderDTO;
import org.zerp.sale.dto.tableorder.TableOrderItemCreateDTO;
import org.zerp.sale.dto.tableorder.TableOrderUpdateDTO;
import org.zerp.sale.mapper.TableOrderMapper;
import org.zerp.sale.permission.TableOrderPermissionEvaluator;
import org.zerp.sale.repository.MenuItemRepository;
import org.zerp.sale.repository.ProductExtraOptionRepository;
import org.zerp.sale.repository.PublicCartOrderRepository;
import org.zerp.sale.repository.ShopTableRepository;
import org.zerp.sale.repository.TableOrderRepository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Log4j2
@Service
@RequiredArgsConstructor
public class TableOrderService implements
        IResourceService<TableOrderDTO, TableOrderDTO, TableOrderCreateDTO, TableOrderUpdateDTO, UUID> {

    private static final String PUBLIC_CART_ORDER_CODE_PATTERN = "^[A-Z0-9]{6}$";

    private final TableOrderPermissionEvaluator permissionEvaluator;
    private final TableOrderRepository repository;
    private final ShopTableRepository shopTableRepository;
    private final MenuItemRepository menuItemRepository;
    private final ProductExtraOptionRepository productExtraOptionRepository;
    private final PublicCartOrderRepository publicCartOrderRepository;
    private final ResourceServiceClient resourceServiceClient;
    private final TableOrderMapper mapper;
    private final CurrentUserIdResolver currentUserIdResolver;
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
        ShopTable shopTable = resolveShopTable(data.getTableId());
        UUID tenantId = shopTable.getTenantId();
        Shop shop = shopTable.getShop();

        if (!permissionEvaluator.canCreate(userId, shopTable)) {
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

    @Transactional(readOnly = true)
    public PublicCartOrderPreviewDTO previewPublicCartOrder(String code, UUID tableId) {
        UUID userId = currentUserIdResolver.resolve();
        ShopTable shopTable = resolveShopTable(tableId);
        Shop shop = shopTable.getShop();
        if (shop == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ShopTable has no shop");
        }

        if (!permissionEvaluator.canCreate(userId, shopTable)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create TableOrder");
        }

        String normalizedCode = normalizePublicCartOrderCode(code);
        PublicCartOrder publicOrder = publicCartOrderRepository.findByCode(normalizedCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "QR siparişi bulunamadı."));
        if (publicOrder.getShop() == null || !shop.getId().equals(publicOrder.getShop().getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bu QR siparişi seçili masanın şubesine ait değil.");
        }
        if (publicOrder.getItems() == null || publicOrder.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PublicCartOrder has no items");
        }

        PublicCartOrderPreviewDTO dto = new PublicCartOrderPreviewDTO();
        dto.setId(publicOrder.getId());
        dto.setCode(publicOrder.getCode());
        dto.setShopId(shop.getId());
        dto.setNote(publicOrder.getNote());
        dto.setItems(publicOrder.getItems().stream().map(this::toPublicCartOrderPreviewItem).toList());
        return dto;
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
        List<TableOrderItemSelectedExtraOption> selectedExtraOptions = resolveSelectedExtraOptions(
                dto.getSelectedExtraOptionIds(),
                menuItem,
                order.getTenantId()
        );
        BigDecimal extraTotal = selectedExtraOptions.stream()
                .map(TableOrderItemSelectedExtraOption::getPriceSnapshot)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        TableOrderItem item = new TableOrderItem();
        item.setOrder(order);
        item.setMenuItem(menuItem);
        item.setQuantity(dto.getQuantity());
        item.setUnitPrice(menuItem.getPrice().add(extraTotal));
        item.setNotes(dto.getNotes());
        item.setTenantId(order.getTenantId());
        selectedExtraOptions.forEach(extra -> extra.setTableOrderItem(item));
        item.getSelectedExtraOptions().addAll(selectedExtraOptions);
        return item;
    }

    private String normalizePublicCartOrderCode(String code) {
        if (code == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçerli bir sipariş kodu girin.");
        }
        String normalizedCode = code.trim().toUpperCase(Locale.ROOT);
        if (!normalizedCode.matches(PUBLIC_CART_ORDER_CODE_PATTERN)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Geçerli bir sipariş kodu girin.");
        }
        return normalizedCode;
    }

    private PublicCartOrderPreviewItemDTO toPublicCartOrderPreviewItem(PublicCartOrderItem item) {
        if (item == null || item.getMenuItem() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PublicCartOrder has an invalid item");
        }
        if (item.getQuantity() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PublicCartOrder has an item with invalid quantity");
        }
        if (item.getUnitPrice() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PublicCartOrder has an item with invalid unit price");
        }

        PublicCartOrderPreviewItemDTO dto = new PublicCartOrderPreviewItemDTO();
        dto.setMenuItemId(item.getMenuItem().getId());
        dto.setMenuItemName(item.getMenuItem().getName());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setNotes(item.getNotes());
        return dto;
    }

    private List<TableOrderItemSelectedExtraOption> resolveSelectedExtraOptions(
            List<UUID> selectedExtraOptionIds,
            MenuItem menuItem,
            UUID tenantId
    ) {
        if (selectedExtraOptionIds == null || selectedExtraOptionIds.isEmpty()) {
            return List.of();
        }

        Set<UUID> deduplicatedIds = new LinkedHashSet<>(selectedExtraOptionIds);
        List<ProductExtraOption> options = productExtraOptionRepository.findAllByIdIn(deduplicatedIds);
        Map<UUID, ProductExtraOption> optionsById = new HashMap<>();
        for (ProductExtraOption option : options) {
            optionsById.put(option.getId(), option);
        }

        Set<UUID> menuProductIds = new HashSet<>();
        List<MenuItemProduct> productLinks = menuItem.getProductLinks();
        if (productLinks != null) {
            for (MenuItemProduct link : productLinks) {
                if (link.getProduct() != null) {
                    menuProductIds.add(link.getProduct().getId());
                }
            }
        }

        List<TableOrderItemSelectedExtraOption> selected = new ArrayList<>();
        for (UUID optionId : deduplicatedIds) {
            ProductExtraOption option = optionsById.get(optionId);
            if (option == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid extra option: " + optionId);
            }
            if (!option.isActive()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Inactive extra option: " + option.getName());
            }
            if (option.getProduct() == null || !menuProductIds.contains(option.getProduct().getId())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Extra option does not belong to menu item: " + option.getName()
                );
            }

            TableOrderItemSelectedExtraOption snapshot = new TableOrderItemSelectedExtraOption();
            snapshot.setExtraOptionId(option.getId());
            snapshot.setNameSnapshot(option.getName());
            snapshot.setPriceSnapshot(option.getPrice() == null ? BigDecimal.ZERO : option.getPrice());
            snapshot.setTenantId(tenantId);
            selected.add(snapshot);
        }

        return selected;
    }

    /**
     * Builds stock movement requests inside the active transaction so all lazy
     * collections (MenuItem.productLinks, ProductRecipe.items, etc.) are still accessible.
     * The resulting list contains only plain POJOs and is safe to hand off to an async thread.
     */
    private List<StockMovementFeignRequest> buildStockMovementRequests(TableOrder order) {
        List<StockMovementFeignRequest> requests = new ArrayList<>();
        Set<UUID> selectedExtraOptionIds = new HashSet<>();
        for (TableOrderItem item : order.getItems()) {
            for (TableOrderItemSelectedExtraOption selectedExtraOption : item.getSelectedExtraOptions()) {
                selectedExtraOptionIds.add(selectedExtraOption.getExtraOptionId());
            }
        }
        Map<UUID, ProductExtraOption> extraOptionById = new HashMap<>();
        if (!selectedExtraOptionIds.isEmpty()) {
            for (ProductExtraOption option : productExtraOptionRepository.findAllByIdIn(selectedExtraOptionIds)) {
                extraOptionById.put(option.getId(), option);
            }
        }

        for (TableOrderItem item : order.getItems()) {
            MenuItem menuItem = item.getMenuItem();
            List<MenuItemProduct> productLinks = menuItem.getProductLinks();
            if (productLinks == null || productLinks.isEmpty()) continue;

            for (MenuItemProduct productLink : productLinks) {
                Product product = productLink.getProduct();
                List<ProductRecipe> defaultRecipes = product.getRecipes();
                for (ProductRecipe recipe : defaultRecipes) {
                    for (ProductRecipeItem recipeItem : recipe.getItems()) {
                        int menuItemQuantity = productLink.getQuantity() == null || productLink.getQuantity() < 1
                                ? 1
                                : productLink.getQuantity();
                        BigDecimal qty = recipeItem.getQuantity()
                                .multiply(BigDecimal.valueOf(item.getQuantity()))
                                .multiply(BigDecimal.valueOf(menuItemQuantity));
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

            for (TableOrderItemSelectedExtraOption selectedExtraOption : item.getSelectedExtraOptions()) {
                ProductExtraOption option = extraOptionById.get(selectedExtraOption.getExtraOptionId());
                if (option == null || option.getItems() == null) {
                    continue;
                }
                for (ProductExtraOptionItem optionItem : option.getItems()) {
                    BigDecimal qty = optionItem.getQuantity()
                            .multiply(BigDecimal.valueOf(item.getQuantity()));
                    requests.add(StockMovementFeignRequest.builder()
                            .stockResourceId(optionItem.getStockResource().getId())
                            .type(StockMovementType.SALE)
                            .quantity(qty)
                            .referenceType("TABLE_ORDER")
                            .referenceId(order.getId())
                            .notes(option.getName() + " x" + item.getQuantity())
                            .tenantId(order.getTenantId())
                            .build());
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
