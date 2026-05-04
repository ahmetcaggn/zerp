package org.zerp.sale.config;

import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.NullMarked;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;
import org.zerp.common.util.header.CurrentUserIdResolver;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class AuditorAwareImpl implements AuditorAware<UUID> {
    private final CurrentUserIdResolver currentUserIdResolver;

    @Override
    @NullMarked
    public Optional<UUID> getCurrentAuditor() {
        return Optional.of(resolveCurrentUserId());
    }

    private UUID resolveCurrentUserId() {
        return currentUserIdResolver.resolve();
    }
}