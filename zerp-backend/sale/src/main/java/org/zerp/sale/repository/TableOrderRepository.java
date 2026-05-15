package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.sale.TableOrder;
import org.zerp.common.entity.sale.TableOrderStatus;

import java.util.List;
import java.util.UUID;

@Repository
public interface TableOrderRepository extends JpaRepository<TableOrder, UUID>, JpaSpecificationExecutor<TableOrder> {

    List<TableOrder> findByShopTableIdAndStatus(UUID shopTableId, TableOrderStatus status);
}
