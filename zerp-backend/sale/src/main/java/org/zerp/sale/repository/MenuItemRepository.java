package org.zerp.sale.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.sale.MenuItem;

import java.util.UUID;

@Repository
public interface MenuItemRepository extends
        JpaRepository<MenuItem, UUID>,
        JpaSpecificationExecutor<MenuItem> {
    Page<MenuItem> findByCategoryIdAndCategoryMenuIdAndCategoryMenuShopId(
            UUID categoryId,
            UUID menuId,
            UUID shopId,
            Pageable pageable
    );
}
