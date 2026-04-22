package org.zerp.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"org.zerp.user", "org.zerp.common.permission.service"})
@EntityScan("org.zerp.common")
@EnableJpaRepositories(basePackages = {"org.zerp.user.repository", "org.zerp.common.permission.repository"})
@EnableJpaAuditing
@EnableDiscoveryClient
public class UserApplication {
    static void main(String[] args) {
        SpringApplication.run(UserApplication.class, args);
    }
}
