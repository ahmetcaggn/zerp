package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.sale.TableOrderItem;

import java.util.UUID;

@Repository
public interface TableOrderItemRepository extends JpaRepository<TableOrderItem, UUID> {

    @Modifying
    @Query("""
            update TableOrderItem item
            set item.menuItemName = :menuItemName,
                item.categoryId = :categoryId,
                item.categoryName = :categoryName
            where item.menuItemId = :menuItemId
              and item.menuItemName is null
            """)
    int backfillMenuItemSnapshots(
            @Param("menuItemId") UUID menuItemId,
            @Param("menuItemName") String menuItemName,
            @Param("categoryId") UUID categoryId,
            @Param("categoryName") String categoryName
    );
}
