package org.zerp.employee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
@EntityScan("org.zerp.common")
@EnableJpaRepositories(basePackages = {"org.zerp.employee.repository", "org.zerp.common.permission.repository"})
@EnableJpaAuditing
public class EmployeeApplication {
    static void main(String[] args) {
        SpringApplication.run(EmployeeApplication.class, args);
    }
}
