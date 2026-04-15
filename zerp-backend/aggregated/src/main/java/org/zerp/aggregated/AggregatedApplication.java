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

        new SpringApplicationBuilder()
                // 1. Parent Context (No Web Server)
                .sources(HostConfig.class).web(WebApplicationType.NONE)

                // 2. CRM Context
                .child(CrmApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "server.port=8081",
                        "spring.application.name=crm-service",
                        // Safely loads the specific properties file from your local CRM module
                        "spring.config.additional-location=optional:file:./crm/src/main/resources/"
                )

                // 3. Employee Context
                .sibling(EmployeeApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "server.port=8082",
                        "spring.application.name=employee-service",
                        // Safely loads the specific properties file from your local Employee module
                        "spring.config.additional-location=optional:file:./employee/src/main/resources/"
                )

                // 4. Notification Context
                .sibling(NotificationApplication.class).web(WebApplicationType.SERVLET)
                .properties(
                        "server.port=8083",
                        "spring.application.name=notification-service",
                        // Safely loads the specific properties file from your local Notification module
                        "spring.config.additional-location=optional:file:./notification/src/main/resources/"
                )

                .run(args);
    }
}