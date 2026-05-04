package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerp.common.entity.sale.ProductType;

import java.util.UUID;

public interface ProductTypeRepository extends JpaRepository<ProductType, UUID> {
}

