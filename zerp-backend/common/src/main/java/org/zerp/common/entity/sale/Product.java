package org.zerp.common.entity.sale;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.Shop;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.permission.entity.Permittable;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "products")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.PRODUCT)
public class Product extends BaseEntity implements Permittable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Column(nullable = false)
    private String name;

    private String description;

    private String imageId;

    @ManyToOne
    @JoinColumn(name = "type_id")
    private ProductType type;

    @ManyToOne
    @JoinColumn(name = "metric_id")
    private ProductMetric metric;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /**
     * Estimated preparation time in minutes.
     */
    private Integer preparationTime;

    @Column(nullable = false)
    private boolean isActive = true;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductRecipe> recipes = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductExtraOption> extraOptions = new ArrayList<>();

    @Override
    public String getTitle() {
        return name;
    }

    @Override
    public Permittable getParent() {
        return shop;
    }
}
