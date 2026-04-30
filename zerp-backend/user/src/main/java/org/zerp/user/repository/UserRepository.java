package org.zerp.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.zerp.common.entity.user.AppUser;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<AppUser, UUID>, JpaSpecificationExecutor<AppUser> {
    /**
     * Check if user exists by username (case-insensitive).
     * Performs case-insensitive comparison at the database level.
     *
     * @param username the username to search for
     * @return true if user exists, false otherwise
     */
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM AppUser u WHERE LOWER(u.username) = LOWER(:username)")
    boolean existsByUsernameIgnoreCase(String username);
}
