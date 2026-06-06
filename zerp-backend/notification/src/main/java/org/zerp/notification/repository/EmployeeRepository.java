package org.zerp.notification.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerp.common.entity.employee.Employee;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
 
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    @Query("SELECT e FROM Employee e WHERE e.id = :id AND e.tenantId = :tenantId AND e.deleted = false")
    Optional<Employee> findByIdAndTenantIdAndNotDeleted(@Param("id") UUID id, @Param("tenantId") UUID tenantId);
 
    @Query("SELECT e FROM Employee e WHERE e.tenantId = :tenantId AND e.deleted = false")
    List<Employee> findAllByTenantIdAndNotDeleted(@Param("tenantId") UUID tenantId);
 
    @Query("SELECT e FROM Employee e WHERE e.id IN :ids AND e.tenantId = :tenantId AND e.deleted = false")
    List<Employee> findAllByIdInAndTenantIdAndNotDeleted(@Param("ids") List<UUID> ids, @Param("tenantId") UUID tenantId);
}
