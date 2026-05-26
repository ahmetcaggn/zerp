package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.resource.StockResource;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface StockResourceRepository extends JpaRepository<StockResource, UUID> {
    @Query("""
            select s
            from StockResource s
            where s.shop.id = :shopId
              and s.tenantId = :tenantId
              and s.reorderThreshold is not null
              and s.reorderThreshold > :minimumThreshold
              and s.quantity <= s.reorderThreshold
            order by s.quantity asc
            """)
    List<StockResource> findLowStockResourcesForDashboard(
            @Param("shopId") UUID shopId,
            @Param("tenantId") UUID tenantId,
            @Param("minimumThreshold") BigDecimal minimumThreshold
    );
}
