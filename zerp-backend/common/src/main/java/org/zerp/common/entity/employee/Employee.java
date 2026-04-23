package org.zerp.common.entity.employee;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.Tenant;
import org.zerp.common.entity.base.BaseEntity;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.permission.entity.PermissionTargetType;
import org.zerp.common.permission.entity.PermissionTargetTypeAnnotation;
import org.zerp.common.permission.entity.Permittable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "employees")
@Getter
@Setter
@SQLDelete(sql = "UPDATE employees SET deleted = true, deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? and version = ?")
@SQLRestriction("deleted = false")
@PermissionTargetTypeAnnotation(type = PermissionTargetType.EMPLOYEE)
@Inheritance(strategy = InheritanceType.JOINED)
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
    public Permittable getParent() {
        return tenant;
    }
}