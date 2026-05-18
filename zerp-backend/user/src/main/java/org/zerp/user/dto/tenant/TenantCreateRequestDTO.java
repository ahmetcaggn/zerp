package org.zerp.user.dto.tenant;

import lombok.Data;

@Data
public class TenantCreateRequestDTO {
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
