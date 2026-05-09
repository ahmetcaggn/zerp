package org.zerp.gateway.openapi;

import org.springframework.util.StringUtils;

import java.util.Locale;

/**
 * Common utilities for OpenAPI processing.
 */
public final class OpenApiUtils {

    private OpenApiUtils() {
        // Prevent instantiation
    }

    /**
     * Converts an arbitrary string into a sanitized identifier part.
     * Replaces non-alphanumeric characters with underscores, merges multiple underscores,
     * trims leading/trailing underscores, and lowercases the result.
     *
     * @param value the string to sanitize
     * @return the sanitized identifier part, or "op" if the input is blank
     */
    public static String toIdentifierPart(String value) {
        if (!StringUtils.hasText(value)) return "op";
        return value.replaceAll("[^A-Za-z0-9]+", "_")
                .replaceAll("_+", "_")
                .replaceAll("^_|_$", "")
                .toLowerCase(Locale.ROOT);
    }
}

