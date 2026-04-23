package org.zerp.crm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.zerp.common.entity.crm.TicketEntity;

public interface TicketRepository extends JpaRepository<TicketEntity, Integer>, JpaSpecificationExecutor<TicketEntity> {
}
