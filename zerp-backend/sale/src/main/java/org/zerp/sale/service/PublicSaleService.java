package org.zerp.sale.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.Menu;
import org.zerp.common.entity.sale.MenuCategory;
import org.zerp.common.entity.sale.Product;
import org.zerp.sale.dto.publicsale.PublicActiveMenuDTO;
import org.zerp.sale.dto.publicsale.PublicMenuCategoryDTO;
import org.zerp.sale.dto.publicsale.PublicProductDTO;
import org.zerp.sale.dto.publicsale.PublicShopDTO;
import org.zerp.sale.dto.publicsale.PublicShopMenuResponseDTO;
import org.zerp.sale.repository.MenuCategoryRepository;
import org.zerp.sale.repository.MenuRepository;
import org.zerp.sale.repository.ProductRepository;
import org.zerp.sale.repository.ShopRepository;

import java.util.List;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class PublicSaleService {
    private final ShopRepository shopRepository;
    private final MenuRepository menuRepository;
    private final MenuCategoryRepository menuCategoryRepository;
    private final ProductRepository productRepository;

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
    public Page<PublicProductDTO> getProductsByCategory(UUID shopId, UUID categoryId, Pageable pageable) {
        ensureShopExists(shopId);
        Menu activeMenu = menuRepository.findFirstByShopIdAndIsActiveTrue(shopId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No active menu found for this shop"));

        Page<Product> page = productRepository
                .findByShopIdAndMenuItemCategoryIdAndMenuItemCategoryMenuIdAndIsActiveTrue(
                        shopId,
                        categoryId,
                        activeMenu.getId(),
                        pageable
                );
        log.debug("Found {} products for public category listing", page.getTotalElements());
        return page.map(this::toPublicProduct);
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

    private PublicProductDTO toPublicProduct(Product product) {
        PublicProductDTO dto = new PublicProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setImageId(product.getImageId());
        dto.setMenuItemId(product.getMenuItem() != null ? product.getMenuItem().getId() : null);
        dto.setPreparationTime(product.getPreparationTime());
        dto.setAvailable(product.isActive());
        return dto;
    }
}
