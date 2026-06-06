package org.zerp.common.entity.sale;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import org.zerp.common.entity.base.BaseEntity;

import java.util.ArrayList;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "table_order_items")
public class TableOrderItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private TableOrder order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Column(name = "menu_item_id", insertable = false, updatable = false)
    private UUID menuItemId;

    private String menuItemName;

    private UUID categoryId;

    private String categoryName;

    private int quantity;

    private BigDecimal unitPrice;

    private String notes;

    @OneToMany(mappedBy = "tableOrderItem", cascade = jakarta.persistence.CascadeType.ALL, orphanRemoval = true)
    private List<TableOrderItemSelectedExtraOption> selectedExtraOptions = new ArrayList<>();
}
