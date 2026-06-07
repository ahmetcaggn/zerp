package org.zerp.user.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.prometheus")
public record PrometheusProperties(
        String baseUrl,
        long maxRangeSeconds
) {
}
