package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.sale.Menu;
import org.zerp.common.entity.sale.MenuLanguage;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface MenuRepository extends
        JpaRepository<Menu, UUID>,
        JpaSpecificationExecutor<Menu> {
    Optional<Menu> findFirstByShopIdAndIsActiveTrue(UUID shopId);
    Optional<Menu> findFirstByShopIdAndLanguageAndIsActiveTrue(UUID shopId, MenuLanguage language);

    @Modifying
    @Query("""
            update Menu m
            set m.isActive = false
            where m.shop.id = :shopId
              and m.language = :language
              and (:menuId is null or m.id <> :menuId)
              and m.isActive = true
            """)
    int deactivateOtherActiveMenus(
            @Param("shopId") UUID shopId,
            @Param("language") MenuLanguage language,
            @Param("menuId") UUID menuId
    );
}
