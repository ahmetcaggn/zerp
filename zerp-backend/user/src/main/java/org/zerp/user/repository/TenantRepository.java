package org.zerp.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.Tenant;

import java.util.UUID;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, UUID>, JpaSpecificationExecutor<Tenant> {
    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Tenant t WHERE LOWER(t.name) = LOWER(:name)")
    boolean existsByNameIgnoreCase(String name);

    @Query("SELECT CASE WHEN COUNT(t) > 0 THEN true ELSE false END FROM Tenant t WHERE LOWER(t.name) = LOWER(:name) AND t.id <> :id")
    boolean existsByNameIgnoreCaseAndIdNot(String name, UUID id);
}
