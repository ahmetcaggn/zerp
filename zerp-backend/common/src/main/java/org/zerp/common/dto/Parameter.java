package org.zerp.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic key-value pair attached to an {@link ApiResponse}.
 * Use for conveying extra metadata (e.g. feature flags, debug hints,
 * redirect URLs) without polluting the main {@code data} payload.
 *
 * <pre>
 * "parameters": [
 *   { "key": "redirectUrl", "value": "/dashboard" },
 *   { "key": "retryAfter",  "value": "30" }
 * ]
 * </pre>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Parameter {

    /** Parameter name. */
    private String key;

    /** Parameter value. */
    private String value;

    /** Convenience factory. */
    public static Parameter of(String key, String value) {
        return new Parameter(key, value);
    }
}
