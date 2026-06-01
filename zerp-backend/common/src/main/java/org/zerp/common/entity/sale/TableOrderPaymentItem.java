package org.zerp.common.entity.sale;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import org.zerp.common.entity.base.BaseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "table_order_payment_items")
public class TableOrderPaymentItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "payment_id", nullable = false)
    private TableOrderPayment payment;

    private UUID menuItemId;

    private String menuItemName;

    private int quantity;

    private BigDecimal unitPrice;

    private String notes;

    @OneToMany(mappedBy = "paymentItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TableOrderPaymentItemSelectedExtraOption> selectedExtraOptions = new ArrayList<>();
}
