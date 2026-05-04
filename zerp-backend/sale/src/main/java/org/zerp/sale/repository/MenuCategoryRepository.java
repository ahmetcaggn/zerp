package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.sale.MenuCategory;

import java.util.UUID;

@Repository
public interface MenuCategoryRepository extends
        JpaRepository<MenuCategory, UUID>,
        JpaSpecificationExecutor<MenuCategory> {
}
