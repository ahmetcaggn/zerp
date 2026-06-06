package org.zerp.common.entity.employee;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "employees")
@Getter
@Setter
@PermissionTargetTypeAnnotation(type = PermissionTargetType.EMPLOYEE)
public class Employee extends AppUser implements Permittable {
    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String phoneNumber;

    @Column(unique = true)
    private String nationalId;

    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private LocalDate hireDate;

    private LocalDate terminationDate;

    @Enumerated(EnumType.STRING)
    private EmploymentStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Employee manager;

    private BigDecimal salary;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EmployeeContact> contacts = new ArrayList<>();


    public void addContact(EmployeeContact contact) {
        contacts.add(contact);
        contact.setEmployee(this);
    }

    public void removeContact(EmployeeContact contact) {
        contacts.remove(contact);
        contact.setEmployee(null);
    }

    @Override
    public String getTitle() {
        return String.format("%s (%s %s)", username, firstName, lastName);
    }

    @Override
    public Permittable getParent() {
        return tenant;
    }

    public void deleteEmployee() {
        LocalDateTime now = LocalDateTime.now();
        this.status = EmploymentStatus.DELETED;
        this.terminationDate = now.toLocalDate();
        this.deleted = true;
        this.deletedAt = now;
    }

    public void restoreEmployee() {
        this.status = EmploymentStatus.ACTIVE;
        this.terminationDate = null;
        this.deleted = false;
        this.deletedAt = null;
    }
}