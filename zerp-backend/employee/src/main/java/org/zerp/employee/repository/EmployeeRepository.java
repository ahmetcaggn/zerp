package org.zerp.employee.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerp.common.entity.employee.Employee;
import org.zerp.common.entity.employee.EmploymentStatus;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // =============================================
    // Soft Delete Aware Queries (exclude deleted records)
    // =============================================

    @Query("SELECT e FROM Employee e WHERE e.id = :id AND e.isDeleted = false")
    Optional<Employee> findByIdAndNotDeleted(@Param("id") Long id);

    @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.contacts WHERE e.id = :id AND e.isDeleted = false")
    Optional<Employee> findByIdWithContactsAndNotDeleted(@Param("id") Long id);

    @Query("SELECT e FROM Employee e WHERE e.email = :email AND e.isDeleted = false")
    Optional<Employee> findByEmailAndNotDeleted(@Param("email") String email);

    @Query("SELECT e FROM Employee e WHERE e.nationalId = :nationalId AND e.isDeleted = false")
    Optional<Employee> findByNationalIdAndNotDeleted(@Param("nationalId") String nationalId);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Employee e WHERE e.email = :email AND e.isDeleted = false")
    boolean existsByEmailAndNotDeleted(@Param("email") String email);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Employee e WHERE e.nationalId = :nationalId AND e.isDeleted = false")
    boolean existsByNationalIdAndNotDeleted(@Param("nationalId") String nationalId);

    @Query("SELECT e FROM Employee e WHERE e.isDeleted = false")
    List<Employee> findAllNotDeleted();

    @Query("SELECT e FROM Employee e WHERE e.isDeleted = false")
    Page<Employee> findAllNotDeleted(Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.status = :status AND e.isDeleted = false")
    List<Employee> findByStatusAndNotDeleted(@Param("status") EmploymentStatus status);

    @Query("SELECT e FROM Employee e WHERE e.manager.id = :managerId AND e.isDeleted = false")
    List<Employee> findByManagerIdAndNotDeleted(@Param("managerId") Long managerId);

    @Query("SELECT e FROM Employee e WHERE e.isDeleted = false AND (" +
            "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%')) )")
    Page<Employee> searchEmployeesNotDeleted(@Param("keyword") String keyword, Pageable pageable);

    // =============================================
    // Include Deleted Records (for admin/audit purposes)
    // =============================================

    @Query("SELECT e FROM Employee e WHERE e.isDeleted = true")
    List<Employee> findAllDeleted();

    @Query("SELECT e FROM Employee e WHERE e.isDeleted = true")
    Page<Employee> findAllDeleted(Pageable pageable);

    // =============================================
    // Original queries (include all records)
    // =============================================

    Optional<Employee> findByEmail(String email);

    Optional<Employee> findByNationalId(String nationalId);

    boolean existsByEmail(String email);

    boolean existsByNationalId(String nationalId);

    List<Employee> findByStatus(EmploymentStatus status);

    List<Employee> findByManagerId(Long managerId);

    @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.contacts WHERE e.id = :id")
    Optional<Employee> findByIdWithContacts(@Param("id") Long id);

    @Query("SELECT e FROM Employee e WHERE " +
            "LOWER(e.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(e.email) LIKE LOWER(CONCAT('%', :keyword, '%')) ")
    Page<Employee> searchEmployees(@Param("keyword") String keyword, Pageable pageable);
}
