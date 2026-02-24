package org.zerp.crm.adapter.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerp.common.entity.crm.TeamEntity;

public interface JpaTeamRepository extends JpaRepository<TeamEntity, Integer> {
}
