package org.zerp.sale.dto.publicsale;

import lombok.Data;

import java.util.UUID;

@Data
public class PublicActiveMenuDTO {
    private UUID id;
    private String name;
    private String description;
    private boolean isActive;
}
