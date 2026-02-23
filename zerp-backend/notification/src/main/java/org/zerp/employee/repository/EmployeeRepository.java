package org.zerp.employee.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerp.common.entity.employee.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
