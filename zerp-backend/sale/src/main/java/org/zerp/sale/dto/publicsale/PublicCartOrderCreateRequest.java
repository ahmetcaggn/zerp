package org.zerp.sale.dto.publicsale;

import lombok.Data;

import java.util.List;

@Data
public class PublicCartOrderCreateRequest {
    private String note;
    private List<PublicCartOrderItemCreateRequest> items;
}
