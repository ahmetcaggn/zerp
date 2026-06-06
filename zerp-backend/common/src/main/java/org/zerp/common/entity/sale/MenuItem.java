package org.zerp.common.entity.sale;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "menu_items")
@SQLDelete(sql = "UPDATE menu_items SET deleted = true, deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? AND version = ?")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.MENU_ITEM)
public class MenuItem extends BaseEntity implements Permittable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String description;
    private String imageId;
    private Integer calories;
    private String weight;

    @ElementCollection
    @CollectionTable(name = "menu_item_ingredients", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "ingredient")
    private List<String> ingredients = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "menu_item_allergens", joinColumns = @JoinColumn(name = "menu_item_id"))
    @Column(name = "allergen")
    private List<String> allergens = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private MenuCategory category;

    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MenuItemProduct> productLinks = new ArrayList<>();

    private BigDecimal price;

    @Override
    public String getTitle() {
        return name;
    }

    @Override
    public Permittable getParent() {
        return category;
    }
}
