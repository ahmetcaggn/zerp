package org.zerp.sale.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.Menu;
import org.zerp.common.entity.sale.MenuCategory;
import org.zerp.common.entity.sale.MenuItem;
import org.zerp.common.entity.sale.PublicCartOrder;
import org.zerp.common.entity.sale.PublicCartOrderItem;
import org.zerp.sale.dto.publicsale.PublicActiveMenuDTO;
import org.zerp.sale.dto.publicsale.PublicCartOrderCreateRequest;
import org.zerp.sale.dto.publicsale.PublicCartOrderCreateResponse;
import org.zerp.sale.dto.publicsale.PublicCartOrderItemCreateRequest;
import org.zerp.sale.dto.publicsale.PublicMenuItemDTO;
import org.zerp.sale.dto.publicsale.PublicMenuCategoryDTO;
import org.zerp.sale.dto.publicsale.PublicShopDTO;
import org.zerp.sale.dto.publicsale.PublicShopMenuResponseDTO;
import org.zerp.sale.repository.MenuCategoryRepository;
import org.zerp.sale.repository.MenuItemRepository;
import org.zerp.sale.repository.MenuRepository;
import org.zerp.sale.repository.PublicCartOrderItemRepository;
import org.zerp.sale.repository.PublicCartOrderRepository;
import org.zerp.sale.repository.ShopRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class PublicSaleService {
    private final ShopRepository shopRepository;
    private final MenuRepository menuRepository;
    private final MenuCategoryRepository menuCategoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final PublicCartOrderRepository publicCartOrderRepository;
    private final PublicCartOrderItemRepository publicCartOrderItemRepository;

    @Transactional(readOnly = true)
    public List<PublicShopDTO> listShops() {
        return shopRepository.findAllByOrderByNameAsc().stream()
                .map(this::toPublicShop)
                .toList();
    }

    @Transactional(readOnly = true)
    public PublicShopMenuResponseDTO getActiveMenuWithCategories(UUID shopId) {
        ensureShopExists(shopId);

        PublicShopMenuResponseDTO response = new PublicShopMenuResponseDTO();
        response.setShopId(shopId);

        Menu activeMenu = menuRepository.findFirstByShopIdAndIsActiveTrue(shopId).orElse(null);
        if (activeMenu == null) {
            response.setActiveMenu(null);
            response.setCategories(List.of());
            response.setMessage("No active menu found for this shop.");
            return response;
        }

        response.setActiveMenu(toPublicActiveMenu(activeMenu));
        response.setCategories(menuCategoryRepository.findByMenuIdOrderByNameAsc(activeMenu.getId()).stream()
                .map(this::toPublicMenuCategory)
                .toList());
        response.setMessage("Active menu found.");
        return response;
    }

    @Transactional(readOnly = true)
    public Page<PublicMenuItemDTO> getMenuItemsByCategory(UUID shopId, UUID categoryId, Pageable pageable) {
        ensureShopExists(shopId);
        Menu activeMenu = menuRepository.findFirstByShopIdAndIsActiveTrue(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No active menu found for this shop"));

        Page<MenuItem> page = menuItemRepository
                .findByCategoryIdAndCategoryMenuIdAndCategoryMenuShopId(
                        categoryId,
                        activeMenu.getId(),
                        shopId,
                        pageable
                );
        log.debug("Found {} menu items for public category listing", page.getTotalElements());
        return page.map(this::toPublicMenuItem);
    }

    @Transactional
    public PublicCartOrderCreateResponse createPublicCartOrder(UUID shopId, PublicCartOrderCreateRequest request) {
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "items is required");
        }
        LocalDateTime now = LocalDateTime.now();

        Shop shop = shopRepository.findById(shopId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));

        PublicCartOrder order = new PublicCartOrder();
        order.setShop(shop);
        order.setNote(request.getNote());
        order.setCreatedAt(now);

        for (PublicCartOrderItemCreateRequest itemRequest : request.getItems()) {
            if (itemRequest == null || itemRequest.getMenuItemId() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "menuItemId is required");
            }
            if (itemRequest.getQuantity() <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "quantity must be greater than 0");
            }

            MenuItem menuItem = menuItemRepository
                    .findByIdAndCategoryMenuShopId(itemRequest.getMenuItemId(), shopId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "MenuItem not found for shop: " + itemRequest.getMenuItemId()));

            PublicCartOrderItem item = new PublicCartOrderItem();
            item.setPublicCartOrder(order);
            item.setMenuItem(menuItem);
            item.setQuantity(itemRequest.getQuantity());
            item.setUnitPrice(menuItem.getPrice());
            item.setNotes(itemRequest.getNotes());
            item.setCreatedAt(now);
            order.getItems().add(item);
        }

        PublicCartOrder saved = publicCartOrderRepository.save(order);
        PublicCartOrderCreateResponse response = new PublicCartOrderCreateResponse();
        response.setId(saved.getId());
        return response;
    }

    @Scheduled(cron = "${sale.public-cart.cleanup-cron:0 0 3 * * *}")
    @Transactional
    public void cleanupExpiredPublicCartOrders() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(24);
        int deletedItems = publicCartOrderItemRepository.deleteByOrderCreatedAtBefore(cutoff);
        int deletedOrders = publicCartOrderRepository.deleteByCreatedAtBefore(cutoff);
        if (deletedItems > 0 || deletedOrders > 0) {
            log.info("Deleted {} expired public cart orders and {} items older than {}", deletedOrders, deletedItems, cutoff);
        }
    }

    private void ensureShopExists(UUID shopId) {
        if (!shopRepository.existsById(shopId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found");
        }
    }

    private PublicShopDTO toPublicShop(Shop entity) {
        PublicShopDTO dto = new PublicShopDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setImageId(entity.getImageId());
        dto.setAddress(entity.getAddress());
        dto.setCity(entity.getCity());
        dto.setState(entity.getState());
        dto.setCountry(entity.getCountry());
        dto.setPostalCode(entity.getPostalCode());
        dto.setPhone(entity.getPhone());
        dto.setEmail(entity.getEmail());
        dto.setWebsite(entity.getWebsite());
        return dto;
    }

    private PublicActiveMenuDTO toPublicActiveMenu(Menu menu) {
        PublicActiveMenuDTO dto = new PublicActiveMenuDTO();
        dto.setId(menu.getId());
        dto.setName(menu.getName());
        dto.setDescription(menu.getDescription());
        dto.setActive(menu.isActive());
        return dto;
    }

    private PublicMenuCategoryDTO toPublicMenuCategory(MenuCategory category) {
        PublicMenuCategoryDTO dto = new PublicMenuCategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }

    private PublicMenuItemDTO toPublicMenuItem(MenuItem menuItem) {
        PublicMenuItemDTO dto = new PublicMenuItemDTO();
        dto.setId(menuItem.getId());
        dto.setName(menuItem.getName());
        dto.setDescription(menuItem.getDescription());
        dto.setPrice(menuItem.getPrice());
        dto.setImageId(menuItem.getImageId());
        dto.setCategoryId(menuItem.getCategory() != null ? menuItem.getCategory().getId() : null);
        dto.setAvailable(true);
        return dto;
    }
}
