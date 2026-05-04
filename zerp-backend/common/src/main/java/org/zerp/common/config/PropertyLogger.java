package org.zerp.common.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.EnumerablePropertySource;

import java.util.Arrays;
import java.util.Comparator;
import java.util.stream.StreamSupport;

@Log4j2
public class PropertyLogger implements ApplicationListener<ApplicationEnvironmentPreparedEvent> {
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

        System.out.println(sb);
        log.info(sb.toString());
    }

    private boolean isSensitive(String key) {
        String lowerKey = key.toLowerCase();
        return lowerKey.contains("password") ||
                lowerKey.contains("secret") ||
                lowerKey.contains("key") ||
                lowerKey.contains("token") ||
                lowerKey.endsWith("pass") ||
                lowerKey.endsWith("pw")
                ;
    }
}
