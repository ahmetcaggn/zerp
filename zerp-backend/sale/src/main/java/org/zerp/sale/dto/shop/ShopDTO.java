package org.zerp.sale.dto.shop;

import lombok.Data;
import org.zerp.common.entity.sale.MenuLanguage;
import org.zerp.common.entity.sale.ShopCuisineCategory;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
public class ShopDTO {
    private UUID id;
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
    private Double latitude;
    private Double longitude;
    private Set<ShopCuisineCategory> cuisineCategories;
    private List<ShopWorkingHourDTO> workingHours;
    private MenuLanguage defaultMenuLanguage;
    private UUID tenantId;
}
