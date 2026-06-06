package org.zerp.notification.repository;
 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.zerp.common.entity.notification.Announcement;
 
import java.util.Optional;
import java.util.UUID;
 
public interface AnnouncementRepository extends JpaRepository<Announcement, UUID>, JpaSpecificationExecutor<Announcement> {

    Optional<Announcement> findByIdAndTenantId(UUID id, UUID tenantId);
}
