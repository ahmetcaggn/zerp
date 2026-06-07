package org.zerp.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.zerp.s3repository.configuration.S3RepositoryProperties;
import org.zerp.user.config.PrometheusProperties;

@SpringBootApplication(scanBasePackages = {
        "org.zerp.common",
        "org.zerp.s3repository"
})
@ComponentScan(basePackages = {"org.zerp.user", "org.zerp.common", "org.zerp.s3repository"})
@EntityScan("org.zerp.common")
@EnableJpaRepositories(basePackages = {"org.zerp.user.repository", "org.zerp.common.permission.repository"})
@EnableJpaAuditing
@EnableConfigurationProperties(value = {S3RepositoryProperties.class, PrometheusProperties.class})
@EnableDiscoveryClient
@EnableFeignClients(basePackages = {"org.zerp.user.feign"})
public class UserApplication {
    static void main(String[] args) {
        SpringApplication.run(UserApplication.class, args);
    }
}
