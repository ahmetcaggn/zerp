package org.zerp.employee.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerp.common.context.RequestContext;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.model.EmploymentStatus;
import org.zerp.common.model.Role;
import org.zerp.employee.dtos.request.CreateEmployeeRequestDto;
import org.zerp.employee.dtos.request.UpdateEmployeeRequestDto;
import org.zerp.employee.dtos.response.EmployeeListResponseDto;
import org.zerp.employee.dtos.response.EmployeeResponseDto;
import org.zerp.employee.service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @Value("${app.version:0.0.1-SNAPSHOT}")
    private String appVersion;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployeeListResponseDto>>> getAllEmployees() {
        List<EmployeeListResponseDto> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(buildResponse(employees, "Employees retrieved successfully"));
    }

    @GetMapping("/paginated")
    public ResponseEntity<ApiResponse<Page<EmployeeListResponseDto>>> getEmployeesPaginated(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<EmployeeListResponseDto> employees = employeeService.getEmployeesPaginated(pageable);
        return ResponseEntity.ok(buildResponse(employees, "Employees retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponseDto>> getEmployeeById(@PathVariable Long id) {
        EmployeeResponseDto employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(buildResponse(employee, "Employee retrieved successfully"));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<EmployeeListResponseDto>>> getEmployeesByStatus(
            @PathVariable EmploymentStatus status) {
        List<EmployeeListResponseDto> employees = employeeService.getEmployeesByStatus(status);
        return ResponseEntity.ok(buildResponse(employees, "Employees retrieved successfully"));
    }

    @GetMapping("/manager/{managerId}")
    public ResponseEntity<ApiResponse<List<EmployeeListResponseDto>>> getEmployeesByManager(
            @PathVariable Long managerId) {
        List<EmployeeListResponseDto> employees = employeeService.getEmployeesByManager(managerId);
        return ResponseEntity.ok(buildResponse(employees, "Employees retrieved successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<EmployeeListResponseDto>>> searchEmployees(
            @RequestParam String keyword,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<EmployeeListResponseDto> employees = employeeService.searchEmployees(keyword, pageable);
        return ResponseEntity.ok(buildResponse(employees, "Search results retrieved successfully"));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmployeeResponseDto>> createEmployee(
            @Valid @RequestBody CreateEmployeeRequestDto dto) {
        EmployeeResponseDto createdEmployee = employeeService.createEmployee(dto);
        ApiResponse<EmployeeResponseDto> response = ApiResponse.<EmployeeResponseDto>created(createdEmployee)
                .withDurationMs(RequestContext.endTiming())
                .withVersion(appVersion);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<EmployeeResponseDto>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEmployeeRequestDto dto) {
        EmployeeResponseDto updatedEmployee = employeeService.updateEmployee(id, dto);
        return ResponseEntity.ok(buildResponse(updatedEmployee, "Employee updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        ApiResponse<Void> response = ApiResponse.<Void>noContent()
                .withDurationMs(RequestContext.endTiming())
                .withVersion(appVersion);
        response.setMessage("Employee deleted successfully");
        return ResponseEntity.ok(response);
    }

    // =============================================
    // Soft Delete Management Endpoints
    // =============================================

    @PatchMapping("/{id}/restore")
    public ResponseEntity<ApiResponse<EmployeeResponseDto>> restoreEmployee(@PathVariable Long id) {
        EmployeeResponseDto employee = employeeService.restoreEmployee(id);
        return ResponseEntity.ok(buildResponse(employee, "Employee restored successfully"));
    }

    @DeleteMapping("/{id}/hard")
    public ResponseEntity<ApiResponse<Void>> hardDeleteEmployee(@PathVariable Long id) {
        employeeService.hardDeleteEmployee(id);
        ApiResponse<Void> response = ApiResponse.<Void>noContent()
                .withDurationMs(RequestContext.endTiming())
                .withVersion(appVersion);
        response.setMessage("Employee permanently deleted");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/deleted")
    public ResponseEntity<ApiResponse<List<EmployeeListResponseDto>>> getDeletedEmployees() {
        List<EmployeeListResponseDto> employees = employeeService.getDeletedEmployees();
        return ResponseEntity.ok(buildResponse(employees, "Deleted employees retrieved successfully"));
    }

    @GetMapping("/deleted/paginated")
    public ResponseEntity<ApiResponse<Page<EmployeeListResponseDto>>> getDeletedEmployeesPaginated(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<EmployeeListResponseDto> employees = employeeService.getDeletedEmployeesPaginated(pageable);
        return ResponseEntity.ok(buildResponse(employees, "Deleted employees retrieved successfully"));
    }

    // =============================================
    // Helper Methods
    // =============================================

    private <T> ApiResponse<T> buildResponse(T data, String message) {
        Long durationMs = RequestContext.endTiming();
        return ApiResponse.<T>success(data, message)
                .withDurationMs(durationMs)
                .withVersion(appVersion);
    }
}
