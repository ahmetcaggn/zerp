package org.zerp.s3repository.configuration.mime;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class AllowedTypeConfiguration {
    @Bean
    AllowedImageTypes allowedImageTypes() {
        return new AllowedImageTypes(
                Map.of(
                        "image/jpeg", ".jpg",
                        "image/png", ".png",
                        "image/gif", ".gif",
                        "image/webp", ".webp"
                )
        );
    }
}
