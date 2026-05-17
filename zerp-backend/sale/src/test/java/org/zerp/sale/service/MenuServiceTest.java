package org.zerp.sale.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.Menu;
import org.zerp.common.entity.sale.MenuLanguage;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.sale.dto.menu.MenuCreateDTO;
import org.zerp.sale.dto.menu.MenuDTO;
import org.zerp.sale.dto.menu.MenuUpdateDTO;
import org.zerp.sale.mapper.MenuMapper;
import org.zerp.sale.permission.MenuPermissionEvaluator;
import org.zerp.sale.repository.MenuRepository;
import org.zerp.sale.repository.ShopRepository;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MenuServiceTest {

    @Mock
    private MenuPermissionEvaluator permissionEvaluator;
    @Mock
    private MenuRepository repository;
    @Mock
    private ShopRepository shopRepository;
    @Mock
    private MenuMapper mapper;
    @Mock
    private CurrentUserIdResolver currentUserIdResolver;
    @Mock
    private CurrentTenantIdResolver currentTenantIdResolver;
    @Mock
    private FilterRefiner filterRefiner;

    @InjectMocks
    private MenuService menuService;

    @Test
    void createActivatingTurkishMenuDeactivatesOnlyTurkishMenusInShop() {
        UUID userId = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();
        UUID shopId = UUID.randomUUID();
        UUID menuId = UUID.randomUUID();

        Shop shop = new Shop();
        shop.setId(shopId);

        Menu menu = new Menu();
        menu.setId(menuId);
        menu.setShop(shop);
        menu.setLanguage(MenuLanguage.TR);
        menu.setActive(true);

        MenuCreateDTO createDTO = new MenuCreateDTO();
        createDTO.setName("TR menu");
        createDTO.setShopId(shopId);
        createDTO.setLanguage(MenuLanguage.TR);
        createDTO.setActive(true);

        when(currentUserIdResolver.resolve()).thenReturn(userId);
        when(currentTenantIdResolver.resolve()).thenReturn(tenantId);
        when(shopRepository.findById(shopId)).thenReturn(Optional.of(shop));
        when(permissionEvaluator.canCreate(userId, shopId, tenantId)).thenReturn(true);
        when(mapper.toEntity(createDTO)).thenReturn(menu);
        when(repository.save(any(Menu.class))).thenReturn(menu);
        when(mapper.toDTO(menu)).thenReturn(new MenuDTO());

        assertThatCode(() -> menuService.create(createDTO)).doesNotThrowAnyException();

        verify(repository).deactivateOtherActiveMenus(shopId, MenuLanguage.TR, menuId);
    }

    @Test
    void createActivatingEnglishMenuKeepsTurkishActiveMenuIndependent() {
        UUID userId = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();
        UUID shopId = UUID.randomUUID();
        UUID menuId = UUID.randomUUID();

        Shop shop = new Shop();
        shop.setId(shopId);

        Menu menu = new Menu();
        menu.setId(menuId);
        menu.setShop(shop);
        menu.setLanguage(MenuLanguage.EN);
        menu.setActive(true);

        MenuCreateDTO createDTO = new MenuCreateDTO();
        createDTO.setName("EN menu");
        createDTO.setShopId(shopId);
        createDTO.setLanguage(MenuLanguage.EN);
        createDTO.setActive(true);

        when(currentUserIdResolver.resolve()).thenReturn(userId);
        when(currentTenantIdResolver.resolve()).thenReturn(tenantId);
        when(shopRepository.findById(shopId)).thenReturn(Optional.of(shop));
        when(permissionEvaluator.canCreate(userId, shopId, tenantId)).thenReturn(true);
        when(mapper.toEntity(createDTO)).thenReturn(menu);
        when(repository.save(any(Menu.class))).thenReturn(menu);
        when(mapper.toDTO(menu)).thenReturn(new MenuDTO());

        assertThatCode(() -> menuService.create(createDTO)).doesNotThrowAnyException();

        verify(repository).deactivateOtherActiveMenus(shopId, MenuLanguage.EN, menuId);
    }

    @Test
    void updateChangingLanguageEnforcesSingleActiveMenuForNewLanguage() {
        UUID userId = UUID.randomUUID();
        UUID shopId = UUID.randomUUID();
        UUID menuId = UUID.randomUUID();

        Shop shop = new Shop();
        shop.setId(shopId);

        Menu existingMenu = new Menu();
        existingMenu.setId(menuId);
        existingMenu.setShop(shop);
        existingMenu.setLanguage(MenuLanguage.TR);
        existingMenu.setActive(true);

        MenuUpdateDTO updateDTO = new MenuUpdateDTO();
        updateDTO.setLanguage(MenuLanguage.EN);
        updateDTO.setIsActive(true);

        when(currentUserIdResolver.resolve()).thenReturn(userId);
        when(repository.findById(menuId)).thenReturn(Optional.of(existingMenu));
        when(permissionEvaluator.canUpdate(userId, existingMenu)).thenReturn(true);
        when(repository.save(existingMenu)).thenReturn(existingMenu);
        when(mapper.toDTO(existingMenu)).thenReturn(new MenuDTO());

        assertThatCode(() -> menuService.update(menuId, updateDTO)).doesNotThrowAnyException();

        verify(repository).deactivateOtherActiveMenus(shopId, MenuLanguage.EN, menuId);
    }
}
