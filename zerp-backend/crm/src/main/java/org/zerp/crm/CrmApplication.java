package org.zerp.crm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = { "org.zerp.common.entity", "org.zerp.crm" })
@EnableJpaRepositories(basePackages = "org.zerp.crm.repository")
@EnableJpaAuditing
public class CrmApplication {
    static void main(String[] args) {
        SpringApplication.run(CrmApplication.class, args);
    }
}
