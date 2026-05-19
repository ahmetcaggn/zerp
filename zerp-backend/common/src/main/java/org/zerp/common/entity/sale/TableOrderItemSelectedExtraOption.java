package org.zerp.common.entity.sale;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.zerp.common.entity.base.BaseEntity;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "table_order_item_selected_extra_options")
public class TableOrderItemSelectedExtraOption extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "table_order_item_id", nullable = false)
    private TableOrderItem tableOrderItem;

    @Column(nullable = false)
    private UUID extraOptionId;

    @Column(nullable = false)
    private String nameSnapshot;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal priceSnapshot;
}
