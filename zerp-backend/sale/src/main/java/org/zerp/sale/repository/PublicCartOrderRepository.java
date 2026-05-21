package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.sale.PublicCartOrder;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PublicCartOrderRepository extends JpaRepository<PublicCartOrder, UUID> {

    boolean existsByCode(String code);

    Optional<PublicCartOrder> findByCode(String code);

    @Modifying
    @Query("delete from PublicCartOrder p where p.createdAt < :cutoff")
    int deleteByCreatedAtBefore(@Param("cutoff") LocalDateTime cutoff);
}
