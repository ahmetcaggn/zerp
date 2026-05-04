package org.zerp.resource.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerp.common.entity.Shop;

import java.util.UUID;

public interface ShopRepository extends JpaRepository<Shop, UUID> {
}

