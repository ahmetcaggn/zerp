package org.zerp.common.entity.employee;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.zerp.common.entity.base.BaseEntity;

@Entity
@Table(name = "employee_contacts")
@Getter
@Setter
@SQLDelete(sql = "UPDATE employee_contacts SET deleted = true, deleted_at = CURRENT_TIMESTAMP, version = version + 1 WHERE id = ? and version = ?")
@SQLRestriction("deleted = false")
public class EmployeeContact extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContactType type;

    // Telefon numarası veya e-posta adresi buraya gelir
    @Column(nullable = false)
    private String value;

    // Sadece Acil Durum Kişisi ise doldurulur (Örn: "Ahmet Yılmaz")
    private String contactPersonName;

    // Sadece Acil Durum Kişisi ise doldurulur (Örn: "Babası", "Eşi")
    private String relationship;

    // Employee ile ilişki (ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
}