package org.zerp.sale.dto.publicsale;

import lombok.Data;

import java.util.UUID;

@Data
public class PublicCartOrderItemCreateRequest {
    private UUID menuItemId;
    private int quantity;
    private String notes;
}
