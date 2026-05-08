package org.zerp.aggregated;

import lombok.extern.log4j.Log4j2;
import org.apache.catalina.startup.HostConfig;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.hibernate.autoconfigure.HibernateJpaAutoConfiguration;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;
import org.zerp.crm.CrmApplication;
import org.zerp.employee.EmployeeApplication;
import org.zerp.notification.NotificationApplication;
import org.zerp.resource.ResourceApplication;
import org.zerp.sale.SaleApplication;
import org.zerp.suggestion.SuggestionApplication;
import org.zerp.user.UserApplication;

/**
 * The Java app to run all feature services on only one jvm. use only for development and testing, not for production.
 */
@Log4j2
@SpringBootApplication(exclude = {
        DataSourceAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class
})
public class AggregatedApplication {
    static void main(String[] args) {
        String configRoot = System.getenv("AGGREGATED_CONFIG_ROOT");
        String crmConfig = resolveConfigPath(configRoot, "crm", "CRM_CONFIG_PATH");
        String employeeConfig = resolveConfigPath(configRoot, "employee", "EMPLOYEE_CONFIG_PATH");
        String notificationConfig = resolveConfigPath(configRoot, "notification", "NOTIFICATION_CONFIG_PATH");
        String resourceConfig = resolveConfigPath(configRoot, "resource", "RESOURCE_CONFIG_PATH");
        String saleConfig = resolveConfigPath(configRoot, "sale", "SALE_CONFIG_PATH");
        String suggestionConfig = resolveConfigPath(configRoot, "suggestion", "SUGGESTION_CONFIG_PATH");
        String userConfig = resolveConfigPath(configRoot, "user", "USER_CONFIG_PATH");

        log.info("Starting AggregatedApplication with the following configurations:");
        log.info("AGGREGATED_CONFIG_ROOT: {}", configRoot);
        log.info("CRM config path: {}", crmConfig);
        log.info("Employee config path: {}", employeeConfig);
        log.info("Notification config path: {}", notificationConfig);
        log.info("Resource config path: {}", resourceConfig);
        log.info("Sale config path: {}", saleConfig);
        log.info("Suggestion config path: {}", suggestionConfig);
        log.info("User config path: {}", userConfig);

        // Disable JMX globally to prevent HikariCP pool name clashes
        System.setProperty("spring.jmx.enabled", "false");
        // Disable Spring Boot admin MBean registration to avoid duplicate ObjectName
        // when multiple sibling ApplicationContexts run in the same JVM.
        System.setProperty("spring.application.admin.enabled", "false");

        new SpringApplicationBuilder()
                // 0. Parent Context (No Web Server)
                .sources(HostConfig.class).web(WebApplicationType.NONE)

                // 1. CRM Context
                .child(CrmApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "spring.config.additional-location=optional:file:" + crmConfig)

                // 2. Employee Context
                .sibling(EmployeeApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "spring.config.additional-location=optional:file:" + employeeConfig)

                // 3. Notification Context
                .sibling(NotificationApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "spring.config.additional-location=optional:file:" + notificationConfig)

                // 4. Resource Context
                .sibling(ResourceApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "spring.config.additional-location=optional:file:" + resourceConfig)

                // 5. Sale Context
                .sibling(SaleApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "spring.config.additional-location=optional:file:" + saleConfig)

                // 6. Suggestion Context
                .sibling(SuggestionApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "spring.config.additional-location=optional:file:" + suggestionConfig)

                // 7. User context
                .sibling(UserApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "spring.config.additional-location=optional:file:" + userConfig)

                .run(args);
    }

    private static String resolveConfigPath(String root, String service, String envName) {
        String override = System.getenv(envName);
        if (override != null && !override.isBlank()) {
            return override;
        }

        if (root == null || root.isBlank()) {
            return "./" + service + "/src/main/resources/";
        }

        String normalizedRoot = root.endsWith("/") ? root : root + "/";
        return normalizedRoot + service + "/";
    }
}
