package org.zerp.sale.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.MenuItem;
import org.zerp.common.entity.sale.PublicCartOrder;
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
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
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
