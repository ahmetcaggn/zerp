package org.zerp.crm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.zerp.common.entity.crm.TeamEntity;

public interface TeamRepository extends JpaRepository<TeamEntity, Integer>, JpaSpecificationExecutor<TeamEntity> {
}
