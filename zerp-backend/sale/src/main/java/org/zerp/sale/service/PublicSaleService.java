package org.zerp.sale.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import feign.FeignException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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
import org.zerp.sale.dto.publicsale.PublicShopFeedMode;
import org.zerp.sale.dto.publicsale.PublicShopFeedOrder;
import org.zerp.sale.dto.publicsale.PublicShopFeedResponseDTO;
import org.zerp.sale.dto.publicsale.PublicShopFeedSortBy;
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
    private static final int MAX_NEARBY_LIMIT = 50;
    private static final double EARTH_RADIUS_KM = 6371.0d;
    private static final String PUBLIC_CART_CODE_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int PUBLIC_CART_CODE_LENGTH = 6;
    private static final int PUBLIC_CART_CODE_MAX_ATTEMPTS = 10;
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int DEFAULT_FEED_LIMIT = 12;

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
                .map(shop -> toPublicShop(shop, null, null))
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<PublicShopDTO> listNearbyShops(double latitude, double longitude, int start, int end) {
        validateLatitude(latitude);
        validateLongitude(longitude);
        validatePaginationRange(start, end);
        int pageSize = validateLimit(end - start);
        int pageNumber = start / pageSize;

        return shopRepository.findNearestShops(latitude, longitude, PageRequest.of(pageNumber, pageSize))
                .map(shop -> toPublicShop(shop, latitude, longitude));
    }

    @Transactional(readOnly = true)
    public PublicShopFeedResponseDTO getPublicShopFeed(
            PublicShopFeedMode mode,
            Integer requestedPage,
            Integer pageSize,
            String query,
            String city,
            String state,
            PublicShopFeedSortBy sortBy,
            PublicShopFeedOrder order,
            Double latitude,
            Double longitude
    ) {
        PublicShopFeedMode resolvedMode = mode == null ? PublicShopFeedMode.ALL : mode;
        int resolvedPage = validatePage(requestedPage);
        int resolvedPageSize = validateFeedLimit(pageSize);
        int pageIndex = resolvedPage - 1;
        String normalizedQuery = normalizeFilterValue(query);
        String normalizedCity = normalizeFilterValue(city);
        String normalizedState = normalizeFilterValue(state);
        boolean applyQuery = normalizedQuery != null;
        boolean applyCity = normalizedCity != null;
        boolean applyState = normalizedState != null;
        String queryValue = applyQuery ? normalizedQuery : "";
        String cityValue = applyCity ? normalizedCity : "";
        String stateValue = applyState ? normalizedState : "";
        PublicShopFeedSortBy resolvedSortBy = sortBy == null ? PublicShopFeedSortBy.NAME : sortBy;
        PublicShopFeedOrder resolvedOrder = order == null ? PublicShopFeedOrder.ASC : order;

        Page<Shop> page;
        if (resolvedMode == PublicShopFeedMode.NEARBY) {
            if (latitude == null || longitude == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "lat and lng are required for nearby mode");
            }

            if (normalizedCity != null || normalizedState != null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "city and state filters are not supported in nearby mode");
            }

            if (resolvedSortBy != PublicShopFeedSortBy.DISTANCE) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "nearby mode only supports DISTANCE sort");
            }

            validateLatitude(latitude);
            validateLongitude(longitude);

            Pageable pageable = PageRequest.of(pageIndex, resolvedPageSize);
            page = resolvedOrder == PublicShopFeedOrder.DESC
                    ? shopRepository.findPublicShopsFeedNearbyDesc(latitude, longitude, applyQuery, queryValue, pageable)
                    : shopRepository.findPublicShopsFeedNearbyAsc(latitude, longitude, applyQuery, queryValue, pageable);
        } else {
            if (resolvedSortBy != PublicShopFeedSortBy.NAME) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "all mode only supports NAME sort");
            }

            Sort.Direction direction = resolvedOrder == PublicShopFeedOrder.DESC
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(pageIndex, resolvedPageSize, Sort.by(direction, "name"));
            page = shopRepository.findPublicShopsFeedAll(
                    applyQuery,
                    queryValue,
                    applyCity,
                    cityValue,
                    applyState,
                    stateValue,
                    pageable
            );
        }

        List<PublicShopDTO> items = page.getContent().stream()
                .map(shop -> toPublicShop(
                        shop,
                        resolvedMode == PublicShopFeedMode.NEARBY ? latitude : null,
                        resolvedMode == PublicShopFeedMode.NEARBY ? longitude : null
                ))
                .toList();

        boolean hasMore = (page.getNumber() + 1) < page.getTotalPages();
        Integer nextPage = hasMore ? resolvedPage + 1 : null;

        PublicShopFeedResponseDTO response = new PublicShopFeedResponseDTO();
        response.setItems(items);
        response.setPage(resolvedPage);
        response.setPageSize(resolvedPageSize);
        response.setNextPage(nextPage);
        response.setTotalPages(page.getTotalPages());
        response.setHasMore(hasMore);
        response.setTotal(page.getTotalElements());
        return response;
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
        response.setCategories(menuCategoryRepository.findByMenuIdOrderByDisplayOrderAscNameAsc(activeMenu.getId()).stream()
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

    @Transactional(readOnly = true)
    public PublicImageContentResponse getShopImage(UUID shopId, ImageSize imageSize) {
        Shop shop = ensureShopExists(shopId);
        String imageId = shop.getImageId();
        if (imageId == null || imageId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Shop image not found");
        }

        String normalizedImageId = imageId.trim();
        ImageSize resolvedSize = imageSize == null ? ImageSize.SMALL : imageSize;
        ResponseEntity<byte[]> thumborResponse;
        try {
            thumborResponse = thumborFeignClient.getShopImage(normalizedImageId, resolvedSize);
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

    private PublicShopDTO toPublicShop(Shop entity, Double originLatitude, Double originLongitude) {
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
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        if (originLatitude != null && originLongitude != null
                && entity.getLatitude() != null && entity.getLongitude() != null) {
            dto.setDistanceKm(calculateDistanceKm(originLatitude, originLongitude, entity.getLatitude(), entity.getLongitude()));
        }
        return dto;
    }

    private int validateLimit(int limit) {
        if (limit < 1 || limit > MAX_NEARBY_LIMIT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "limit must be between 1 and " + MAX_NEARBY_LIMIT);
        }
        return limit;
    }

    private int validateFeedLimit(Integer limit) {
        int resolvedLimit = limit == null ? DEFAULT_FEED_LIMIT : limit;
        if (resolvedLimit < 1 || resolvedLimit > MAX_NEARBY_LIMIT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "limit must be between 1 and " + MAX_NEARBY_LIMIT);
        }
        return resolvedLimit;
    }

    private int validatePage(Integer page) {
        int resolvedPage = page == null ? 1 : page;
        if (resolvedPage < 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "page must be greater than or equal to 1");
        }
        return resolvedPage;
    }

    private void validatePaginationRange(int start, int end) {
        if (start < 0 || end <= start) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pagination range");
        }

        int pageSize = end - start;
        if (start % pageSize != 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid pagination range: _start must be divisible by page size"
            );
        }
    }

    private void validateLatitude(double latitude) {
        if (Double.isNaN(latitude) || Double.isInfinite(latitude) || latitude < -90d || latitude > 90d) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "lat must be between -90 and 90");
        }
    }

    private void validateLongitude(double longitude) {
        if (Double.isNaN(longitude) || Double.isInfinite(longitude) || longitude < -180d || longitude > 180d) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "lng must be between -180 and 180");
        }
    }

    private double calculateDistanceKm(double originLat, double originLng, double targetLat, double targetLng) {
        double dLat = Math.toRadians(targetLat - originLat);
        double dLng = Math.toRadians(targetLng - originLng);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(originLat))
                * Math.cos(Math.toRadians(targetLat))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
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

    private String normalizeFilterValue(String input) {
        if (input == null) {
            return null;
        }

        String normalized = input.trim().toLowerCase(Locale.ROOT);
        return normalized.isEmpty() ? null : normalized;
    }
}
