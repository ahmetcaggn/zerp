package org.zerp.crm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"org.zerp.crm", "org.zerp.common.permission.service"})
@EntityScan(basePackages = { "org.zerp.common", "org.zerp.crm" })
@EnableJpaRepositories(basePackages = {"org.zerp.crm.repository", "org.zerp.common.permission.repository"})
@EnableJpaAuditing
public class CrmApplication {
    static void main(String[] args) {
        SpringApplication.run(CrmApplication.class, args);
    }
}
