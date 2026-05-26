package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.sale.TableOrder;
import org.zerp.common.entity.sale.TableOrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface TableOrderRepository extends JpaRepository<TableOrder, UUID>, JpaSpecificationExecutor<TableOrder> {

    List<TableOrder> findByShopTableIdAndStatus(UUID shopTableId, TableOrderStatus status);

    interface CategorySalesAggregateRow {
        UUID getCategoryId();
        String getCategoryName();
        BigDecimal getRevenue();
    }

    interface TopProductAggregateRow {
        UUID getMenuItemId();
        String getMenuItemName();
        Long getSoldCount();
        BigDecimal getRevenue();
    }

    interface DailyOrderMetricsAggregateRow {
        BigDecimal getDailyRevenue();
        Long getPaidOrderCount();
    }

    @Query("""
            select
                oi.menuItem.category.id as categoryId,
                oi.menuItem.category.name as categoryName,
                sum(oi.unitPrice * oi.quantity) as revenue
            from TableOrder o
            join o.items oi
            where o.shop.id = :shopId
              and o.tenantId = :tenantId
              and o.status = :status
              and o.createdAt >= :startInclusive
              and o.createdAt < :endExclusive
            group by oi.menuItem.category.id, oi.menuItem.category.name
            order by sum(oi.unitPrice * oi.quantity) desc
            """)
    List<CategorySalesAggregateRow> findCategorySalesForDashboard(
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId,
            @Param("status") TableOrderStatus status,
            @Param("startInclusive") LocalDateTime startInclusive,
            @Param("endExclusive") LocalDateTime endExclusive
    );

    @Query("""
            select
                oi.menuItem.id as menuItemId,
                oi.menuItem.name as menuItemName,
                sum(oi.quantity) as soldCount,
                sum(oi.unitPrice * oi.quantity) as revenue
            from TableOrder o
            join o.items oi
            where o.shop.id = :shopId
              and o.tenantId = :tenantId
              and o.status = :status
              and o.createdAt >= :startInclusive
              and o.createdAt < :endExclusive
            group by oi.menuItem.id, oi.menuItem.name
            order by sum(oi.quantity) desc, sum(oi.unitPrice * oi.quantity) desc
            """)
    List<TopProductAggregateRow> findTopProductsForDashboard(
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId,
            @Param("status") TableOrderStatus status,
            @Param("startInclusive") LocalDateTime startInclusive,
            @Param("endExclusive") LocalDateTime endExclusive
    );

    @Query("""
            select
                sum(oi.unitPrice * oi.quantity) as dailyRevenue,
                count(distinct o.id) as paidOrderCount
            from TableOrder o
            left join o.items oi
            where o.shop.id = :shopId
              and o.tenantId = :tenantId
              and o.status = :status
              and o.createdAt >= :startInclusive
              and o.createdAt < :endExclusive
            """)
    DailyOrderMetricsAggregateRow findDailyOrderMetricsForDashboard(
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId,
            @Param("status") TableOrderStatus status,
            @Param("startInclusive") LocalDateTime startInclusive,
            @Param("endExclusive") LocalDateTime endExclusive
    );
}
