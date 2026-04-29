package org.zerp.crm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerp.common.entity.crm.TeamMemberEntity;

import java.util.Collection;
import java.util.UUID;

public interface TeamMemberRepository extends JpaRepository<TeamMemberEntity, UUID> {
    @Query("""
            select (count(tm) > 0)
            from TeamMemberEntity tm
            where tm.user.id = :userId
              and tm.team.tenantId = :tenantId
              and tm.role in :roles
            """)
    boolean existsByUserAndTenantAndRoleIn(
            @Param("userId") UUID userId,
            @Param("tenantId") UUID tenantId,
            @Param("roles") Collection<TeamMemberEntity.TeamMemberRole> roles
    );
}
