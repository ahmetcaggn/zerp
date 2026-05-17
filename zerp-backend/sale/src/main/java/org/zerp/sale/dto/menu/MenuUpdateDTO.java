package org.zerp.sale.dto.menu;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;
import org.zerp.common.entity.sale.MenuLanguage;

@Data
public class MenuUpdateDTO {
    private String name;
    private String description;
    @JsonAlias("active")
    private Boolean isActive;
    private MenuLanguage language;
}
