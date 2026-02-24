package org.zerp.crm.adapter.persistence;

import org.springframework.stereotype.Repository;
import org.zerp.common.entity.crm.TeamEntity;
import org.zerp.common.entity.crm.TeamMemberEntity;
import org.zerp.common.entity.crm.TeamTenantEntity;
import org.zerp.crm.domain.team.*;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Repository
public class TeamRepositoryAdapter implements TeamRepository {

    private final JpaTeamRepository jpaTeamRepository;

    public TeamRepositoryAdapter(JpaTeamRepository jpaTeamRepository) {
        this.jpaTeamRepository = jpaTeamRepository;
    }

    @Override
    public Team save(Team team) {
        TeamEntity entity;

        boolean isNew = team.getId() == null || team.getId().getValue() == 0;

        if (isNew) {
            entity = createNewEntity(team);
        } else {
            entity = jpaTeamRepository.findById(team.getId().getValue())
                    .orElseThrow(() -> new IllegalStateException(
                            "Team not found for update: " + team.getId().getValue()));
            mergeIntoEntity(team, entity);
        }

        TeamEntity saved = jpaTeamRepository.save(entity);
        return toDomain(saved);
    }

    @Override
    public Optional<Team> findById(TeamId teamId) {
        return jpaTeamRepository.findById(teamId.getValue()).map(this::toDomain);
    }

    @Override
    public List<Team> findByTenantId(Integer tenantId) {
        // TODO: Add custom query when needed
        return List.of();
    }

    @Override
    public List<Team> findByMemberUserId(Integer userId) {
        // TODO: Add custom query when needed
        return List.of();
    }

    @Override
    public void delete(TeamId teamId) {
        jpaTeamRepository.deleteById(teamId.getValue());
    }

    @Override
    public boolean exists(TeamId teamId) {
        return jpaTeamRepository.existsById(teamId.getValue());
    }

    // ─── Create (new entity) ───

    private TeamEntity createNewEntity(Team team) {
        TeamEntity entity = new TeamEntity();
        applyScalarFields(team, entity);

        for (TeamMember m : team.getMembers()) {
            entity.getMembers().add(toNewMemberEntity(m, entity));
        }

        for (Integer tenantId : team.getTenantIds()) {
            entity.getTenants().add(toNewTenantEntity(tenantId, entity));
        }

        return entity;
    }

    // ─── Merge (update managed entity in-place) ───

    private void mergeIntoEntity(Team team, TeamEntity entity) {
        applyScalarFields(team, entity);
        mergeMembers(team, entity);
        mergeTenants(team, entity);
    }

    private void applyScalarFields(Team team, TeamEntity entity) {
        entity.setName(team.getName());
        entity.setDescription(team.getDescription());
        entity.setIsActive(team.isActive());
    }

    private void mergeMembers(Team team, TeamEntity entity) {
        // Index existing by ID
        Map<Integer, TeamMemberEntity> existingById = entity.getMembers().stream()
                .filter(m -> m.getId() != null)
                .collect(Collectors.toMap(TeamMemberEntity::getId, Function.identity()));

        // Collect domain member IDs (for removal detection)
        Set<Integer> domainMemberIds = team.getMembers().stream()
                .filter(m -> m.getId() != null)
                .map(TeamMember::getId)
                .collect(Collectors.toSet());

        // Remove members no longer in domain
        entity.getMembers().removeIf(me -> me.getId() != null && !domainMemberIds.contains(me.getId()));

        // Update existing or add new
        for (TeamMember domain : team.getMembers()) {
            if (domain.getId() != null && existingById.containsKey(domain.getId())) {
                // Update in-place
                TeamMemberEntity existing = existingById.get(domain.getId());
                existing.setRole(TeamMemberEntity.TeamMemberRole.valueOf(domain.getRole().name()));
            } else {
                // New member
                entity.getMembers().add(toNewMemberEntity(domain, entity));
            }
        }
    }

    private void mergeTenants(Team team, TeamEntity entity) {
        // Index existing by tenantId
        Map<Integer, TeamTenantEntity> existingByTenantId = entity.getTenants().stream()
                .collect(Collectors.toMap(TeamTenantEntity::getTenantId, Function.identity()));

        Set<Integer> domainTenantIds = new HashSet<>(team.getTenantIds());

        // Remove tenants no longer in domain
        entity.getTenants().removeIf(te -> !domainTenantIds.contains(te.getTenantId()));

        // Add new tenants
        for (Integer tenantId : team.getTenantIds()) {
            if (!existingByTenantId.containsKey(tenantId)) {
                entity.getTenants().add(toNewTenantEntity(tenantId, entity));
            }
        }
    }

    // ─── Factory methods for new child entities ───

    private TeamMemberEntity toNewMemberEntity(TeamMember member, TeamEntity team) {
        TeamMemberEntity entity = new TeamMemberEntity();
        entity.setTeam(team);
        entity.setUserId(member.getUserId());
        entity.setRole(TeamMemberEntity.TeamMemberRole.valueOf(member.getRole().name()));
        entity.setJoinedAt(member.getJoinedAt());
        return entity;
    }

    private TeamTenantEntity toNewTenantEntity(Integer tenantId, TeamEntity team) {
        TeamTenantEntity entity = new TeamTenantEntity();
        entity.setTeam(team);
        entity.setTenantId(tenantId);
        return entity;
    }

    // ─── Mapping: Entity → Domain ───

    private Team toDomain(TeamEntity entity) {
        List<TeamMember> members = new ArrayList<>();
        if (entity.getMembers() != null) {
            for (TeamMemberEntity me : entity.getMembers()) {
                members.add(TeamMember.reconstitute(
                        me.getId(),
                        me.getUserId(),
                        TeamRole.valueOf(me.getRole().name()),
                        me.getJoinedAt()));
            }
        }

        List<Integer> tenantIds = new ArrayList<>();
        if (entity.getTenants() != null) {
            for (TeamTenantEntity te : entity.getTenants()) {
                tenantIds.add(te.getTenantId());
            }
        }

        return Team.reconstitute(
                TeamId.of(entity.getId()),
                entity.getName(),
                entity.getDescription(),
                entity.getIsActive(),
                members,
                tenantIds);
    }
}
