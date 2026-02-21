package org.zerp.common.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "employee_contacts")
@Getter
@Setter
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