package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.resource.StockResource;

import java.util.UUID;

@Repository
public interface StockResourceRepository extends JpaRepository<StockResource, UUID> {
}
