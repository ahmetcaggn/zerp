package org.zerp.common.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.zerp.common.entity.base.BaseEntity;

import java.util.UUID;

@Entity
@Data
@Table(name = "legal_profiles")
public class LegalProfile extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String legalName;
    private String taxNumber;
    private String taxOffice;
    private String companyType;
    private String billingAddress;
}
