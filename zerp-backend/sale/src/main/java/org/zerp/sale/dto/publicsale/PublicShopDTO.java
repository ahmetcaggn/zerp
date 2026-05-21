package org.zerp.sale.dto.publicsale;

import lombok.Data;

import java.util.UUID;

@Data
public class PublicShopDTO {
    private UUID id;
    private UUID tenantId;
    private String tenantName;
    private String name;
    private String description;
    private String imageId;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String phone;
    private String email;
    private String website;
}
