package org.zerp.common.entity.sale;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Table(name = "public_cart_order_items")
public class PublicCartOrderItem {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "public_cart_order_id", nullable = false)
    private PublicCartOrder publicCartOrder;

    @ManyToOne
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    private int quantity;

    private BigDecimal unitPrice;

    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    protected LocalDateTime createdAt;
}
