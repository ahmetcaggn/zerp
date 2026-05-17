package org.zerp.crm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerp.common.entity.crm.TeamMemberEntity;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamMemberRepository extends JpaRepository<TeamMemberEntity, UUID> {
    boolean existsByTeamIdAndUserId(UUID teamId, UUID userId);
    boolean existsByUserId(UUID userId);
    Optional<TeamMemberEntity> findFirstByUserId(UUID userId);
    Optional<TeamMemberEntity> findByTeamIdAndUserId(UUID teamId, UUID userId);
    List<TeamMemberEntity> findAllByUserIdAndTeamIdIn(UUID userId, Collection<UUID> teamIds);

    @Query("""
            select tm.user.id
            from TeamMemberEntity tm
            where tm.user.id is not null
            """)
    List<UUID> findAllMemberUserIds();

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
