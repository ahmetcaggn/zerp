package org.zerp.resource.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.resource.StockMovement;

import java.util.UUID;

@Repository
public interface StockMovementRepository extends
        JpaRepository<StockMovement, UUID>,
        JpaSpecificationExecutor<StockMovement> {
}
