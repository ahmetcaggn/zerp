package org.zerp.employee.config;

import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AuditorAwareImpl implements AuditorAware<Long> {
    public Optional<Long> getCurrentAuditor() {
        return Optional.of(1L);
    }
}