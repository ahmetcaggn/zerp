package org.zerp.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.Tenant;

import java.util.UUID;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, UUID> {
}
