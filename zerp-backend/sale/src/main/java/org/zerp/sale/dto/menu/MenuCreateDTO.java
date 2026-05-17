package org.zerp.sale.dto.menu;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonAlias;
import org.zerp.common.entity.sale.MenuLanguage;

import java.util.UUID;

@Data
public class MenuCreateDTO {
    private String name;
    private String description;
    @JsonAlias("active")
    private boolean isActive = false;
    private MenuLanguage language = MenuLanguage.TR;
    private UUID shopId;
}
