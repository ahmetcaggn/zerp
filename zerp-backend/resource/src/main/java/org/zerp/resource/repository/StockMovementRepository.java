package org.zerp.resource.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.resource.StockMovement;
import org.zerp.resource.repository.projection.StockMovementSummaryProjection;
import org.zerp.resource.repository.projection.StockMovementTimelineBucketProjection;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface StockMovementRepository extends
        JpaRepository<StockMovement, UUID>,
        JpaSpecificationExecutor<StockMovement> {

    @Query("""
            SELECT
              COALESCE(SUM(CASE WHEN m.type = org.zerp.common.entity.resource.StockMovementType.SALE THEN m.quantity ELSE 0 END), 0) AS saleTotal,
              COALESCE(SUM(CASE WHEN m.type = org.zerp.common.entity.resource.StockMovementType.WASTE THEN m.quantity ELSE 0 END), 0) AS wasteTotal,
              COALESCE(SUM(CASE WHEN m.type = org.zerp.common.entity.resource.StockMovementType.PURCHASE THEN m.quantity ELSE 0 END), 0) AS purchaseTotal,
              COALESCE(SUM(CASE WHEN m.type = org.zerp.common.entity.resource.StockMovementType.RETURN THEN m.quantity ELSE 0 END), 0) AS returnTotal,
              COALESCE(SUM(
                CASE
                  WHEN m.type = org.zerp.common.entity.resource.StockMovementType.ADJUSTMENT
                    THEN CASE
                      WHEN m.referenceType = 'STOCK_ADJUSTMENT' THEN 0
                      WHEN m.direction = org.zerp.common.entity.resource.StockMovementDirection.OUT THEN -m.quantity
                      ELSE m.quantity
                    END
                  ELSE 0
                END
              ), 0) AS adjustmentTotal,
              COALESCE(SUM(CASE WHEN m.type = org.zerp.common.entity.resource.StockMovementType.TRANSFER THEN m.quantity ELSE 0 END), 0) AS transferTotal,
              COALESCE(SUM(
                CASE
                  WHEN m.type = org.zerp.common.entity.resource.StockMovementType.ADJUSTMENT
                    THEN CASE
                      WHEN m.referenceType = 'STOCK_ADJUSTMENT' THEN 0
                      WHEN m.direction = org.zerp.common.entity.resource.StockMovementDirection.OUT THEN -m.quantity
                      ELSE m.quantity
                    END
                  WHEN m.type = org.zerp.common.entity.resource.StockMovementType.PURCHASE
                    THEN CASE
                      WHEN m.referenceType = 'STOCK_ENTRY' THEN 0
                      ELSE m.quantity
                    END
                  WHEN m.type = org.zerp.common.entity.resource.StockMovementType.RETURN THEN m.quantity
                  WHEN m.type IN (org.zerp.common.entity.resource.StockMovementType.SALE, org.zerp.common.entity.resource.StockMovementType.WASTE, org.zerp.common.entity.resource.StockMovementType.TRANSFER) THEN -m.quantity
                  ELSE 0
                END
              ), 0) AS netDelta
            FROM StockMovement m
            WHERE m.stockResource.id = :stockResourceId
              AND m.deleted = false
              AND m.createdAt > :fromTs
              AND m.createdAt <= :toTs
            """)
    StockMovementSummaryProjection summarizeForResource(
            @Param("stockResourceId") UUID stockResourceId,
            @Param("fromTs") LocalDateTime fromTs,
            @Param("toTs") LocalDateTime toTs
    );

    @Query(value = """
            SELECT
              date_trunc(b.bucket_key, m.created_at) AS "bucketStart",
              COALESCE(SUM(
                CASE
                  WHEN m.type = 'ADJUSTMENT'
                    THEN CASE
                      WHEN m.direction = 'OUT' THEN -m.quantity
                      ELSE m.quantity
                    END
                  WHEN m.type = 'PURCHASE'
                    THEN CASE
                      WHEN m.reference_type = 'STOCK_ENTRY' THEN 0
                      ELSE m.quantity
                    END
                  WHEN m.type = 'RETURN' THEN m.quantity
                  WHEN m.type IN ('SALE', 'WASTE', 'TRANSFER') THEN -m.quantity
                  ELSE 0
                END
              ), 0) AS "movementDelta",
              COALESCE(SUM(
                CASE
                  WHEN m.type = 'ADJUSTMENT'
                    THEN CASE
                      WHEN m.reference_type = 'STOCK_ADJUSTMENT' THEN 0
                      WHEN m.direction = 'OUT' THEN -m.quantity
                      ELSE m.quantity
                    END
                  WHEN m.type = 'PURCHASE'
                    THEN CASE
                      WHEN m.reference_type = 'STOCK_ENTRY' THEN 0
                      ELSE m.quantity
                    END
                  WHEN m.type = 'RETURN' THEN m.quantity
                  WHEN m.type IN ('SALE', 'WASTE', 'TRANSFER') THEN -m.quantity
                  ELSE 0
                END
              ), 0) AS "expectedDelta",
              COUNT(m.id) AS "movementCount"
            FROM stock_movements m
            CROSS JOIN (SELECT CAST(:bucketKey AS text) AS bucket_key) b
            WHERE m.deleted = false
              AND m.stock_resource_id IN :stockResourceIds
              AND m.created_at >= :fromTs
              AND m.created_at < :toTs
            GROUP BY 1
            ORDER BY 1
            """, nativeQuery = true)
    List<StockMovementTimelineBucketProjection> aggregateTimelineByBucket(
            @Param("stockResourceIds") List<UUID> stockResourceIds,
            @Param("fromTs") LocalDateTime fromTs,
            @Param("toTs") LocalDateTime toTs,
            @Param("bucketKey") String bucketKey
    );

    @Query("""
            SELECT m
            FROM StockMovement m
            WHERE m.deleted = false
              AND m.stockResource.id IN :stockResourceIds
              AND m.createdAt >= :fromTs
              AND m.createdAt < :toTs
            ORDER BY m.createdAt DESC, m.id DESC
            """)
    List<StockMovement> findDrillDownMovements(
            @Param("stockResourceIds") List<UUID> stockResourceIds,
            @Param("fromTs") LocalDateTime fromTs,
            @Param("toTs") LocalDateTime toTs,
            Pageable pageable
    );
}
