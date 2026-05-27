package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.zerp.common.entity.Shop;
import org.springframework.data.domain.Pageable;

import java.util.List;
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
    List<Shop> findAllByOrderByNameAsc();

    @Query(value = """
            SELECT s.*
            FROM shops s
            WHERE s.deleted = false
              AND s.latitude IS NOT NULL
              AND s.longitude IS NOT NULL
            ORDER BY (
                6371 * acos(
                    cos(radians(:latitude)) * cos(radians(s.latitude))
                    * cos(radians(s.longitude) - radians(:longitude))
                    + sin(radians(:latitude)) * sin(radians(s.latitude))
                )
            ) ASC
            """,
            countQuery = """
                    SELECT COUNT(*)
                    FROM shops s
                    WHERE s.deleted = false
                      AND s.latitude IS NOT NULL
                      AND s.longitude IS NOT NULL
                    """,
            nativeQuery = true)
    Page<Shop> findNearestShops(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            Pageable pageable
    );
}
