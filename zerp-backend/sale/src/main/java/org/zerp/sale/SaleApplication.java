package org.zerp.sale;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.zerp.s3repository.configuration.S3RepositoryProperties;

@SpringBootApplication(scanBasePackages = {
        "org.zerp.common",
        "org.zerp.s3repository"
})
@ComponentScan(basePackages = {"org.zerp.sale", "org.zerp.common", "org.zerp.s3repository"})
@EntityScan("org.zerp.common")
@EnableJpaRepositories(basePackages = {"org.zerp.sale.repository", "org.zerp.common.permission.repository"})
@EnableJpaAuditing
@EnableConfigurationProperties(value = {S3RepositoryProperties.class})
@EnableFeignClients
@EnableScheduling
public class SaleApplication {
    static void main(String[] args) {
        SpringApplication.run(SaleApplication.class, args);
    }
}
