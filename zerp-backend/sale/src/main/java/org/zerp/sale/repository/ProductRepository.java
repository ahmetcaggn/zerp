package org.zerp.sale.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.sale.Product;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends
        JpaRepository<Product, UUID>,
        JpaSpecificationExecutor<Product> {

    List<Product> findByMenuItemId(UUID menuItemId);

    Page<Product> findByShopIdAndMenuItemCategoryIdAndMenuItemCategoryMenuIdAndIsActiveTrue(
            UUID shopId,
            UUID categoryId,
            UUID menuId,
            Pageable pageable
    );
}
