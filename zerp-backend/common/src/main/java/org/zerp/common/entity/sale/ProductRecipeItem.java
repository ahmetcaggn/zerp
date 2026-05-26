package org.zerp.common.entity.sale;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.entity.resource.StockResource;
import org.zerp.common.entity.resource.UnitType;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "product_recipe_items")
public class ProductRecipeItem extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private ProductRecipe recipe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_resource_id", nullable = false)
    private StockResource stockResource;

    @Column(nullable = false, precision = 15, scale = 6)
    private BigDecimal quantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "unit_type", nullable = false)
    private UnitType unitType;

    @Column(name = "converted_quantity", precision = 15, scale = 6)
    private BigDecimal convertedQuantity;

    @Enumerated(EnumType.STRING)
    @Column(name = "base_unit_type")
    private UnitType baseUnitType;

    private String notes;
}
