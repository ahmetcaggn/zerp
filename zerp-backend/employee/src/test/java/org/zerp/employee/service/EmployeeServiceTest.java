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
import org.zerp.common.entity.employee.Employee;
import org.zerp.common.entity.employee.EmploymentStatus;
import org.zerp.employee.Exception.DuplicateResourceException;
import org.zerp.employee.dtos.request.CreateEmployeeRequestDto;
import org.zerp.employee.dtos.request.UpdateEmployeeRequestDto;
import org.zerp.employee.dtos.response.EmployeeListResponseDto;
import org.zerp.employee.dtos.response.EmployeeResponseDto;
import org.zerp.employee.mapper.EmployeeMapper;
import org.zerp.employee.repository.EmployeeRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    @InjectMocks
    private EmployeeService employeeService;

    // ── Fixture helpers ──────────────────────────────────────────────────────

    private Employee buildEmployee(Long id, String email) {
        Employee emp = new Employee();
        emp.setId(id);
        emp.setFirstName("John");
        emp.setLastName("Doe");
        emp.setEmail(email);
        emp.setHireDate(LocalDate.of(2020, 1, 1));
        emp.setStatus(EmploymentStatus.ACTIVE);
        emp.setSalary(BigDecimal.valueOf(5000));
        return emp;
    }

    private EmployeeResponseDto buildResponseDto(Long id, String email) {
        EmployeeResponseDto dto = new EmployeeResponseDto();
        dto.setId(id);
        dto.setFirstName("John");
        dto.setLastName("Doe");
        dto.setEmail(email);
        return dto;
    }

    private EmployeeListResponseDto buildListDto(Long id, String email) {
        EmployeeListResponseDto dto = new EmployeeListResponseDto();
        dto.setId(id);
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
            Employee emp = buildEmployee(1L, "john@example.com");
            EmployeeListResponseDto dto = buildListDto(1L, "john@example.com");
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
            Employee emp1 = buildEmployee(1L, "a@example.com");
            Employee emp2 = buildEmployee(2L, "b@example.com");
            EmployeeResponseDto dto1 = buildResponseDto(1L, "a@example.com");
            EmployeeResponseDto dto2 = buildResponseDto(2L, "b@example.com");

            when(employeeRepository.findByIdWithContactsAndNotDeleted(1L)).thenReturn(Optional.of(emp1));
            when(employeeRepository.findByIdWithContactsAndNotDeleted(2L)).thenReturn(Optional.of(emp2));
            when(employeeMapper.toResponseDto(emp1)).thenReturn(dto1);
            when(employeeMapper.toResponseDto(emp2)).thenReturn(dto2);

            List<EmployeeResponseDto> result = employeeService.findAllById(List.of(1L, 2L));

            assertThat(result).containsExactlyInAnyOrder(dto1, dto2);
        }

        @Test
        void skipsIdsNotFound() {
            Employee emp = buildEmployee(1L, "a@example.com");
            EmployeeResponseDto dto = buildResponseDto(1L, "a@example.com");

            when(employeeRepository.findByIdWithContactsAndNotDeleted(1L)).thenReturn(Optional.of(emp));
            when(employeeRepository.findByIdWithContactsAndNotDeleted(99L)).thenReturn(Optional.empty());
            when(employeeMapper.toResponseDto(emp)).thenReturn(dto);

            List<EmployeeResponseDto> result = employeeService.findAllById(List.of(1L, 99L));

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
            Employee emp = buildEmployee(1L, "john@example.com");
            EmployeeResponseDto dto = buildResponseDto(1L, "john@example.com");

            when(employeeRepository.findByIdWithContactsAndNotDeleted(1L)).thenReturn(Optional.of(emp));
            when(employeeMapper.toResponseDto(emp)).thenReturn(dto);

            assertThat(employeeService.findById(1L)).isEqualTo(dto);
        }

        @Test
        void throwsEntityNotFoundWhenMissing() {
            when(employeeRepository.findByIdWithContactsAndNotDeleted(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> employeeService.findById(99L))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("99");
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
            Employee saved = buildEmployee(1L, "jane@example.com");
            EmployeeResponseDto responseDto = buildResponseDto(1L, "jane@example.com");

            when(employeeRepository.findByEmailAndNotDeleted("jane@example.com")).thenReturn(Optional.empty());
            when(employeeMapper.toEntity(dto)).thenReturn(entity);
            when(employeeRepository.save(entity)).thenReturn(saved);
            when(employeeMapper.toResponseDto(saved)).thenReturn(responseDto);

            EmployeeResponseDto result = employeeService.create(dto);

            assertThat(result.getId()).isEqualTo(1L);
            verify(employeeRepository).save(entity);
        }

        @Test
        void setsManagerWhenManagerIdProvided() {
            dto.setManagerId(10L);
            Employee manager = buildEmployee(10L, "manager@example.com");
            Employee entity = buildEmployee(null, "jane@example.com");
            Employee saved = buildEmployee(1L, "jane@example.com");

            when(employeeRepository.findByEmailAndNotDeleted("jane@example.com")).thenReturn(Optional.empty());
            when(employeeMapper.toEntity(dto)).thenReturn(entity);
            when(employeeRepository.findByIdAndNotDeleted(10L)).thenReturn(Optional.of(manager));
            when(employeeRepository.save(entity)).thenReturn(saved);
            when(employeeMapper.toResponseDto(saved)).thenReturn(buildResponseDto(1L, "jane@example.com"));

            employeeService.create(dto);

            assertThat(entity.getManager()).isEqualTo(manager);
        }

        @Test
        void throwsDuplicateExceptionOnDuplicateEmail() {
            Employee existing = buildEmployee(5L, "jane@example.com");
            when(employeeRepository.findByEmailAndNotDeleted("jane@example.com")).thenReturn(Optional.of(existing));

            assertThatThrownBy(() -> employeeService.create(dto))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("jane@example.com");

            verify(employeeRepository, never()).save(any());
        }

        @Test
        void throwsEntityNotFoundWhenManagerNotFound() {
            dto.setManagerId(999L);
            Employee entity = buildEmployee(null, "jane@example.com");

            when(employeeRepository.findByEmailAndNotDeleted("jane@example.com")).thenReturn(Optional.empty());
            when(employeeMapper.toEntity(dto)).thenReturn(entity);
            when(employeeRepository.findByIdAndNotDeleted(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> employeeService.create(dto))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("999");
        }
    }

    // ── update ────────────────────────────────────────────────────────────────

    @Nested
    class Update {

        @Test
        void updatesScalarFields() {
            Employee emp = buildEmployee(1L, "old@example.com");
            Employee saved = buildEmployee(1L, "new@example.com");
            EmployeeResponseDto responseDto = buildResponseDto(1L, "new@example.com");
            UpdateEmployeeRequestDto updateDto = new UpdateEmployeeRequestDto();
            updateDto.setFirstName("Updated");
            updateDto.setEmail("new@example.com");
            updateDto.setSalary(new BigDecimal("6000"));

            when(employeeRepository.findByIdWithContactsAndNotDeleted(1L)).thenReturn(Optional.of(emp));
            when(employeeRepository.findByEmailAndNotDeleted("new@example.com")).thenReturn(Optional.empty());
            when(employeeRepository.save(emp)).thenReturn(saved);
            when(employeeMapper.toResponseDto(saved)).thenReturn(responseDto);

            EmployeeResponseDto result = employeeService.update(1L, updateDto);

            assertThat(result.getEmail()).isEqualTo("new@example.com");
            assertThat(emp.getFirstName()).isEqualTo("Updated");
            assertThat(emp.getSalary()).isEqualByComparingTo("6000");
        }

        @Test
        void throwsEntityNotFoundWhenEmployeeMissing() {
            when(employeeRepository.findByIdWithContactsAndNotDeleted(99L)).thenReturn(Optional.empty());

            UpdateEmployeeRequestDto updateDto = new UpdateEmployeeRequestDto();
            updateDto.setFirstName("X");

            assertThatThrownBy(() -> employeeService.update(99L, updateDto))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("99");
        }

        @Test
        void throwsWhenEmployeeAssignsItselfAsManager() {
            Employee emp = buildEmployee(1L, "e@example.com");
            when(employeeRepository.findByIdWithContactsAndNotDeleted(1L)).thenReturn(Optional.of(emp));

            UpdateEmployeeRequestDto updateDto = new UpdateEmployeeRequestDto();
            updateDto.setManagerId(1L);

            assertThatThrownBy(() -> employeeService.update(1L, updateDto))
                    .isInstanceOf(IllegalArgumentException.class);
        }

        @Test
        void throwsDuplicateExceptionOnEmailAlreadyTaken() {
            Employee emp = buildEmployee(1L, "old@example.com");
            Employee other = buildEmployee(2L, "taken@example.com");
            UpdateEmployeeRequestDto updateDto = new UpdateEmployeeRequestDto();
            updateDto.setEmail("taken@example.com");

            when(employeeRepository.findByIdWithContactsAndNotDeleted(1L)).thenReturn(Optional.of(emp));
            when(employeeRepository.findByEmailAndNotDeleted("taken@example.com")).thenReturn(Optional.of(other));

            assertThatThrownBy(() -> employeeService.update(1L, updateDto))
                    .isInstanceOf(DuplicateResourceException.class)
                    .hasMessageContaining("taken@example.com");
        }

        @Test
        void updatesManagerSuccessfully() {
            Employee emp = buildEmployee(1L, "emp@example.com");
            Employee manager = buildEmployee(2L, "mgr@example.com");
            Employee saved = buildEmployee(1L, "emp@example.com");
            UpdateEmployeeRequestDto updateDto = new UpdateEmployeeRequestDto();
            updateDto.setManagerId(2L);

            when(employeeRepository.findByIdWithContactsAndNotDeleted(1L)).thenReturn(Optional.of(emp));
            when(employeeRepository.findByIdAndNotDeleted(2L)).thenReturn(Optional.of(manager));
            when(employeeRepository.save(emp)).thenReturn(saved);
            when(employeeMapper.toResponseDto(saved)).thenReturn(buildResponseDto(1L, "emp@example.com"));

            employeeService.update(1L, updateDto);

            assertThat(emp.getManager()).isEqualTo(manager);
        }

        @Test
        void throwsEntityNotFoundWhenNewManagerNotFound() {
            Employee emp = buildEmployee(1L, "emp@example.com");
            UpdateEmployeeRequestDto updateDto = new UpdateEmployeeRequestDto();
            updateDto.setManagerId(50L);

            when(employeeRepository.findByIdWithContactsAndNotDeleted(1L)).thenReturn(Optional.of(emp));
            when(employeeRepository.findByIdAndNotDeleted(50L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> employeeService.update(1L, updateDto))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("50");
        }
    }

    // ── updateMany ────────────────────────────────────────────────────────────

    @Nested
    class UpdateMany {

        @Test
        void returnsUpdatedIds() {
            Employee emp1 = buildEmployee(1L, "a@example.com");
            Employee emp2 = buildEmployee(2L, "b@example.com");

            when(employeeRepository.findByIdWithContactsAndNotDeleted(1L)).thenReturn(Optional.of(emp1));
            when(employeeRepository.findByIdWithContactsAndNotDeleted(2L)).thenReturn(Optional.of(emp2));
            when(employeeRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
            when(employeeMapper.toResponseDto(any())).thenReturn(buildResponseDto(1L, "a@example.com"));

            List<Long> updated = employeeService.patchMany(List.of(1L, 2L), Map.of("status", "SUSPENDED"));

            assertThat(updated).containsExactlyInAnyOrder(1L, 2L);
        }

        @Test
        void skipsNotFoundIdsWithoutFailing() {
            Employee emp = buildEmployee(1L, "a@example.com");

            when(employeeRepository.findByIdWithContactsAndNotDeleted(1L)).thenReturn(Optional.of(emp));
            when(employeeRepository.findByIdWithContactsAndNotDeleted(99L)).thenReturn(Optional.empty());
            when(employeeRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
            when(employeeMapper.toResponseDto(any())).thenReturn(buildResponseDto(1L, "a@example.com"));

            List<Long> updated = employeeService.patchMany(List.of(1L, 99L), Map.of("status", "SUSPENDED"));

            assertThat(updated).containsExactly(1L);
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
            Employee emp = buildEmployee(1L, "john@example.com");
            when(employeeRepository.findByIdAndNotDeleted(1L)).thenReturn(Optional.of(emp));

            employeeService.deleteById(1L);

            verify(employeeRepository).delete(emp);
        }

        @Test
        void throwsEntityNotFoundWhenMissing() {
            when(employeeRepository.findByIdAndNotDeleted(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> employeeService.deleteById(99L))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessageContaining("99");

            verify(employeeRepository, never()).delete(any(Employee.class));
        }
    }

    // ── deleteMany ────────────────────────────────────────────────────────────

    @Nested
    class DeleteMany {

        @Test
        void returnsDeletedIds() {
            Employee emp1 = buildEmployee(1L, "a@example.com");
            Employee emp2 = buildEmployee(2L, "b@example.com");

            when(employeeRepository.findByIdAndNotDeleted(1L)).thenReturn(Optional.of(emp1));
            when(employeeRepository.findByIdAndNotDeleted(2L)).thenReturn(Optional.of(emp2));

            List<Long> deleted = employeeService.deleteMany(List.of(1L, 2L));

            assertThat(deleted).containsExactlyInAnyOrder(1L, 2L);
            verify(employeeRepository, times(2)).delete(any(Employee.class));
        }

        @Test
        void skipsNotFoundIdsWithoutFailing() {
            Employee emp = buildEmployee(1L, "a@example.com");

            when(employeeRepository.findByIdAndNotDeleted(1L)).thenReturn(Optional.of(emp));
            when(employeeRepository.findByIdAndNotDeleted(99L)).thenReturn(Optional.empty());

            List<Long> deleted = employeeService.deleteMany(List.of(1L, 99L));

            assertThat(deleted).containsExactly(1L);
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
            Employee emp = buildEmployee(1L, "john@example.com");
            EmployeeListResponseDto dto = buildListDto(1L, "john@example.com");
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
            Employee deleted = buildEmployee(5L, "del@example.com");
            EmployeeListResponseDto dto = buildListDto(5L, "del@example.com");

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
            Employee deleted = buildEmployee(5L, "del@example.com");
            EmployeeListResponseDto dto = buildListDto(5L, "del@example.com");
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


