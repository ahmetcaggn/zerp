package org.zerp.common.entity.sale;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name= "menu_items")
@SQLDelete(sql = "UPDATE menu_items SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class MenuItem extends BaseEntity{

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
    private UUID id;

    private int position;
    private String name;
    private String description;
    private String imageId;

    // TODO eger product silinirse menuItem'dan da silinmeli.
    @OneToMany(mappedBy = "menuItem")
    private List<Product> products;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private MenuCategory category;

    private BigDecimal price;
}
