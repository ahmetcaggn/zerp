package org.zerp.sale.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.MenuLanguage;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.shop.ShopDTO;
import org.zerp.sale.mapper.ShopMapper;
import org.zerp.sale.permission.ShopPermissionEvaluator;
import org.zerp.sale.repository.ShopRepository;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShopServiceTest {

    @Mock
    private ShopPermissionEvaluator permissionEvaluator;
    @Mock
    private ShopRepository repository;
    @Mock
    private ShopMapper mapper;
    @Mock
    private CurrentUserIdResolver currentUserIdResolver;
    @Mock
    private FilterRefiner filterRefiner;

    @InjectMocks
    private ShopService shopService;

    @Test
    void patchDefaultLanguageRequiresUpdatePermission() {
        UUID userId = UUID.randomUUID();
        UUID shopId = UUID.randomUUID();

        Shop shop = new Shop();
        shop.setId(shopId);
        shop.setTenantId(UUID.randomUUID());
        shop.setDefaultMenuLanguage(MenuLanguage.TR);

        when(currentUserIdResolver.resolve()).thenReturn(userId);
        when(repository.findById(shopId)).thenReturn(Optional.of(shop));
        when(permissionEvaluator.canPatch(userId, shop)).thenReturn(false);

        assertThatThrownBy(() -> shopService.patch(shopId, Map.of("defaultMenuLanguage", "EN")))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("403");
    }

    @Test
    void patchDefaultLanguageUpdatesViaGenericPatchFlow() {
        UUID userId = UUID.randomUUID();
        UUID shopId = UUID.randomUUID();

        Shop shop = new Shop();
        shop.setId(shopId);
        shop.setTenantId(UUID.randomUUID());
        shop.setDefaultMenuLanguage(MenuLanguage.TR);

        when(currentUserIdResolver.resolve()).thenReturn(userId);
        when(repository.findById(shopId)).thenReturn(Optional.of(shop));
        when(permissionEvaluator.canPatch(userId, shop)).thenReturn(true);
        when(repository.save(shop)).thenReturn(shop);
        when(mapper.toDTO(shop)).thenReturn(new ShopDTO());

        shopService.patch(shopId, Map.of("defaultMenuLanguage", "EN"));

        verify(permissionEvaluator).canPatch(userId, shop);
        verify(repository).save(shop);
    }
}
