package org.zerp.crm.domain.team;

import java.util.List;
import java.util.Optional;

/**
 * Port (DDD) — Domain layer interface, Adapter layer implementation
 * Repository contract for the Team aggregate
 */
public interface TeamRepository {

    /**
     * Saves a new or updated team
     */
    Team save(Team team);

    /**
     * Finds a team by its ID
     */
    Optional<Team> findById(TeamId teamId);

    /**
     * Finds all teams belonging to a tenant
     */
    List<Team> findByTenantId(Integer tenantId);

    /**
     * Finds all teams that a user is a member of
     */
    List<Team> findByMemberUserId(Integer userId);

    /**
     * Deletes a team (soft delete)
     */
    void delete(TeamId teamId);

    /**
     * Checks whether a team exists
     */
    boolean exists(TeamId teamId);
}
