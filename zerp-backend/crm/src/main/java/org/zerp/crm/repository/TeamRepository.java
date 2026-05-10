package org.zerp.crm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.zerp.common.entity.crm.IssueType;
import org.zerp.common.entity.crm.TeamEntity;

import java.util.List;
import java.util.UUID;

public interface TeamRepository extends JpaRepository<TeamEntity, UUID>, JpaSpecificationExecutor<TeamEntity> {
    boolean existsByTenantIdAndType(UUID tenantId, IssueType type);

    boolean existsByTenantIdAndTypeAndIdNot(UUID tenantId, IssueType type, UUID id);

    List<TeamEntity> findAllByTenantIdAndType(UUID tenantId, IssueType type);
}
