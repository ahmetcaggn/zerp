package org.zerp.common.entity.sale;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import org.zerp.common.entity.Shop;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@Table(name = "public_cart_orders")
public class PublicCartOrder {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Column(name = "code", nullable = false, unique = true, length = 6)
    private String code;

    private String note;

    @OneToMany(mappedBy = "publicCartOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PublicCartOrderItem> items = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    protected LocalDateTime createdAt;
}
