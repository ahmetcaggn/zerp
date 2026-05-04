package org.zerp.common.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.EnumerablePropertySource;

import java.util.Arrays;
import java.util.Comparator;
import java.util.stream.StreamSupport;

public class PropertyLogger implements ApplicationListener<ApplicationEnvironmentPreparedEvent> {

    private static final Logger LOGGER = LoggerFactory.getLogger(PropertyLogger.class);

    public PropertyLogger() {
        System.out.println("PropertyLogger initialized");
    }

    @Override
    public void onApplicationEvent(ApplicationEnvironmentPreparedEvent event) {
        ConfigurableEnvironment env = event.getEnvironment();
        String appName = env.getProperty("spring.application.name", "application");

        String output = "\n" +
                "================================================================================================\n" +
                "Properties for " + appName + ":\n" +
                "------------------------------------------------------------------------------------------------\n";

        StringBuilder sb = new StringBuilder(output);
        StreamSupport.stream(env.getPropertySources().spliterator(), false)
                .filter(EnumerablePropertySource.class::isInstance)
                .map(ps -> (EnumerablePropertySource<?>) ps)
                .flatMap(ps -> Arrays.stream(ps.getPropertyNames()))
                .distinct()
                .sorted(Comparator.naturalOrder())
                .forEach(key -> {
                    String value = env.getProperty(key);
                    if (isSensitive(key)) {
                        value = "******";
                    }
                    sb.append(key).append(" = ").append(value).append("\n");
                });
        sb.append("================================================================================================\n");

        System.out.println(sb.toString());
        LOGGER.info(sb.toString());
    }

    private boolean isSensitive(String key) {
        String lowerKey = key.toLowerCase();
        return lowerKey.contains("password") ||
               lowerKey.contains("secret") ||
               lowerKey.contains("key") ||
               lowerKey.contains("token");
    }
}
