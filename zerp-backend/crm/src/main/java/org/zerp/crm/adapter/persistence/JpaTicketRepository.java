package org.zerp.crm.adapter.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerp.common.entity.crm.TicketEntity;

public interface JpaTicketRepository extends JpaRepository<TicketEntity, Integer> {
}
