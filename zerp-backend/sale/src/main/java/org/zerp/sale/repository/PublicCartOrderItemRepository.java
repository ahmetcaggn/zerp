package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.sale.PublicCartOrderItem;

import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public interface PublicCartOrderItemRepository extends JpaRepository<PublicCartOrderItem, UUID> {

    @Modifying
    @Query("""
            delete from PublicCartOrderItem i
            where i.publicCartOrder.createdAt < :cutoff
            """)
    int deleteByOrderCreatedAtBefore(@Param("cutoff") LocalDateTime cutoff);
}
