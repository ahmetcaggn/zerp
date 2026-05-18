package org.zerp.user.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.zerp.common.entity.Tenant;
import org.zerp.common.entity.TenantRoot;
import org.zerp.user.repository.TenantRepository;

@Log4j2
@Component
@RequiredArgsConstructor
public class TenantRootSeeder {
    private static final String TENANT_ROOT_NAME = "tenant-root";

    private final TenantRepository tenantRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void ensureTenantRootExists() {
        if (tenantRepository.existsById(TenantRoot.ID)) {
            log.debug("Tenant root already exists. Skipping seed.");
            return;
        }

        Tenant tenantRoot = new Tenant();
        tenantRoot.setId(TenantRoot.ID);
        tenantRoot.setName(TENANT_ROOT_NAME);

        try {
            tenantRepository.save(tenantRoot);
            log.info("Seeded tenant root with id {}", TenantRoot.ID);
        } catch (DataIntegrityViolationException ex) {
            log.warn("Tenant root insert skipped, it may have been created by another instance: {}", ex.getMessage());
        }
    }
}
