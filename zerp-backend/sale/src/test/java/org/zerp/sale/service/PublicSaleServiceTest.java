package org.zerp.sale.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.Menu;
import org.zerp.common.entity.sale.MenuLanguage;
import org.zerp.common.entity.sale.MenuItem;
import org.zerp.common.entity.sale.PublicCartOrder;
import org.zerp.sale.dto.publicsale.PublicShopMenuResponseDTO;
import org.zerp.sale.dto.publicsale.PublicCartOrderCreateRequest;
import org.zerp.sale.dto.publicsale.PublicCartOrderCreateResponse;
import org.zerp.sale.dto.publicsale.PublicCartOrderItemCreateRequest;
import org.zerp.sale.repository.MenuCategoryRepository;
import org.zerp.sale.repository.MenuItemRepository;
import org.zerp.sale.repository.MenuRepository;
import org.zerp.sale.repository.PublicCartOrderItemRepository;
import org.zerp.sale.repository.PublicCartOrderRepository;
import org.zerp.sale.repository.ShopRepository;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PublicSaleServiceTest {

    @Mock
    private ShopRepository shopRepository;
    @Mock
    private MenuRepository menuRepository;
    @Mock
    private MenuCategoryRepository menuCategoryRepository;
    @Mock
    private MenuItemRepository menuItemRepository;
    @Mock
    private PublicCartOrderRepository publicCartOrderRepository;
    @Mock
    private PublicCartOrderItemRepository publicCartOrderItemRepository;

    @InjectMocks
    private PublicSaleService publicSaleService;

    @Test
    void getActiveMenuWithCategoriesReturnsRequestedLanguageMenu() {
        UUID shopId = UUID.randomUUID();
        UUID requestedMenuId = UUID.randomUUID();

        Shop shop = new Shop();
        shop.setId(shopId);
        shop.setDefaultMenuLanguage(MenuLanguage.EN);

        Menu requestedMenu = new Menu();
        requestedMenu.setId(requestedMenuId);
        requestedMenu.setName("TR Menu");
        requestedMenu.setLanguage(MenuLanguage.TR);
        requestedMenu.setActive(true);

        when(shopRepository.findById(shopId)).thenReturn(Optional.of(shop));
        when(menuRepository.findFirstByShopIdAndLanguageAndIsActiveTrue(shopId, MenuLanguage.TR))
                .thenReturn(Optional.of(requestedMenu));
        when(menuCategoryRepository.findByMenuIdOrderByNameAsc(requestedMenuId)).thenReturn(Collections.emptyList());

        PublicShopMenuResponseDTO response = publicSaleService.getActiveMenuWithCategories(shopId, MenuLanguage.TR);

        assertThat(response.getActiveMenu()).isNotNull();
        assertThat(response.getActiveMenu().getId()).isEqualTo(requestedMenuId);
        assertThat(response.getActiveMenu().getLanguage()).isEqualTo(MenuLanguage.TR);
        verify(menuRepository, never()).findFirstByShopIdAndLanguageAndIsActiveTrue(shopId, MenuLanguage.EN);
    }

    @Test
    void getActiveMenuWithCategoriesFallsBackToShopDefaultLanguage() {
        UUID shopId = UUID.randomUUID();
        UUID defaultMenuId = UUID.randomUUID();

        Shop shop = new Shop();
        shop.setId(shopId);
        shop.setDefaultMenuLanguage(MenuLanguage.EN);

        Menu defaultMenu = new Menu();
        defaultMenu.setId(defaultMenuId);
        defaultMenu.setName("EN Menu");
        defaultMenu.setLanguage(MenuLanguage.EN);
        defaultMenu.setActive(true);

        when(shopRepository.findById(shopId)).thenReturn(Optional.of(shop));
        when(menuRepository.findFirstByShopIdAndLanguageAndIsActiveTrue(shopId, MenuLanguage.TR))
                .thenReturn(Optional.empty());
        when(menuRepository.findFirstByShopIdAndLanguageAndIsActiveTrue(shopId, MenuLanguage.EN))
                .thenReturn(Optional.of(defaultMenu));
        when(menuCategoryRepository.findByMenuIdOrderByNameAsc(defaultMenuId)).thenReturn(Collections.emptyList());

        PublicShopMenuResponseDTO response = publicSaleService.getActiveMenuWithCategories(shopId, MenuLanguage.TR);

        assertThat(response.getActiveMenu()).isNotNull();
        assertThat(response.getActiveMenu().getId()).isEqualTo(defaultMenuId);
        assertThat(response.getActiveMenu().getLanguage()).isEqualTo(MenuLanguage.EN);
    }

    @Test
    void getActiveMenuWithCategoriesReturnsMissingWhenNoLanguageMatches() {
        UUID shopId = UUID.randomUUID();

        Shop shop = new Shop();
        shop.setId(shopId);
        shop.setDefaultMenuLanguage(MenuLanguage.EN);

        when(shopRepository.findById(shopId)).thenReturn(Optional.of(shop));
        when(menuRepository.findFirstByShopIdAndLanguageAndIsActiveTrue(shopId, MenuLanguage.TR))
                .thenReturn(Optional.empty());
        when(menuRepository.findFirstByShopIdAndLanguageAndIsActiveTrue(shopId, MenuLanguage.EN))
                .thenReturn(Optional.empty());

        PublicShopMenuResponseDTO response = publicSaleService.getActiveMenuWithCategories(shopId, MenuLanguage.TR);

        assertThat(response.getActiveMenu()).isNull();
        assertThat(response.getCategories()).isEmpty();
        assertThat(response.getMessage()).contains("No active menu");
    }

    @Test
    void getMenuItemsByCategoryUsesDefaultLanguageWhenRequestedIsMissing() {
        UUID shopId = UUID.randomUUID();
        UUID categoryId = UUID.randomUUID();
        UUID menuId = UUID.randomUUID();

        Shop shop = new Shop();
        shop.setId(shopId);
        shop.setDefaultMenuLanguage(MenuLanguage.EN);

        Menu fallbackMenu = new Menu();
        fallbackMenu.setId(menuId);
        fallbackMenu.setLanguage(MenuLanguage.EN);
        fallbackMenu.setActive(true);

        MenuItem menuItem = new MenuItem();
        menuItem.setId(UUID.randomUUID());
        menuItem.setName("Americano");
        menuItem.setPrice(BigDecimal.valueOf(95));

        when(shopRepository.findById(shopId)).thenReturn(Optional.of(shop));
        when(menuRepository.findFirstByShopIdAndLanguageAndIsActiveTrue(shopId, MenuLanguage.TR))
                .thenReturn(Optional.empty());
        when(menuRepository.findFirstByShopIdAndLanguageAndIsActiveTrue(shopId, MenuLanguage.EN))
                .thenReturn(Optional.of(fallbackMenu));
        when(menuItemRepository.findByCategoryIdAndCategoryMenuIdAndCategoryMenuShopId(
                eq(categoryId),
                eq(menuId),
                eq(shopId),
                any()
        )).thenReturn(new PageImpl<>(List.of(menuItem), PageRequest.of(0, 20), 1));

        var page = publicSaleService.getMenuItemsByCategory(shopId, categoryId, PageRequest.of(0, 20), MenuLanguage.TR);

        assertThat(page.getTotalElements()).isEqualTo(1);
        assertThat(page.getContent()).hasSize(1);
        assertThat(page.getContent().getFirst().getName()).isEqualTo("Americano");
    }

    @Test
    void createPublicCartOrderCreatesOrderWithUnitPriceSnapshot() {
        UUID shopId = UUID.randomUUID();
        UUID menuItemId = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();
        UUID createdOrderId = UUID.randomUUID();

        Shop shop = new Shop();
        shop.setId(shopId);
        shop.setTenantId(tenantId);

        MenuItem menuItem = new MenuItem();
        menuItem.setId(menuItemId);
        menuItem.setPrice(BigDecimal.valueOf(375.50));

        when(shopRepository.findById(shopId)).thenReturn(Optional.of(shop));
        when(menuItemRepository.findByIdAndCategoryMenuShopId(menuItemId, shopId)).thenReturn(Optional.of(menuItem));
        when(publicCartOrderRepository.save(any(PublicCartOrder.class))).thenAnswer(invocation -> {
            PublicCartOrder order = invocation.getArgument(0);
            order.setId(createdOrderId);
            return order;
        });

        PublicCartOrderItemCreateRequest item = new PublicCartOrderItemCreateRequest();
        item.setMenuItemId(menuItemId);
        item.setQuantity(2);
        item.setNotes("Acisiz olsun");

        PublicCartOrderCreateRequest request = new PublicCartOrderCreateRequest();
        request.setNote("Masa cam kenari");
        request.setItems(List.of(item));

        PublicCartOrderCreateResponse response = publicSaleService.createPublicCartOrder(shopId, request);

        assertThat(response.getId()).isEqualTo(createdOrderId);

        ArgumentCaptor<PublicCartOrder> orderCaptor = ArgumentCaptor.forClass(PublicCartOrder.class);
        verify(publicCartOrderRepository).save(orderCaptor.capture());
        PublicCartOrder savedOrder = orderCaptor.getValue();
        assertThat(savedOrder.getTenantId()).isEqualTo(tenantId);
        assertThat(savedOrder.getItems()).hasSize(1);
        assertThat(savedOrder.getItems().getFirst().getQuantity()).isEqualTo(2);
        assertThat(savedOrder.getItems().getFirst().getUnitPrice()).isEqualByComparingTo("375.50");
        assertThat(savedOrder.getItems().getFirst().getTenantId()).isEqualTo(tenantId);
        assertThat(savedOrder.getItems().getFirst().getNotes()).isEqualTo("Acisiz olsun");
    }

    @Test
    void createPublicCartOrderThrowsWhenMenuItemDoesNotBelongToShop() {
        UUID shopId = UUID.randomUUID();
        UUID menuItemId = UUID.randomUUID();

        Shop shop = new Shop();
        shop.setId(shopId);
        shop.setTenantId(UUID.randomUUID());

        when(shopRepository.findById(shopId)).thenReturn(Optional.of(shop));
        when(menuItemRepository.findByIdAndCategoryMenuShopId(menuItemId, shopId)).thenReturn(Optional.empty());

        PublicCartOrderItemCreateRequest item = new PublicCartOrderItemCreateRequest();
        item.setMenuItemId(menuItemId);
        item.setQuantity(1);

        PublicCartOrderCreateRequest request = new PublicCartOrderCreateRequest();
        request.setItems(List.of(item));

        assertThatThrownBy(() -> publicSaleService.createPublicCartOrder(shopId, request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("404");
    }

    @Test
    void createPublicCartOrderThrowsWhenQuantityIsInvalid() {
        UUID shopId = UUID.randomUUID();
        UUID menuItemId = UUID.randomUUID();

        Shop shop = new Shop();
        shop.setId(shopId);
        shop.setTenantId(UUID.randomUUID());
        when(shopRepository.findById(shopId)).thenReturn(Optional.of(shop));

        PublicCartOrderItemCreateRequest item = new PublicCartOrderItemCreateRequest();
        item.setMenuItemId(menuItemId);
        item.setQuantity(0);

        PublicCartOrderCreateRequest request = new PublicCartOrderCreateRequest();
        request.setItems(List.of(item));

        assertThatThrownBy(() -> publicSaleService.createPublicCartOrder(shopId, request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("400");
    }

    @Test
    void createPublicCartOrderAcceptsNullOptionalNotes() {
        UUID shopId = UUID.randomUUID();
        UUID menuItemId = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();

        Shop shop = new Shop();
        shop.setId(shopId);
        shop.setTenantId(tenantId);

        MenuItem menuItem = new MenuItem();
        menuItem.setId(menuItemId);
        menuItem.setPrice(BigDecimal.TEN);

        when(shopRepository.findById(shopId)).thenReturn(Optional.of(shop));
        when(menuItemRepository.findByIdAndCategoryMenuShopId(menuItemId, shopId)).thenReturn(Optional.of(menuItem));
        when(publicCartOrderRepository.save(any(PublicCartOrder.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PublicCartOrderItemCreateRequest item = new PublicCartOrderItemCreateRequest();
        item.setMenuItemId(menuItemId);
        item.setQuantity(1);
        item.setNotes(null);

        PublicCartOrderCreateRequest request = new PublicCartOrderCreateRequest();
        request.setItems(List.of(item));

        publicSaleService.createPublicCartOrder(shopId, request);

        ArgumentCaptor<PublicCartOrder> orderCaptor = ArgumentCaptor.forClass(PublicCartOrder.class);
        verify(publicCartOrderRepository).save(orderCaptor.capture());
        assertThat(orderCaptor.getValue().getItems().getFirst().getNotes()).isNull();
    }

    @Test
    void cleanupExpiredPublicCartOrdersDeletesItemsAndOrdersOlderThan24Hours() {
        when(publicCartOrderItemRepository.deleteByOrderCreatedAtBefore(any(LocalDateTime.class))).thenReturn(3);
        when(publicCartOrderRepository.deleteByCreatedAtBefore(any(LocalDateTime.class))).thenReturn(2);

        LocalDateTime beforeCall = LocalDateTime.now().minusHours(24);
        publicSaleService.cleanupExpiredPublicCartOrders();
        LocalDateTime afterCall = LocalDateTime.now().minusHours(24);

        ArgumentCaptor<LocalDateTime> itemCutoffCaptor = ArgumentCaptor.forClass(LocalDateTime.class);
        ArgumentCaptor<LocalDateTime> orderCutoffCaptor = ArgumentCaptor.forClass(LocalDateTime.class);
        verify(publicCartOrderItemRepository).deleteByOrderCreatedAtBefore(itemCutoffCaptor.capture());
        verify(publicCartOrderRepository).deleteByCreatedAtBefore(orderCutoffCaptor.capture());

        LocalDateTime itemCutoff = itemCutoffCaptor.getValue();
        LocalDateTime orderCutoff = orderCutoffCaptor.getValue();
        assertThat(itemCutoff).isEqualTo(orderCutoff);
        assertThat(Duration.between(beforeCall, itemCutoff)).isNotNegative();
        assertThat(Duration.between(itemCutoff, afterCall)).isNotNegative();
    }
}
