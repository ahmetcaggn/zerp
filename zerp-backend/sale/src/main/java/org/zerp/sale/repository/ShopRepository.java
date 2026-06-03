package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.repository.query.Param;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.sale.ShopCuisineCategory;
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

    @Query(value = """
            SELECT DISTINCT s
            FROM Shop s
            LEFT JOIN s.cuisineCategories cuisineCategory
            WHERE (:applyQuery = FALSE
                OR LOWER(s.name) LIKE CONCAT('%', :q, '%')
                OR LOWER(COALESCE(s.description, '')) LIKE CONCAT('%', :q, '%'))
              AND (:applyCity = FALSE OR LOWER(COALESCE(s.city, '')) = :city)
              AND (:applyState = FALSE OR LOWER(COALESCE(s.state, '')) = :state)
              AND (:applyCuisineCategories = FALSE OR cuisineCategory IN (:cuisineCategories))
            """,
            countQuery = """
                    SELECT COUNT(DISTINCT s)
                    FROM Shop s
                    LEFT JOIN s.cuisineCategories cuisineCategory
                    WHERE (:applyQuery = FALSE
                        OR LOWER(s.name) LIKE CONCAT('%', :q, '%')
                        OR LOWER(COALESCE(s.description, '')) LIKE CONCAT('%', :q, '%'))
                      AND (:applyCity = FALSE OR LOWER(COALESCE(s.city, '')) = :city)
                      AND (:applyState = FALSE OR LOWER(COALESCE(s.state, '')) = :state)
                      AND (:applyCuisineCategories = FALSE OR cuisineCategory IN (:cuisineCategories))
                    """)
    Page<Shop> findPublicShopsFeedAll(
            @Param("applyQuery") boolean applyQuery,
            @Param("q") String q,
            @Param("applyCity") boolean applyCity,
            @Param("city") String city,
            @Param("applyState") boolean applyState,
            @Param("state") String state,
            @Param("applyCuisineCategories") boolean applyCuisineCategories,
            @Param("cuisineCategories") List<ShopCuisineCategory> cuisineCategories,
            Pageable pageable
    );

    @Query(value = """
            SELECT s.*
            FROM shops s
            WHERE s.deleted = false
              AND s.latitude IS NOT NULL
              AND s.longitude IS NOT NULL
              AND (:applyQuery = false
                OR LOWER(s.name) LIKE CONCAT('%', :q, '%')
                OR LOWER(COALESCE(s.description, '')) LIKE CONCAT('%', :q, '%'))
              AND (:applyCuisineCategories = false OR EXISTS (
                SELECT 1
                FROM shop_cuisine_categories scc
                WHERE scc.shop_id = s.id
                  AND scc.category IN (:cuisineCategories)
              ))
            ORDER BY (
                6371 * acos(
                    cos(radians(:latitude)) * cos(radians(s.latitude))
                    * cos(radians(s.longitude) - radians(:longitude))
                    + sin(radians(:latitude)) * sin(radians(s.latitude))
                )
            ) ASC, s.name ASC
            """,
            countQuery = """
                    SELECT COUNT(*)
                    FROM shops s
                    WHERE s.deleted = false
                      AND s.latitude IS NOT NULL
                      AND s.longitude IS NOT NULL
                      AND (:applyQuery = false
                        OR LOWER(s.name) LIKE CONCAT('%', :q, '%')
                        OR LOWER(COALESCE(s.description, '')) LIKE CONCAT('%', :q, '%'))
                      AND (:applyCuisineCategories = false OR EXISTS (
                        SELECT 1
                        FROM shop_cuisine_categories scc
                        WHERE scc.shop_id = s.id
                          AND scc.category IN (:cuisineCategories)
                      ))
                    """,
            nativeQuery = true)
    Page<Shop> findPublicShopsFeedNearbyAsc(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("applyQuery") boolean applyQuery,
            @Param("q") String q,
            @Param("applyCuisineCategories") boolean applyCuisineCategories,
            @Param("cuisineCategories") List<String> cuisineCategories,
            Pageable pageable
    );

    @Query(value = """
            SELECT s.*
            FROM shops s
            WHERE s.deleted = false
              AND s.latitude IS NOT NULL
              AND s.longitude IS NOT NULL
              AND (:applyQuery = false
                OR LOWER(s.name) LIKE CONCAT('%', :q, '%')
                OR LOWER(COALESCE(s.description, '')) LIKE CONCAT('%', :q, '%'))
              AND (:applyCuisineCategories = false OR EXISTS (
                SELECT 1
                FROM shop_cuisine_categories scc
                WHERE scc.shop_id = s.id
                  AND scc.category IN (:cuisineCategories)
              ))
            ORDER BY (
                6371 * acos(
                    cos(radians(:latitude)) * cos(radians(s.latitude))
                    * cos(radians(s.longitude) - radians(:longitude))
                    + sin(radians(:latitude)) * sin(radians(s.latitude))
                )
            ) DESC, s.name ASC
            """,
            countQuery = """
                    SELECT COUNT(*)
                    FROM shops s
                    WHERE s.deleted = false
                      AND s.latitude IS NOT NULL
                      AND s.longitude IS NOT NULL
                      AND (:applyQuery = false
                        OR LOWER(s.name) LIKE CONCAT('%', :q, '%')
                        OR LOWER(COALESCE(s.description, '')) LIKE CONCAT('%', :q, '%'))
                      AND (:applyCuisineCategories = false OR EXISTS (
                        SELECT 1
                        FROM shop_cuisine_categories scc
                        WHERE scc.shop_id = s.id
                          AND scc.category IN (:cuisineCategories)
                      ))
                    """,
            nativeQuery = true)
    Page<Shop> findPublicShopsFeedNearbyDesc(
            @Param("latitude") double latitude,
            @Param("longitude") double longitude,
            @Param("applyQuery") boolean applyQuery,
            @Param("q") String q,
            @Param("applyCuisineCategories") boolean applyCuisineCategories,
            @Param("cuisineCategories") List<String> cuisineCategories,
            Pageable pageable
    );
}
