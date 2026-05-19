package org.zerp.sale.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.dto.user.ImageSize;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.Menu;
import org.zerp.common.entity.sale.MenuLanguage;
import org.zerp.common.entity.sale.MenuCategory;
import org.zerp.common.entity.sale.MenuItem;
import org.zerp.common.entity.sale.PublicCartOrder;
import org.zerp.common.entity.sale.PublicCartOrderItem;
import org.zerp.sale.dto.publicsale.PublicActiveMenuDTO;
import org.zerp.sale.dto.publicsale.PublicCartOrderCreateRequest;
import org.zerp.sale.dto.publicsale.PublicCartOrderCreateResponse;
import org.zerp.sale.dto.publicsale.PublicImageContentResponse;
import org.zerp.sale.dto.publicsale.PublicCartOrderItemCreateRequest;
import org.zerp.sale.dto.publicsale.PublicMenuItemDTO;
import org.zerp.sale.dto.publicsale.PublicMenuCategoryDTO;
import org.zerp.sale.dto.publicsale.PublicShopDTO;
import org.zerp.sale.dto.publicsale.PublicShopMenuResponseDTO;
import org.zerp.sale.feign.ThumborFeignClient;
import org.zerp.sale.repository.MenuCategoryRepository;
import org.zerp.sale.repository.MenuItemRepository;
import org.zerp.sale.repository.MenuRepository;
import org.zerp.sale.repository.PublicCartOrderItemRepository;
import org.zerp.sale.repository.PublicCartOrderRepository;
import org.zerp.sale.repository.ShopRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.security.SecureRandom;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class PublicSaleService {
    private static final String PUBLIC_CART_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int PUBLIC_CART_CODE_LENGTH = 6;
    private static final int PUBLIC_CART_CODE_MAX_ATTEMPTS = 10;
    private static final SecureRandom RANDOM = new SecureRandom();

    private final ShopRepository shopRepository;
    private final MenuRepository menuRepository;
    private final MenuCategoryRepository menuCategoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final PublicCartOrderRepository publicCartOrderRepository;
    private final PublicCartOrderItemRepository publicCartOrderItemRepository;
    private final ThumborFeignClient thumborFeignClient;

    @Value("${app.sale.menu-item-images.folder:saleMenuItems}")
    private String menuItemImageFolder;

    @Transactional(readOnly = true)
    public List<PublicShopDTO> listShops() {
        return shopRepository.findAllByOrderByNameAsc().stream()
                .map(this::toPublicShop)
                .toList();
    }

    @Transactional(readOnly = true)
    public PublicShopMenuResponseDTO getActiveMenuWithCategories(UUID shopId, MenuLanguage requestedLanguage) {
        Shop shop = ensureShopExists(shopId);

        PublicShopMenuResponseDTO response = new PublicShopMenuResponseDTO();
        response.setShopId(shopId);

        Menu activeMenu = resolveActiveMenuWithFallback(shop, requestedLanguage).orElse(null);
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
    public Page<PublicMenuItemDTO> getMenuItemsByCategory(
            UUID shopId,
            UUID categoryId,
            Pageable pageable,
            MenuLanguage requestedLanguage
    ) {
        Shop shop = ensureShopExists(shopId);
        Menu activeMenu = resolveActiveMenuWithFallback(shop, requestedLanguage)
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
        order.setCode(generateUniquePublicCartOrderCode());
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
        response.setCode(saved.getCode());
        return response;
    }

    @Transactional(readOnly = true)
    public PublicImageContentResponse getMenuItemImage(String imageId, ImageSize imageSize) {
        String normalizedImageId = normalizeImageId(imageId);
        ImageSize resolvedSize = imageSize == null ? ImageSize.SMALL : imageSize;
        ResponseEntity<byte[]> thumborResponse;
        try {
            thumborResponse = thumborFeignClient.getProfileImage(normalizedImageId, resolvedSize);
        } catch (FeignException.NotFound e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found: " + normalizedImageId, e);
        } catch (FeignException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to fetch image from thumbor", e);
        }

        if (!thumborResponse.getStatusCode().is2xxSuccessful() || thumborResponse.getBody() == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Image not found: " + normalizedImageId);
        }

        MediaType contentType = thumborResponse.getHeaders().getContentType();
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM;
        }

        Resource resource = new ByteArrayResource(thumborResponse.getBody());
        return new PublicImageContentResponse(resource, contentType);
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

    private Shop ensureShopExists(UUID shopId) {
        return shopRepository.findById(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop not found"));
    }

    private String generateUniquePublicCartOrderCode() {
        for (int attempt = 1; attempt <= PUBLIC_CART_CODE_MAX_ATTEMPTS; attempt++) {
            String code = generatePublicCartOrderCode();
            if (!publicCartOrderRepository.existsByCode(code)) {
                return code;
            }
            log.warn("Generated duplicate public cart order code {} on attempt {}", code, attempt);
        }

        log.error("Failed to generate unique public cart order code after {} attempts", PUBLIC_CART_CODE_MAX_ATTEMPTS);
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not generate order code. Please try again.");
    }

    private String generatePublicCartOrderCode() {
        StringBuilder code = new StringBuilder(PUBLIC_CART_CODE_LENGTH);
        for (int i = 0; i < PUBLIC_CART_CODE_LENGTH; i++) {
            code.append(PUBLIC_CART_CODE_ALPHABET.charAt(RANDOM.nextInt(PUBLIC_CART_CODE_ALPHABET.length())));
        }
        return code.toString().toUpperCase(Locale.ROOT);
    }

    private Optional<Menu> resolveActiveMenuWithFallback(Shop shop, MenuLanguage requestedLanguage) {
        UUID shopId = shop.getId();
        MenuLanguage defaultLanguage = shop.getDefaultMenuLanguage() == null
                ? MenuLanguage.TR
                : shop.getDefaultMenuLanguage();

        if (requestedLanguage != null) {
            Optional<Menu> requestedMenu = menuRepository.findFirstByShopIdAndLanguageAndIsActiveTrue(shopId, requestedLanguage);
            if (requestedMenu.isPresent()) {
                return requestedMenu;
            }
        }

        return menuRepository.findFirstByShopIdAndLanguageAndIsActiveTrue(shopId, defaultLanguage);
    }

    private PublicShopDTO toPublicShop(Shop entity) {
        PublicShopDTO dto = new PublicShopDTO();
        dto.setId(entity.getId());
        dto.setTenantId(entity.getTenantId());
        dto.setTenantName(entity.getTenant() != null ? entity.getTenant().getName() : null);
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
        dto.setLanguage(menu.getLanguage() == null ? MenuLanguage.TR : menu.getLanguage());
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
        dto.setCalories(menuItem.getCalories());
        dto.setWeight(menuItem.getWeight());
        dto.setIngredients(menuItem.getIngredients());
        dto.setAllergens(menuItem.getAllergens());
        dto.setCategoryId(menuItem.getCategory() != null ? menuItem.getCategory().getId() : null);
        dto.setAvailable(true);
        return dto;
    }

    private String normalizeImageId(String imageId) {
        if (imageId == null || imageId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "imageId is required");
        }
        return imageId.trim();
    }
}
