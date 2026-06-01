package org.zerp.common.entity.sale;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import org.zerp.common.entity.base.BaseEntity;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Data
@Table(name = "table_order_payment_item_extra_options")
public class TableOrderPaymentItemSelectedExtraOption extends BaseEntity {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "payment_item_id", nullable = false)
    private TableOrderPaymentItem paymentItem;

    private UUID extraOptionId;

    private String name;

    private BigDecimal price;
}
