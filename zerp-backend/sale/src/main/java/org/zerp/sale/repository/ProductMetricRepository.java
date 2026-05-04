package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerp.common.entity.sale.ProductMetric;

import java.util.UUID;

public interface ProductMetricRepository extends JpaRepository<ProductMetric, UUID> {
}

