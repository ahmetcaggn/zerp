package org.zerp.s3repository.configuration.mime;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Class representing allowed image types and their corresponding file extensions.
 * <p>
 * {@code
 *    @Bean
 *    AllowedImageTypes allowedImageTypes() {
 *        return new AllowedImageTypes(
 *                Map.of(
 *                        "image/jpeg", ".jpg",
 *                        "image/png", ".png",
 *                        "image/gif", ".gif",
 *                        "image/webp", ".webp"
 *                )
 *        );
 *    }
 * }
 */
@RequiredArgsConstructor
public class AllowedImageTypes {
    private final Map<String, String> allowedTypes;

    public String getExtensionIfAllowed(String key) {
        return allowedTypes.get(key);
    }
}
