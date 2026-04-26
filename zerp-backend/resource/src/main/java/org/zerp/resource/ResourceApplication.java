package org.zerp.resource;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"org.zerp.resource", "org.zerp.common"})
@EntityScan("org.zerp.common")
@EnableJpaRepositories(basePackages = {"org.zerp.resource.repository", "org.zerp.common.permission.repository"})
@EnableJpaAuditing
public class ResourceApplication {
    static void main(String[] args) {
        SpringApplication.run(ResourceApplication.class, args);
    }
}
