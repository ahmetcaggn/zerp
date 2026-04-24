package org.zerp.employee.service;

import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.mockito.ArgumentMatchers;
import org.zerp.common.entity.Tenant;
import org.zerp.common.entity.employee.Employee;
import org.zerp.common.entity.employee.EmploymentStatus;
import org.zerp.common.util.CurrentUserIdResolver;
import org.zerp.employee.Exception.DuplicateResourceException;
import org.zerp.employee.dtos.request.CreateEmployeeRequestDto;
import org.zerp.employee.dtos.request.UpdateEmployeeRequestDto;
import org.zerp.employee.dtos.response.EmployeeListResponseDto;
import org.zerp.employee.dtos.response.EmployeeResponseDto;
import org.zerp.employee.mapper.EmployeeMapper;
import org.zerp.employee.permission.EmployeePermissionEvaluator;
import org.zerp.employee.repository.EmployeeRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private EmployeeMapper employeeMapper;

    @Mock
    private EmployeePermissionEvaluator permissionEvaluator;

    @Mock
    private CurrentUserIdResolver currentUserIdResolver;

    @InjectMocks
    private EmployeeService employeeService;

    @BeforeEach
    void commonStubs() {
        lenient().when(currentUserIdResolver.resolve()).thenReturn(uuidOf(999));
        lenient().when(permissionEvaluator.filterRead(any())).thenReturn(Specification.unrestricted());
        lenient().when(permissionEvaluator.canRead(any(), any())).thenReturn(true);
        lenient().when(permissionEvaluator.canCreate(any(), any())).thenReturn(true);
        lenient().when(permissionEvaluator.canUpdate(any(), any())).thenReturn(true);
        lenient().when(permissionEvaluator.canPatch(any(), any())).thenReturn(true);
        lenient().when(permissionEvaluator.canDelete(any(), any())).thenReturn(true);
    }

    // ── Fixture helpers ──────────────────────────────────────────────────────

    /**
     * Converts an integer to a deterministic UUID for testing.
     * This ensures tests are reproducible while using UUID entity IDs.
     */
    private UUID uuidOf(int num) {
        return new UUID(0L, num);
    }

    private Tenant buildTenant() {
        Tenant tenant = new Tenant();
        tenant.setId(uuidOf(500));
        return tenant;
    }

    private Employee buildEmployee(Integer id, String email) {
        Employee emp = new Employee();
        emp.setId(id == null ? null : uuidOf(id));
        emp.setTenant(buildTenant());
        emp.setFirstName("John");
        emp.setLastName("Doe");
        emp.setEmail(email);
        emp.setHireDate(LocalDate.of(2020, 1, 1));
        emp.setStatus(EmploymentStatus.ACTIVE);
        emp.setSalary(BigDecimal.valueOf(5000));
        return emp;
    }

    private EmployeeResponseDto buildResponseDto(Integer id, String email) {
        EmployeeResponseDto dto = new EmployeeResponseDto();
        dto.setId(id == null ? null : uuidOf(id));
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setEmail(email);
        return dto;
    }

    private EmployeeListResponseDto buildListDto(Integer id, String email) {
        EmployeeListResponseDto dto = new EmployeeListResponseDto();
        dto.setId(id == null ? null : uuidOf(id));
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setEmail(email);
        dto.setStatus(EmploymentStatus.ACTIVE);
        return dto;
    }

    // ── findWithFilters ───────────────────────────────────────────────────────

    @Nested
    class FindWithFilters {

        @Test
        void returnsPageOfEmployees() {
            Pageable pageable = PageRequest.of(0, 10);
            Employee emp = buildEmployee(1, "john@example.com");
            EmployeeListResponseDto dto = buildListDto(1, "john@example.com");
            Page<Employee> repoPage = new PageImpl<>(List.of(emp), pageable, 1);

            when(employeeRepository.findAll(ArgumentMatchers.<Specification<Employee>>any(), eq(pageable))).thenReturn(repoPage);
            when(employeeMapper.toListResponseDto(emp)).thenReturn(dto);

            Page<EmployeeListResponseDto> result = employeeService.findWithFilters(Map.of(), pageable);

            assertThat(result.getTotalElements()).isEqualTo(1);
            assertThat(result.getContent()).containsExactly(dto);
        }

        @Test
        void returnsEmptyPageWhenNoEmployees() {
            Pageable pageable = PageRequest.of(0, 10);
            when(employeeRepository.findAll(ArgumentMatchers.<Specification<Employee>>any(), eq(pageable))).thenReturn(Page.empty(pageable));

            Page<EmployeeListResponseDto> result = employeeService.findWithFilters(Map.of(), pageable);

            assertThat(result.getTotalElements()).isZero();
        }

        @Test
        void parsesFilterKeyWithoutThrowing() {
            Pageable pageable = PageRequest.of(0, 10);
            when(employeeRepository.findAll(ArgumentMatchers.<Specification<Employee>>any(), eq(pageable))).thenReturn(Page.empty(pageable));

            // "status.eq" should be parsed, not blow up
            Page<EmployeeListResponseDto> result = employeeService.findWithFilters(Map.of("status.eq", "ACTIVE"), pageable);

            assertThat(result).isNotNull();
        }

        @Test
        void ignoresFilterKeysWithoutOperator() {
            Pageable pageable = PageRequest.of(0, 10);
            when(employeeRepository.findAll(ArgumentMatchers.<Specification<Employee>>any(), eq(pageable))).thenReturn(Page.empty(pageable));

            // key without "." separator should be silently skipped
            assertThat(employeeService.findWithFilters(Map.of("bad_key", "value"), pageable)).isNotNull();
        }
    }

    // ── findAllById ───────────────────────────────────────────────────────────

    @Nested
    class FindAllById {

        @Test
        void returnsAllMatchingEmployees() {
            Employee emp1 = buildEmployee(1, "a@example.com");
            Employee emp2 = buildEmployee(2, "b@example.com");
            EmployeeResponseDto dto1 = buildResponseDto(1, "a@example.com");
            EmployeeResponseDto dto2 = buildResponseDto(2, "b@example.com");

            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(1))).thenReturn(Optional.of(emp1));
            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(2))).thenReturn(Optional.of(emp2));
            when(employeeMapper.toResponseDto(emp1)).thenReturn(dto1);
            when(employeeMapper.toResponseDto(emp2)).thenReturn(dto2);

            List<EmployeeResponseDto> result = employeeService.findAllById(List.of(uuidOf(1), uuidOf(2)));

            assertThat(result).containsExactlyInAnyOrder(dto1, dto2);
        }

        @Test
        void skipsIdsNotFound() {
            Employee emp = buildEmployee(1, "a@example.com");
            EmployeeResponseDto dto = buildResponseDto(1, "a@example.com");

            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(1))).thenReturn(Optional.of(emp));
            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(99))).thenReturn(Optional.empty());
            when(employeeMapper.toResponseDto(emp)).thenReturn(dto);

            List<EmployeeResponseDto> result = employeeService.findAllById(List.of(uuidOf(1), uuidOf(99)));

            assertThat(result).containsExactly(dto);
        }

        @Test
        void returnsEmptyListForEmptyInput() {
            assertThat(employeeService.findAllById(List.of())).isEmpty();
        }
    }

    // ── findById ─────────────────────────────────────────────────────────────

    @Nested
    class FindById {

        @Test
        void returnsEmployeeWhenFound() {
            Employee emp = buildEmployee(1, "john@example.com");
            EmployeeResponseDto dto = buildResponseDto(1, "john@example.com");

            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(1))).thenReturn(Optional.of(emp));
            when(employeeMapper.toResponseDto(emp)).thenReturn(dto);

            assertThat(employeeService.findById(uuidOf(1))).isEqualTo(dto);
        }

        @Test
        void throwsEntityNotFoundWhenMissing() {
            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(99))).thenReturn(Optional.empty());

            assertThatThrownBy(() -> employeeService.findById(uuidOf(99)))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining(uuidOf(99).toString());
        }
    }

    // ── create ────────────────────────────────────────────────────────────────

    @Nested
    class Create {

        private CreateEmployeeRequestDto dto;

        @BeforeEach
        void setup() {
            dto = new CreateEmployeeRequestDto();
            dto.setFirstName("Jane");
            dto.setLastName("Smith");
            dto.setEmail("jane@example.com");
            dto.setHireDate(LocalDate.of(2023, 6, 1));
            dto.setStatus(EmploymentStatus.ACTIVE);
        }

        @Test
        void createsEmployeeWithoutManager() {
            Employee entity = buildEmployee(null, "jane@example.com");
            Employee saved = buildEmployee(1, "jane@example.com");
            EmployeeResponseDto responseDto = buildResponseDto(1, "jane@example.com");

            when(employeeRepository.findByEmailAndNotDeleted("jane@example.com")).thenReturn(Optional.empty());
            when(employeeMapper.toEntity(dto)).thenReturn(entity);
            when(employeeRepository.save(entity)).thenReturn(saved);
            when(employeeMapper.toResponseDto(saved)).thenReturn(responseDto);

            EmployeeResponseDto result = employeeService.create(dto);

            assertThat(result.getId()).isEqualTo(uuidOf(1));
            verify(employeeRepository).save(entity);
        }

        @Test
        void setsManagerWhenManagerIdProvided() {
            dto.setManagerId(uuidOf(10));
            Employee manager = buildEmployee(10, "manager@example.com");
            Employee entity = buildEmployee(null, "jane@example.com");
            Employee saved = buildEmployee(1, "jane@example.com");

            when(employeeRepository.findByEmailAndNotDeleted("jane@example.com")).thenReturn(Optional.empty());
            when(employeeMapper.toEntity(dto)).thenReturn(entity);
            when(employeeRepository.findByIdAndNotDeleted(uuidOf(10))).thenReturn(Optional.of(manager));
            when(employeeRepository.save(entity)).thenReturn(saved);
            when(employeeMapper.toResponseDto(saved)).thenReturn(buildResponseDto(1, "jane@example.com"));

            employeeService.create(dto);

            assertThat(entity.getManager()).isEqualTo(manager);
        }

        @Test
        void throwsDuplicateExceptionOnDuplicateEmail() {
            Employee existing = buildEmployee(5, "jane@example.com");
            when(employeeRepository.findByEmailAndNotDeleted("jane@example.com")).thenReturn(Optional.of(existing));

            assertThatThrownBy(() -> employeeService.create(dto))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("jane@example.com");

            verify(employeeRepository, never()).save(any());
        }

        @Test
        void throwsEntityNotFoundWhenManagerNotFound() {
            dto.setManagerId(uuidOf(999));
            Employee entity = buildEmployee(null, "jane@example.com");

            when(employeeRepository.findByEmailAndNotDeleted("jane@example.com")).thenReturn(Optional.empty());
            when(employeeMapper.toEntity(dto)).thenReturn(entity);
            when(employeeRepository.findByIdAndNotDeleted(uuidOf(999))).thenReturn(Optional.empty());

            assertThatThrownBy(() -> employeeService.create(dto))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining(uuidOf(999).toString());
        }
    }

    // ── update ────────────────────────────────────────────────────────────────

    @Nested
    class Update {

        @Test
        void updatesScalarFields() {
            Employee emp = buildEmployee(1, "old@example.com");
            Employee saved = buildEmployee(1, "new@example.com");
            EmployeeResponseDto responseDto = buildResponseDto(1, "new@example.com");
            UpdateEmployeeRequestDto updateDto = new UpdateEmployeeRequestDto();
            updateDto.setFirstName("Updated");
            updateDto.setEmail("new@example.com");
            updateDto.setSalary(new BigDecimal("6000"));

            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(1))).thenReturn(Optional.of(emp));
            when(employeeRepository.findByEmailAndNotDeleted("new@example.com")).thenReturn(Optional.empty());
            when(employeeRepository.save(emp)).thenReturn(saved);
            when(employeeMapper.toResponseDto(saved)).thenReturn(responseDto);

            EmployeeResponseDto result = employeeService.update(uuidOf(1), updateDto);

            assertThat(result.getEmail()).isEqualTo("new@example.com");
            assertThat(emp.getFirstName()).isEqualTo("Updated");
            assertThat(emp.getSalary()).isEqualByComparingTo("6000");
        }

        @Test
        void throwsEntityNotFoundWhenEmployeeMissing() {
            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(99))).thenReturn(Optional.empty());

            UpdateEmployeeRequestDto updateDto = new UpdateEmployeeRequestDto();
            updateDto.setFirstName("X");

            assertThatThrownBy(() -> employeeService.update(uuidOf(99), updateDto))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining(uuidOf(99).toString());
        }

        @Test
        void throwsWhenEmployeeAssignsItselfAsManager() {
            Employee emp = buildEmployee(1, "e@example.com");
            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(1))).thenReturn(Optional.of(emp));

            UpdateEmployeeRequestDto updateDto = new UpdateEmployeeRequestDto();
            updateDto.setManagerId(uuidOf(1));

            assertThatThrownBy(() -> employeeService.update(uuidOf(1), updateDto))
                    .isInstanceOf(IllegalArgumentException.class);
        }

        @Test
        void throwsDuplicateExceptionOnEmailAlreadyTaken() {
            Employee emp = buildEmployee(1, "old@example.com");
            Employee other = buildEmployee(2, "taken@example.com");
            UpdateEmployeeRequestDto updateDto = new UpdateEmployeeRequestDto();
            updateDto.setEmail("taken@example.com");

            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(1))).thenReturn(Optional.of(emp));
            when(employeeRepository.findByEmailAndNotDeleted("taken@example.com")).thenReturn(Optional.of(other));

            assertThatThrownBy(() -> employeeService.update(uuidOf(1), updateDto))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("taken@example.com");
        }

        @Test
        void updatesManagerSuccessfully() {
            Employee emp = buildEmployee(1, "emp@example.com");
            Employee manager = buildEmployee(2, "mgr@example.com");
            Employee saved = buildEmployee(1, "emp@example.com");
            UpdateEmployeeRequestDto updateDto = new UpdateEmployeeRequestDto();
            updateDto.setManagerId(uuidOf(2));

            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(1))).thenReturn(Optional.of(emp));
            when(employeeRepository.findByIdAndNotDeleted(uuidOf(2))).thenReturn(Optional.of(manager));
            when(employeeRepository.save(emp)).thenReturn(saved);
            when(employeeMapper.toResponseDto(saved)).thenReturn(buildResponseDto(1, "emp@example.com"));

            employeeService.update(uuidOf(1), updateDto);

            assertThat(emp.getManager()).isEqualTo(manager);
        }

        @Test
        void throwsEntityNotFoundWhenNewManagerNotFound() {
            Employee emp = buildEmployee(1, "emp@example.com");
            UpdateEmployeeRequestDto updateDto = new UpdateEmployeeRequestDto();
            updateDto.setManagerId(uuidOf(50));

            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(1))).thenReturn(Optional.of(emp));
            when(employeeRepository.findByIdAndNotDeleted(uuidOf(50))).thenReturn(Optional.empty());

            assertThatThrownBy(() -> employeeService.update(uuidOf(1), updateDto))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining(uuidOf(50).toString());
        }
    }

    // ── updateMany ────────────────────────────────────────────────────────────

    @Nested
    class UpdateMany {

        @Test
        void returnsUpdatedIds() {
            Employee emp1 = buildEmployee(1, "a@example.com");
            Employee emp2 = buildEmployee(2, "b@example.com");

            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(1))).thenReturn(Optional.of(emp1));
            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(2))).thenReturn(Optional.of(emp2));
            when(employeeRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
            when(employeeMapper.toResponseDto(any())).thenReturn(buildResponseDto(1, "a@example.com"));

            List<UUID> updated = employeeService.patchMany(List.of(uuidOf(1), uuidOf(2)), Map.of("status", "SUSPENDED"));

            assertThat(updated).containsExactlyInAnyOrder(uuidOf(1), uuidOf(2));
        }

        @Test
        void skipsNotFoundIdsWithoutFailing() {
            Employee emp = buildEmployee(1, "a@example.com");

            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(1))).thenReturn(Optional.of(emp));
            when(employeeRepository.findByIdWithContactsAndNotDeleted(uuidOf(99))).thenReturn(Optional.empty());
            when(employeeRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
            when(employeeMapper.toResponseDto(any())).thenReturn(buildResponseDto(1, "a@example.com"));

            List<UUID> updated = employeeService.patchMany(List.of(uuidOf(1), uuidOf(99)), Map.of("status", "SUSPENDED"));

            assertThat(updated).containsExactly(uuidOf(1));
        }

        @Test
        void returnsEmptyListForEmptyInput() {
            assertThat(employeeService.patchMany(List.of(), Map.of())).isEmpty();
        }
    }

    // ── deleteById ────────────────────────────────────────────────────────────

    @Nested
    class DeleteById {

        @Test
        void deletesEmployee() {
            Employee emp = buildEmployee(1, "john@example.com");
            when(employeeRepository.findByIdAndNotDeleted(uuidOf(1))).thenReturn(Optional.of(emp));

            employeeService.deleteById(uuidOf(1));

            verify(employeeRepository).delete(emp);
        }

        @Test
        void throwsEntityNotFoundWhenMissing() {
            when(employeeRepository.findByIdAndNotDeleted(uuidOf(99))).thenReturn(Optional.empty());

            assertThatThrownBy(() -> employeeService.deleteById(uuidOf(99)))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining(uuidOf(99).toString());

            verify(employeeRepository, never()).delete(any(Employee.class));
        }
    }

    // ── deleteMany ────────────────────────────────────────────────────────────

    @Nested
    class DeleteMany {

        @Test
        void returnsDeletedIds() {
            Employee emp1 = buildEmployee(1, "a@example.com");
            Employee emp2 = buildEmployee(2, "b@example.com");

            when(employeeRepository.findByIdAndNotDeleted(uuidOf(1))).thenReturn(Optional.of(emp1));
            when(employeeRepository.findByIdAndNotDeleted(uuidOf(2))).thenReturn(Optional.of(emp2));

            List<UUID> deleted = employeeService.deleteMany(List.of(uuidOf(1), uuidOf(2)));

            assertThat(deleted).containsExactlyInAnyOrder(uuidOf(1), uuidOf(2));
            verify(employeeRepository, times(2)).delete(any(Employee.class));
        }

        @Test
        void skipsNotFoundIdsWithoutFailing() {
            Employee emp = buildEmployee(1, "a@example.com");

            when(employeeRepository.findByIdAndNotDeleted(uuidOf(1))).thenReturn(Optional.of(emp));
            when(employeeRepository.findByIdAndNotDeleted(uuidOf(99))).thenReturn(Optional.empty());

            List<UUID> deleted = employeeService.deleteMany(List.of(uuidOf(1), uuidOf(99)));

            assertThat(deleted).containsExactly(uuidOf(1));
            verify(employeeRepository, times(1)).delete(any(Employee.class));
        }

        @Test
        void returnsEmptyListForEmptyInput() {
            assertThat(employeeService.deleteMany(List.of())).isEmpty();
        }
    }

    // ── searchEmployees ───────────────────────────────────────────────────────

    @Nested
    class SearchEmployees {

        @Test
        void returnsMatchingPage() {
            Pageable pageable = PageRequest.of(0, 10);
            Employee emp = buildEmployee(1, "john@example.com");
            EmployeeListResponseDto dto = buildListDto(1, "john@example.com");
            Page<Employee> repoPage = new PageImpl<>(List.of(emp), pageable, 1);

            when(employeeRepository.searchEmployeesNotDeleted("john", pageable)).thenReturn(repoPage);
            when(employeeMapper.toListResponseDto(emp)).thenReturn(dto);

            Page<EmployeeListResponseDto> result = employeeService.searchEmployees("john", pageable);

            assertThat(result.getTotalElements()).isEqualTo(1);
            assertThat(result.getContent()).containsExactly(dto);
        }

        @Test
        void returnsEmptyPageForNoMatch() {
            Pageable pageable = PageRequest.of(0, 10);
            when(employeeRepository.searchEmployeesNotDeleted("xyz", pageable)).thenReturn(Page.empty());

            assertThat(employeeService.searchEmployees("xyz", pageable).getTotalElements()).isZero();
        }
    }

    // ── getDeletedEmployees ───────────────────────────────────────────────────

    @Nested
    class GetDeletedEmployees {

        @Test
        void returnsAllDeletedEmployees() {
            Employee deleted = buildEmployee(5, "del@example.com");
            EmployeeListResponseDto dto = buildListDto(5, "del@example.com");

            when(employeeRepository.findAllDeleted()).thenReturn(List.of(deleted));
            when(employeeMapper.toListResponseDtoList(List.of(deleted))).thenReturn(List.of(dto));

            assertThat(employeeService.getDeletedEmployees()).containsExactly(dto);
        }

        @Test
        void returnsEmptyListWhenNoneDeleted() {
            when(employeeRepository.findAllDeleted()).thenReturn(List.of());
            when(employeeMapper.toListResponseDtoList(List.of())).thenReturn(List.of());

            assertThat(employeeService.getDeletedEmployees()).isEmpty();
        }
    }

    // ── getDeletedEmployeesPaginated ──────────────────────────────────────────

    @Nested
    class GetDeletedEmployeesPaginated {

        @Test
        void returnsPageOfDeletedEmployees() {
            Pageable pageable = PageRequest.of(0, 10);
            Employee deleted = buildEmployee(5, "del@example.com");
            EmployeeListResponseDto dto = buildListDto(5, "del@example.com");
            Page<Employee> repoPage = new PageImpl<>(List.of(deleted), pageable, 1);

            when(employeeRepository.findAllDeleted(pageable)).thenReturn(repoPage);
            when(employeeMapper.toListResponseDto(deleted)).thenReturn(dto);

            Page<EmployeeListResponseDto> result = employeeService.getDeletedEmployeesPaginated(pageable);

            assertThat(result.getTotalElements()).isEqualTo(1);
            assertThat(result.getContent()).containsExactly(dto);
        }

        @Test
        void returnsEmptyPageWhenNoneDeleted() {
            Pageable pageable = PageRequest.of(0, 10);
            when(employeeRepository.findAllDeleted(pageable)).thenReturn(Page.empty(pageable));

            assertThat(employeeService.getDeletedEmployeesPaginated(pageable).getTotalElements()).isZero();
        }
    }
}


