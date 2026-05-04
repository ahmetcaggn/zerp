package org.zerp.resource.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.resource.StockCount;

import java.util.UUID;

@Repository
public interface StockCountRepository extends
        JpaRepository<StockCount, UUID>,
        JpaSpecificationExecutor<StockCount> {
}
