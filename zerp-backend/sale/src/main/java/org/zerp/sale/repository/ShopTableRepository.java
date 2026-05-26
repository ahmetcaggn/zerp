package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.sale.ShopTable;
import org.zerp.common.entity.sale.ShopTableStatus;

import java.util.Collection;
import java.util.UUID;

@Repository
public interface ShopTableRepository extends JpaRepository<ShopTable, UUID>, JpaSpecificationExecutor<ShopTable> {
    long countByShopIdAndTenantId(UUID shopId, UUID tenantId);

    long countByShopIdAndTenantIdAndStatus(UUID shopId, UUID tenantId, ShopTableStatus status);
}
