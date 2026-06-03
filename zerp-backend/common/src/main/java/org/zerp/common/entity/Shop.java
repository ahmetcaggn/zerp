package org.zerp.common.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Column;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.entity.sale.MenuLanguage;
import org.zerp.common.entity.sale.ShopCuisineCategory;
import org.zerp.common.entity.sale.ShopTable;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;

import java.util.List;
import java.util.Set;
import java.util.LinkedHashSet;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(
        name = "shops",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_shops_tenant_name", columnNames = {"tenant_id", "name"})
        }
)
@SQLDelete(sql = "UPDATE shops SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.SHOP)
public class Shop extends BaseEntity implements Permittable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String description;
    private String imageId;

    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String phone;
    private String email;
    private String website;
    private Double latitude;
    private Double longitude;

    @ElementCollection(targetClass = ShopCuisineCategory.class)
    @CollectionTable(name = "shop_cuisine_categories", joinColumns = @JoinColumn(name = "shop_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private Set<ShopCuisineCategory> cuisineCategories = new LinkedHashSet<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @ColumnDefault("'TR'")
    private MenuLanguage defaultMenuLanguage = MenuLanguage.TR;

    @ManyToOne
    @JoinColumn(name = "tenant_id", insertable = false, updatable = false)
    private Tenant tenant;

    @OneToOne
    @JoinColumn(name = "legal_profile_id")
    private LegalProfile legalProfile;

    @OneToMany(mappedBy = "shop")
    private List<ShopTable> tables;

    @Override
    public String getTitle() {
        return name;
    }

    @Override
    public Permittable getParent() {
        return tenant;
    }
}
