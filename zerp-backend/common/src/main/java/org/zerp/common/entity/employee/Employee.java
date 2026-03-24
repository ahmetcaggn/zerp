package org.zerp.common.entity.employee;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "employees")
@Getter
@Setter
@SQLDelete(sql = "UPDATE employees SET deleted = true, deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? and version = ?")
@SQLRestriction("deleted = false")
public class Employee extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

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
}