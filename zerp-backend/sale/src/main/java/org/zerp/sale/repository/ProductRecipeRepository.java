package org.zerp.sale.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.sale.ProductRecipe;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRecipeRepository extends
        JpaRepository<ProductRecipe, UUID>,
        JpaSpecificationExecutor<ProductRecipe> {

    @Query("SELECT r FROM ProductRecipe r LEFT JOIN FETCH r.items i LEFT JOIN FETCH i.stockResource WHERE r.product.id = :productId AND r.isDefault = true")
    List<ProductRecipe> findDefaultRecipesWithItemsByProductId(@Param("productId") UUID productId);
}
