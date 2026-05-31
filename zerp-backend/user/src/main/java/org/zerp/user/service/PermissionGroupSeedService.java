package org.zerp.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerp.common.permission.entity.PermissionGroup;
import org.zerp.common.permission.entity.PermissionGroupSource;
import org.zerp.common.permission.entity.PredefinedPermissionGroupCode;
import org.zerp.common.permission.repository.PermissionGroupRepository;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Service
@Log4j2
@RequiredArgsConstructor
public class PermissionGroupSeedService {
    private final PermissionGroupRepository permissionGroupRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void ensurePredefinedGroupsForTenant(UUID tenantId) {
        if (tenantId == null) {
            return;
        }

        Set<PredefinedPermissionGroupCode> existingCodes = new LinkedHashSet<>();
        permissionGroupRepository.findAllByTenantIdAndSourceOrderByNameAsc(tenantId, PermissionGroupSource.PREDEFINED)
                .stream()
                .map(PermissionGroup::getCode)
                .filter(code -> code != null)
                .forEach(existingCodes::add);

        for (PredefinedPermissionGroupCode code : PredefinedPermissionGroupCode.values()) {
            if (existingCodes.contains(code)) {
                continue;
            }

            PermissionGroup group = permissionGroupRepository
                    .findByTenantIdAndSourceAndCode(tenantId, PermissionGroupSource.PREDEFINED, code)
                    .orElseGet(() -> permissionGroupRepository.findByTenantIdAndCode(tenantId, code).orElse(null));
            if (group != null) {
                boolean changed = false;
                if (group.getSource() != PermissionGroupSource.PREDEFINED) {
                    group.setSource(PermissionGroupSource.PREDEFINED);
                    changed = true;
                }
                if (Boolean.FALSE.equals(group.getActive())) {
                    group.setActive(true);
                    changed = true;
                }
                if (changed) {
                    permissionGroupRepository.save(group);
                }
                continue;
            }

            PermissionGroup toCreate = new PermissionGroup();
            toCreate.setTenantId(tenantId);
            toCreate.setSource(PermissionGroupSource.PREDEFINED);
            toCreate.setCode(code);
            toCreate.setName(resolveSeedName(tenantId, code.displayName()));
            toCreate.setDescription(code.description());
            toCreate.setScopeType(code.scopeType());
            toCreate.setActions(new LinkedHashSet<>(code.actions()));
            toCreate.setActive(true);

            try {
                permissionGroupRepository.save(toCreate);
            } catch (DataIntegrityViolationException ex) {
                log.warn("Skipping predefined permission group seed for tenant {} and code {}: {}",
                        tenantId, code, ex.getMessage());
            }
        }
    }

    private String resolveSeedName(UUID tenantId, String baseName) {
        String candidate = baseName;
        int suffix = 2;

        while (permissionGroupRepository.existsByTenantIdAndNameIgnoreCase(tenantId, candidate, null)) {
            candidate = baseName + " (" + suffix + ")";
            suffix += 1;
        }

        return candidate;
    }
}
