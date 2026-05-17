package org.zerp.sale;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ComponentScan(basePackages = {"org.zerp.sale", "org.zerp.common"})
@EntityScan("org.zerp.common")
@EnableJpaRepositories(basePackages = {"org.zerp.sale.repository", "org.zerp.common.permission.repository"})
@EnableJpaAuditing
@EnableFeignClients
@EnableScheduling
public class SaleApplication {
    static void main(String[] args) {
        SpringApplication.run(SaleApplication.class, args);
    }
}
