package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.sale.MenuItemProduct;

import java.util.List;
import java.util.UUID;

@Repository
public interface MenuItemProductRepository extends JpaRepository<MenuItemProduct, UUID> {
    List<MenuItemProduct> findByMenuItemId(UUID menuItemId);

    void deleteByMenuItemId(UUID menuItemId);
}
