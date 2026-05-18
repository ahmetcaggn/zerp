package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.zerp.common.entity.Shop;

import java.util.UUID;

public interface ShopRepository extends JpaRepository<Shop, UUID>, JpaSpecificationExecutor<Shop> {
    @Query("""
            SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END
            FROM Shop s
            WHERE s.tenantId = :tenantId
              AND LOWER(s.name) = LOWER(:name)
            """)
    boolean existsByTenantIdAndNameIgnoreCase(UUID tenantId, String name);

    @Query("""
            SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END
            FROM Shop s
            WHERE s.tenantId = :tenantId
              AND LOWER(s.name) = LOWER(:name)
              AND s.id <> :shopId
            """)
    boolean existsByTenantIdAndNameIgnoreCaseAndIdNot(UUID tenantId, String name, UUID shopId);
}
