package org.zerp.resource.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.resource.StockReconciliationItem;

import java.util.UUID;

@Repository
public interface StockReconciliationItemRepository extends JpaRepository<StockReconciliationItem, UUID> {
}
