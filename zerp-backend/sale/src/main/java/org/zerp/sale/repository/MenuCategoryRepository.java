package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.sale.MenuCategory;

import java.util.List;
import java.util.UUID;

@Repository
public interface MenuCategoryRepository extends
        JpaRepository<MenuCategory, UUID>,
        JpaSpecificationExecutor<MenuCategory> {
    List<MenuCategory> findByMenuIdOrderByDisplayOrderAscNameAsc(UUID menuId);

    List<MenuCategory> findByMenuIdOrderByNameAsc(UUID menuId);

    @Query("select coalesce(max(mc.displayOrder), 0) from MenuCategory mc where mc.menu.id = :menuId")
    int findMaxDisplayOrderByMenuId(UUID menuId);

    @Query("select distinct mc.menu.id from MenuCategory mc where mc.displayOrder is null")
    List<UUID> findMenuIdsWithMissingDisplayOrder();
}
