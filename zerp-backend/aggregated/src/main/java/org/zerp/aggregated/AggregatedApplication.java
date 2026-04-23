package org.zerp.aggregated;

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
@SpringBootApplication(exclude = {
        DataSourceAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class
})
public class AggregatedApplication {
    static void main(String[] args) {

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
                        "spring.config.additional-location=optional:file:./crm/src/main/resources/")

                // 2. Employee Context
                .sibling(EmployeeApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "spring.config.additional-location=optional:file:./employee/src/main/resources/")

                // 3. Notification Context
                .sibling(NotificationApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "spring.config.additional-location=optional:file:./notification/src/main/resources/")

                // 4. Resource Context
                .sibling(ResourceApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "spring.config.additional-location=optional:file:./resource/src/main/resources/")

                // 5. Sale Context
                .sibling(SaleApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "spring.config.additional-location=optional:file:./sale/src/main/resources/")

                // 6. Suggestion Context
                .sibling(SuggestionApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "spring.config.additional-location=optional:file:./suggestion/src/main/resources/")

                // 7. User context
                .sibling(UserApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "spring.config.additional-location=optional:file:./user/src/main/resources/")

                .run(args);
    }
}
