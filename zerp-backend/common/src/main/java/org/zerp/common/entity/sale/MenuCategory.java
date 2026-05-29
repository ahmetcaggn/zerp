package org.zerp.common.entity.sale;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;

import java.util.Set;
import java.util.UUID;

@Entity
@Data
@Table(name = "menu_categories")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.MENU_CATEGORY)
public class MenuCategory extends BaseEntity implements Permittable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String description;
    private Integer displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu;

    @OneToMany(mappedBy = "category")
    private Set<MenuItem> menuItems;

    @Override
    public String getTitle() {
        return name;
    }

    @Override
    public Permittable getParent() {
        return menu;
    }
}
