package org.zerp.employee.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerp.common.dto.ApiResponse;
import org.zerp.common.resource.controller.ResourceController;
import org.zerp.employee.dtos.request.CreateEmployeeRequestDto;
import org.zerp.employee.dtos.response.EmployeeListResponseDto;
import org.zerp.employee.dtos.response.EmployeeResponseDto;
import org.zerp.employee.service.EmployeeService;

import java.util.List;

@RestController
@RequestMapping("/employee")
@RequiredArgsConstructor
@Tag(name = "Employees", description = "API for managing employees. " +
        "Supports CRUD operations, searching, and retrieval of deleted employees.")
public class EmployeeController extends
        ResourceController<EmployeeResponseDto, EmployeeListResponseDto, CreateEmployeeRequestDto, Long> {
    private final EmployeeService employeeService;

    @Override
    protected EmployeeService getService() {
        return employeeService;
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<EmployeeListResponseDto>>> searchEmployees(
            @RequestParam String keyword,
            @PageableDefault(size = 20) Pageable pageable) {
        Page<EmployeeListResponseDto> employees = employeeService.searchEmployees(keyword, pageable);
        return ResponseEntity.ok(buildResponse(employees, "Search results retrieved successfully"));
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
}
