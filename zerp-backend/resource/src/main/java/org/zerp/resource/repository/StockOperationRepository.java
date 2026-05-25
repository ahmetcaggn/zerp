package org.zerp.resource.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.resource.StockOperation;

import java.util.List;
import java.util.UUID;

@Repository
public interface StockOperationRepository extends
        JpaRepository<StockOperation, UUID>,
        JpaSpecificationExecutor<StockOperation> {
    List<StockOperation> findByShop_IdOrderByCreatedAtDesc(UUID shopId, Pageable pageable);
}
