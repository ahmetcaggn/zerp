package org.zerp.sale.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Log4j2
@Component
@RequiredArgsConstructor
public class MenuActiveLanguageUniqueIndexInitializer {
    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void ensureUniqueActiveMenuPerShopAndLanguage() {
        String sql = """
                CREATE UNIQUE INDEX IF NOT EXISTS ux_menus_active_shop_language
                ON menus (shop_id, language)
                WHERE is_active = true AND deleted = false
                """;
        try {
            jdbcTemplate.execute(sql);
            log.info("Ensured unique active menu index exists for (shop_id, language)");
        } catch (Exception e) {
            log.warn("Failed to ensure unique active menu index for (shop_id, language): {}", e.getMessage());
        }
    }
}
