package org.zerp.crm.service;

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
        CreateTeamRequest, UpdateTeamRequest, Integer> {
    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeamResponse> findWithFilters(Map<String, String> filters, Pageable pageable) {
        Specification<TeamEntity> specification = buildSpecificationFromFilters(filters);
        return teamRepository.findAll(specification, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamResponse> findAllById(List<Integer> ids) {
        return teamRepository.findAllById(ids).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponse findById(Integer id) {
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
    public TeamResponse patch(Integer id, Map<String, Object> data) {
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
    public TeamResponse update(Integer id, UpdateTeamRequest data) {
        TeamEntity entity = findOrThrow(id);
        entity.setName(validateName(data.name()));
        entity.setDescription(data.description());

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    @Override
    public List<Integer> patchMany(List<Integer> ids, Map<String, Object> fields) {
        List<Integer> updated = new ArrayList<>();
        for (Integer id : ids) {
            try {
                patch(id, fields);
                updated.add(id);
            } catch (IllegalArgumentException ignored) {
            }
        }
        return updated;
    }

    @Override
    public void deleteById(Integer id) {
        TeamEntity entity = findOrThrow(id);
        teamRepository.delete(entity);
    }

    @Override
    public List<Integer> deleteMany(List<Integer> ids) {
        List<Integer> deleted = new ArrayList<>();
        for (Integer id : ids) {
            try {
                deleteById(id);
                deleted.add(id);
            } catch (IllegalArgumentException ignored) {
            }
        }
        return deleted;
    }

    // -- others --

    public TeamResponse deactivateTeam(Integer teamId) {
        TeamEntity entity = findOrThrow(teamId);
        if (!Boolean.TRUE.equals(entity.getIsActive())) {
            throw new IllegalStateException("Team is already inactive");
        }
        entity.setIsActive(false);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    public TeamResponse activateTeam(Integer teamId) {
        TeamEntity entity = findOrThrow(teamId);
        if (Boolean.TRUE.equals(entity.getIsActive())) {
            throw new IllegalStateException("Team is already active");
        }
        entity.setIsActive(true);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    public TeamResponse addMember(Integer teamId, AddMemberRequest request) {
        TeamEntity entity = findOrThrow(teamId);

        if (!Boolean.TRUE.equals(entity.getIsActive())) {
            throw new IllegalStateException("Cannot add member to an inactive team");
        }

        boolean alreadyMember = entity.getMembers().stream()
                .anyMatch(m -> m.getUserId().equals(request.userId()));
        if (alreadyMember) {
            throw new IllegalArgumentException(
                    String.format("User %s is already a member of this team", request.userId()));
        }

        TeamMemberEntity member = new TeamMemberEntity();
        member.setTeam(entity);
        member.setUserId(request.userId());
        member.setRole(request.role());
        member.setJoinedAt(LocalDateTime.now());
        entity.getMembers().add(member);

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    public TeamResponse removeMember(Integer teamId, UUID userId) {
        TeamEntity entity = findOrThrow(teamId);

        boolean removed = entity.getMembers().removeIf(m -> m.getUserId() != null && m.getUserId().equals(userId));
        if (!removed) {
            throw new IllegalArgumentException(
                    String.format("User %s is not a member of this team", userId));
        }

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    public TeamResponse changeMemberRole(Integer teamId, UUID userId, ChangeMemberRoleRequest request) {
        TeamEntity entity = findOrThrow(teamId);

        TeamMemberEntity member = entity.getMembers().stream()
                .filter(m -> m.getUserId() != null && m.getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format("User %s is not a member of this team", userId)));

        member.setRole(request.role());

        TeamEntity saved = teamRepository.save(entity);
        return toResponse(saved);
    }

    // ─── Helpers ───

    private TeamEntity findOrThrow(Integer teamId) {
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
                        m.getId(), m.getUserId(), m.getRole().name(), m.getJoinedAt()))
                .collect(Collectors.toList());

        return new TeamResponse(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                Boolean.TRUE.equals(entity.getIsActive()),
                memberResponses);
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
