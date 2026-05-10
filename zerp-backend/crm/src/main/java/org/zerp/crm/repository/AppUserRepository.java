package org.zerp.crm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.user.AppUser;

import java.util.UUID;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, UUID>, JpaSpecificationExecutor<AppUser> {
}
