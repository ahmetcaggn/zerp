package org.zerp.sale.dto.tableorder;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class PublicCartOrderPreviewDTO {
    private UUID id;
    private String code;
    private UUID shopId;
    private String note;
    private List<PublicCartOrderPreviewItemDTO> items;
}
