package org.zerp.user.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.zerp.common.entity.employee.ContactType;
import org.zerp.common.entity.employee.EmploymentStatus;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class CurrentUserProfileDTO {
    private UUID id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String nationalId;
    private LocalDate dateOfBirth;
    private EmploymentStatus status;
    private ManagerDTO manager;
    private List<EmployeeContactDTO> contacts;

    @Data
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public static class ManagerDTO {
        private UUID id;
        private String firstName;
        private String lastName;
        private String email;
    }

    @Data
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    public static class EmployeeContactDTO {
        private Long id;
        private ContactType type;
        private String value;
        private String contactPersonName;
        private String relationship;
    }
}
