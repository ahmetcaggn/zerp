package org.zerp.crm.service;

import jakarta.persistence.EntityManager;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.crm.TeamEntity;
import org.zerp.common.entity.crm.TeamMemberEntity;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.FilterType;
import org.zerp.crm.dto.team.*;
import org.zerp.crm.repository.TeamRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Log4j2
@Service
@Transactional
public class TeamService implements IResourceService<TeamResponse, TeamResponse,
        CreateTeamRequest, UpdateTeamRequest, UUID> {
    private final TeamRepository teamRepository;
    private final EntityManager entityManager;

    public TeamService(TeamRepository teamRepository, EntityManager entityManager) {
        this.teamRepository = teamRepository;
        this.entityManager = entityManager;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeamResponse> findWithFilters(Map<String, String> filters, Pageable pageable) {
        Specification<TeamEntity> specification = buildSpecificationFromFilters(filters);
        return teamRepository.findAll(specification, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamResponse> findAllById(List<UUID> ids) {
        return teamRepository.findAllById(ids).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponse findById(UUID id) {
        TeamEntity entity = findOrThrow(id);
        return toResponse(entity);
    }

    @Override
    public TeamResponse create(CreateTeamRequest data) {
        TeamEntity entity = new TeamEntity();
        entity.setName(validateName(data.name()));
        entity.setDescription(data.description());
        entity.setIsActive(true);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    @Override
    public TeamResponse patch(UUID id, Map<String, Object> data) {
        TeamEntity entity = findOrThrow(id);

        if (data.containsKey("name")) {
            entity.setName(validateName(String.valueOf(data.get("name"))));
        }
        if (data.containsKey("description")) {
            Object description = data.get("description");
            entity.setDescription(description == null ? null : String.valueOf(description));
        }
        if (data.containsKey("isActive")) {
            entity.setIsActive(parseBoolean(data.get("isActive"), "isActive"));
        }

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    @Override
    public TeamResponse update(UUID id, UpdateTeamRequest data) {
        TeamEntity entity = findOrThrow(id);
        entity.setName(validateName(data.name()));
        entity.setDescription(data.description());

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    @Override
    public List<UUID> patchMany(List<UUID> ids, Map<String, Object> fields) {
        List<UUID> updated = new ArrayList<>();
        for (UUID id : ids) {
            try {
                patch(id, fields);
                updated.add(id);
            } catch (IllegalArgumentException ignored) {
            }
        }
        return updated;
    }

    @Override
    public void deleteById(UUID id) {
        TeamEntity entity = findOrThrow(id);
        teamRepository.delete(entity);
    }

    @Override
    public List<UUID> deleteMany(List<UUID> ids) {
        List<UUID> deleted = new ArrayList<>();
        for (UUID id : ids) {
            try {
                deleteById(id);
                deleted.add(id);
            } catch (IllegalArgumentException ignored) {
            }
        }
        return deleted;
    }

    // -- others --

    public TeamResponse deactivateTeam(UUID teamId) {
        TeamEntity entity = findOrThrow(teamId);
        if (!Boolean.TRUE.equals(entity.getIsActive())) {
            throw new IllegalStateException("Team is already inactive");
        }
        entity.setIsActive(false);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    public TeamResponse activateTeam(UUID teamId) {
        TeamEntity entity = findOrThrow(teamId);
        if (Boolean.TRUE.equals(entity.getIsActive())) {
            throw new IllegalStateException("Team is already active");
        }
        entity.setIsActive(true);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    public TeamResponse addMember(UUID teamId, AddMemberRequest request) {
        TeamEntity entity = findOrThrow(teamId);

        if (!Boolean.TRUE.equals(entity.getIsActive())) {
            throw new IllegalStateException("Cannot add member to an inactive team");
        }
        if (request.userId() == null) {
            throw new IllegalArgumentException("userId cannot be null");
        }
        if (request.role() == null) {
            throw new IllegalArgumentException("role cannot be null");
        }
        if (!appUserExists(request.userId())) {
            throw new IllegalArgumentException("User not found: " + request.userId());
        }

        boolean alreadyMember = entity.getMembers().stream()
                .anyMatch(m -> m.getUser() != null && request.userId().equals(m.getUser().getId()));
        if (alreadyMember) {
            throw new IllegalArgumentException(
                    String.format("User %s is already a member of this team", request.userId()));
        }

        TeamMemberEntity member = new TeamMemberEntity();
        member.setTeam(entity);
        member.setUser(toUserReference(request.userId()));
        member.setRole(request.role());
        member.setJoinedAt(LocalDateTime.now());
        entity.getMembers().add(member);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    public TeamResponse removeMember(UUID teamId, UUID userId) {
        TeamEntity entity = findOrThrow(teamId);
        if (userId == null) {
            throw new IllegalArgumentException("userId cannot be null");
        }

        boolean removed = entity.getMembers().removeIf(
                m -> m.getUser() != null && userId.equals(m.getUser().getId())
        );
        if (!removed) {
            throw new IllegalArgumentException(
                    String.format("User %s is not a member of this team", userId));
        }

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    public TeamResponse changeMemberRole(UUID teamId, UUID userId, ChangeMemberRoleRequest request) {
        TeamEntity entity = findOrThrow(teamId);
        if (userId == null) {
            throw new IllegalArgumentException("userId cannot be null");
        }
        if (request.role() == null) {
            throw new IllegalArgumentException("role cannot be null");
        }

        TeamMemberEntity member = entity.getMembers().stream()
                .filter(m -> m.getUser() != null && userId.equals(m.getUser().getId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format("User %s is not a member of this team", userId)));

        member.setRole(request.role());

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    // ─── Helpers ───

    private TeamEntity findOrThrow(UUID teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found: " + teamId));
    }

    private String validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Team name cannot be empty");
        }
        if (name.length() > 100) {
            throw new IllegalArgumentException("Team name is too long (max 100 characters)");
        }
        return name.trim();
    }

    private TeamResponse toResponse(TeamEntity entity) {
        List<TeamMemberResponse> memberResponses = entity.getMembers().stream()
                .map(m -> new TeamMemberResponse(
                        m.getId(),
                        m.getUser() != null ? m.getUser().getId() : null,
                        m.getRole().name(),
                        m.getJoinedAt()))
                .collect(Collectors.toList());

        return new TeamResponse(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                Boolean.TRUE.equals(entity.getIsActive()),
                memberResponses);
    }

    private boolean appUserExists(UUID userId) {
        return entityManager.find(AppUser.class, userId) != null;
    }

    private AppUser toUserReference(UUID userId) {
        if (userId == null) {
            return null;
        }
        return entityManager.getReference(AppUser.class, userId);
    }

    private Specification<TeamEntity> buildSpecificationFromFilters(Map<String, String> filters) {
        Specification<TeamEntity> specification = Specification.unrestricted();

        if (filters == null || filters.isEmpty()) {
            return specification;
        }

        for (Map.Entry<String, String> entry : filters.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();

            if ("q".equalsIgnoreCase(key) && value != null && !value.isBlank()) {
                specification = specification.and((root, _, cb) -> cb.or(
                        cb.like(cb.lower(root.get("name")), "%" + value.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("description")), "%" + value.toLowerCase() + "%")
                ));
                log.debug("Applied global search filter (q): {}", value);
                continue;
            }

            int separatorIndex = key.lastIndexOf('.');
            if (separatorIndex < 0 || separatorIndex == key.length() - 1) {
                log.warn("Invalid filter key format (missing filter type): {}", key);
                continue;
            }

            String field = key.substring(0, separatorIndex);
            FilterType filterType = FilterType.fromCode(key.substring(separatorIndex + 1));
            if (filterType == null) {
                log.warn("Unsupported filter type in key: {}", key);
                continue;
            }

            specification = specification.and((root, _, cb) -> {
                if ("isActive".equals(field)) {
                    Boolean boolValue = parseBoolean(value, key);
                    return filterType == FilterType.NOT_EQUAL
                            ? cb.notEqual(root.get(field), boolValue)
                            : cb.equal(root.get(field), boolValue);
                }

                if ("name".equals(field) || "description".equals(field)) {
                    if (filterType == FilterType.EQUAL) {
                        return cb.equal(root.get(field), value);
                    }
                    if (filterType == FilterType.NOT_EQUAL) {
                        return cb.notEqual(root.get(field), value);
                    }
                    if (filterType == FilterType.LIKE) {
                        return cb.like(cb.lower(root.get(field)), "%" + value.toLowerCase() + "%");
                    }
                }

                log.warn("Unsupported filter field or type for key: {}. This filter will be ignored.", key);
                return cb.conjunction();
            });
        }

        return specification;
    }

    private Boolean parseBoolean(Object rawValue, String fieldName) {
        if (rawValue instanceof Boolean boolValue) {
            return boolValue;
        }

        if (rawValue != null) {
            String text = String.valueOf(rawValue).trim();
            if ("true".equalsIgnoreCase(text) || "false".equalsIgnoreCase(text)) {
                return Boolean.parseBoolean(text);
            }
        }

        throw new IllegalArgumentException("Invalid boolean value for " + fieldName + ": " + rawValue);
    }
}
