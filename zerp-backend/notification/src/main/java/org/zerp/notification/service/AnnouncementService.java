package org.zerp.notification.service;
 
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.employee.Employee;
import org.zerp.common.entity.notification.Announcement;
import org.zerp.common.entity.notification.AnnouncementRecipientMode;
import org.zerp.common.entity.notification.AnnouncementRecipientSnapshot;
import org.zerp.common.error.filter.FilterError;
import org.zerp.common.error.filter.FilterErrorUtils;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentTenantIdResolver;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.notification.dtos.request.announcement.CreateAnnouncementRequestDto;
import org.zerp.notification.dtos.response.announcement.AnnouncementRecipientResponseDto;
import org.zerp.notification.dtos.response.announcement.AnnouncementResponseDto;
import org.zerp.notification.kafka.AnnouncementMailPublisher;
import org.zerp.notification.permission.AnnouncementPermissionEvaluator;
import org.zerp.notification.repository.AnnouncementRepository;
import org.zerp.notification.repository.EmployeeRepository;
 
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class AnnouncementService implements IResourceService<AnnouncementResponseDto, AnnouncementResponseDto,
        CreateAnnouncementRequestDto, CreateAnnouncementRequestDto, UUID> {
    private final AnnouncementRepository announcementRepository;
    private final EmployeeRepository employeeRepository;
    private final AnnouncementMailPublisher announcementMailPublisher;
    private final AnnouncementPermissionEvaluator permissionEvaluator;
    private final CurrentUserIdResolver currentUserIdResolver;
    private final CurrentTenantIdResolver currentTenantIdResolver;
    private final FilterRefiner filterRefiner;
 
    @Override
    @Transactional(readOnly = true)
    public Page<AnnouncementResponseDto> findWithFilters(Map<String, String> filters, Pageable pageable) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = requireTenantId();
        if (!permissionEvaluator.canReadAnnouncements(userId, tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read announcements");
        }
 
        Specification<Announcement> spec = (root, query, cb) -> cb.equal(root.get("tenantId"), tenantId);
        Specification<Announcement> filterSpec = filterRefiner.refinedOrBadRequest(filters, Announcement.class);
        spec = spec.and(filterSpec);
 
        try {
            return announcementRepository.findAll(spec, pageable).map(this::toResponseDto);
        } catch (DataAccessException e) {
            if (e.getCause() instanceof FilterError.Runtime fe) {
                log.warn("Filter error while processing filters {}: {}", filters, fe.getMessage(), e);
                throw FilterErrorUtils.toResponseStatusException(fe.getError());
            }
            log.error("Unexpected error while processing filters {}: {}", filters, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred: " + e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            log.error("Unexpected error while processing filters {}: {}", filters, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid filter parameters: " + e.getMessage(), e);
        }
    }
 
    @Override
    @Transactional(readOnly = true)
    public List<AnnouncementResponseDto> findAllById(List<UUID> ids) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = requireTenantId();
        if (!permissionEvaluator.canReadAnnouncements(userId, tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read announcements");
        }
 
        List<AnnouncementResponseDto> result = new ArrayList<>();
        for (UUID id : ids) {
            announcementRepository.findByIdAndTenantId(id, tenantId)
                    .map(this::toResponseDto)
                    .ifPresent(result::add);
        }
        return result;
    }
 
    @Override
    @Transactional(readOnly = true)
    public AnnouncementResponseDto findById(UUID id) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = requireTenantId();
        if (!permissionEvaluator.canReadAnnouncements(userId, tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to read announcements");
        }

 
        Announcement announcement = announcementRepository.findByIdAndTenantId(id, tenantId)
                .orElseThrow(() -> new EntityNotFoundException("Announcement not found: " + id));
        return toResponseDto(announcement);
    }
  
    @Override
    @Transactional
    public AnnouncementResponseDto create(CreateAnnouncementRequestDto request) {
        UUID userId = currentUserIdResolver.resolve();
        UUID tenantId = requireTenantId();
        if (!permissionEvaluator.canCreateAnnouncements(userId, tenantId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have permission to create announcements");
        }
 
        String senderName = resolveSenderName(userId, tenantId);
        List<Employee> recipients = resolveRecipients(request, tenantId);
        if (recipients.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Announcement requires at least one recipient");
        }
        List<String> emails = recipients.stream()
                .map(Employee::getEmail)
                .filter(email -> email != null && !email.isBlank())
                .distinct()
                .toList();
        if (emails.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Announcement recipients must have email addresses");
        }
 
        Announcement announcement = new Announcement();
        announcement.setTenantId(tenantId);
        announcement.setTitle(request.getTitle().trim());
        announcement.setContent(request.getContent().trim());
        announcement.setSenderId(userId);
        announcement.setSenderName(senderName);
        announcement.setRecipientMode(request.getRecipientMode());
        announcement.setRecipientCount(recipients.size());
        announcement.setRecipients(toSnapshots(request.getRecipientMode(), recipients));
 
        Announcement saved = announcementRepository.save(announcement);
        announcementMailPublisher.publishAnnouncementMail(emails, saved.getTitle(), saved.getContent(), senderName);
 
        return toResponseDto(saved);
    }
 
    @Override
    public AnnouncementResponseDto patch(UUID id, Map<String, Object> data) {
        throw new UnsupportedOperationException("Patch operation is not supported for Announcement resource");
    }
 
    @Override
    public AnnouncementResponseDto update(UUID id, CreateAnnouncementRequestDto data) {
        throw new UnsupportedOperationException("Update operation is not supported for Announcement resource");
    }
 
    @Override
    public List<UUID> patchMany(List<UUID> ids, Map<String, Object> fields) {
        throw new UnsupportedOperationException("Bulk patch operation is not supported for Announcement resource");
    }
 
    @Override
    public void deleteById(UUID id) {
        throw new UnsupportedOperationException("Delete operation is not supported for Announcement resource");
    }
 
    @Override
    public List<UUID> deleteMany(List<UUID> ids) {
        throw new UnsupportedOperationException("Bulk delete operation is not supported for Announcement resource");
    }
 
    private List<Employee> resolveRecipients(CreateAnnouncementRequestDto request, UUID tenantId) {
        if (request == null || request.getRecipientMode() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "recipientMode is required");
        }
 
        if (request.getRecipientMode() == AnnouncementRecipientMode.ALL) {
            return employeeRepository.findAllByTenantIdAndNotDeleted(tenantId);
        }
 
        List<UUID> employeeIds = request.getEmployeeIds();
        if (employeeIds == null || employeeIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "employeeIds is required when recipientMode is EMPLOYEES");
        }
 
        Set<UUID> uniqueIds = new LinkedHashSet<>(employeeIds);
        List<Employee> employees = employeeRepository.findAllByIdInAndTenantIdAndNotDeleted(List.copyOf(uniqueIds), tenantId);
        if (employees.size() != uniqueIds.size()) {
            throw new EntityNotFoundException("One or more employees were not found in current tenant");
        }
 
        return employees.stream()
                .sorted(Comparator.comparing(employee -> employee.getFirstName() + " " + employee.getLastName()))
                .toList();
    }
 
    private List<AnnouncementRecipientSnapshot> toSnapshots(AnnouncementRecipientMode mode, List<Employee> employees) {
        if (mode == AnnouncementRecipientMode.ALL) {
            return List.of();
        }
 
        return employees.stream().map(employee -> {
            AnnouncementRecipientSnapshot snapshot = new AnnouncementRecipientSnapshot();
            snapshot.setEmployeeId(employee.getId());
            snapshot.setDisplayName(formatEmployeeName(employee));
            snapshot.setEmail(employee.getEmail());
            return snapshot;
        }).toList();
    }
 
    private AnnouncementResponseDto toResponseDto(Announcement announcement) {
        return AnnouncementResponseDto.builder()
                .id(announcement.getId())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .recipientMode(announcement.getRecipientMode())
                .recipients(announcement.getRecipients().stream()
                        .map(recipient -> AnnouncementRecipientResponseDto.builder()
                                .employeeId(recipient.getEmployeeId())
                                .displayName(recipient.getDisplayName())
                                .email(recipient.getEmail())
                                .build())
                        .toList())
                .recipientCount(resolveRecipientCount(announcement))
                .senderId(announcement.getSenderId())
                .sender(announcement.getSenderName())
                .createdBy(announcement.getCreatedBy())
                .createdAt(announcement.getCreatedAt())
                .build();
    }
 
    private UUID requireTenantId() {
        UUID tenantId = currentTenantIdResolver.resolve();
        if (tenantId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tenantId is required");
        }
        return tenantId;
    }
 
    private String formatEmployeeName(Employee employee) {
        String fullName = String.join(" ",
                employee.getFirstName() != null ? employee.getFirstName() : "",
                employee.getLastName() != null ? employee.getLastName() : ""
        ).trim();
        return fullName.isBlank() ? employee.getEmail() : fullName;
    }
 
    private String resolveSenderName(UUID userId, UUID tenantId) {
        return employeeRepository.findByIdAndTenantIdAndNotDeleted(userId, tenantId)
                .map(this::formatEmployeeName)
                .filter(name -> name != null && !name.isBlank())
                .orElse(userId.toString());
    }
 
    private Integer resolveRecipientCount(Announcement announcement) {
        if (announcement.getRecipientCount() != null) {
            return announcement.getRecipientCount();
        }
        return announcement.getRecipientMode() == AnnouncementRecipientMode.ALL
                ? null
                : announcement.getRecipients().size();
    }
}
