package org.zerp.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.entity.user.AppUser;
import org.zerp.common.error.filter.FilterError;
import org.zerp.common.error.filter.FilterErrorUtils;
import org.zerp.common.resource.service.IResourceService;
import org.zerp.common.resource.util.filter.FilterRefiner;
import org.zerp.common.util.header.CurrentUserIdResolver;
import org.zerp.user.dto.UserResponseDTO;
import org.zerp.user.mapper.UserMapper;
import org.zerp.user.permission.UserPermissionEvaluator;
import org.zerp.user.repository.UserRepository;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class UserService implements IResourceService<UserResponseDTO, UserResponseDTO, Void, Void, UUID> {
    private final UserRepository userRepository;
    private final UserPermissionEvaluator permissionEvaluator;
    private final CurrentUserIdResolver userIdResolver;
    private final FilterRefiner filterRefiner;
    private final UserMapper userMapper;

    @Override
    public Page<UserResponseDTO> findWithFilters(Map<String, String> filters, Pageable pageable) {
        log.debug("Finding users with filters: {}, pageable: {}", filters, pageable);
        Specification<AppUser> spec = permissionEvaluator.filterRead(userIdResolver.resolve());
        spec = spec.and(filterRefiner.refinedOrBadRequest(filters, AppUser.class));
        log.debug("Refined filters: {}", filters);
        try {
            return userRepository.findAll(spec, pageable).map(userMapper::toUserResponseDTO);
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
    public List<UserResponseDTO> findAllById(List<UUID> uuids) {
        log.debug("Finding users by IDs: {}", uuids);
        List<AppUser> users = userRepository.findAllById(uuids);
        log.debug("Found {} users for provided IDs", users.size());
        UUID requesterId = userIdResolver.resolve();
        return users.stream()
                .filter(user -> permissionEvaluator.canRead(requesterId, user))
                .map(userMapper::toUserResponseDTO)
                .toList();
    }

    @Override
    public UserResponseDTO findById(UUID uuid) {
        log.debug("Finding user by ID: {}", uuid);
        AppUser user = userRepository.findById(uuid).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + uuid));

        if (!permissionEvaluator.canRead(userIdResolver.resolve(), user)) {
            log.warn("User {} does not have permission to read user {}", userIdResolver.resolve(), uuid);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with id: " + uuid);
        }

        log.debug("User found: {}", user);
        return userMapper.toUserResponseDTO(user);
    }

    @Override
    public UserResponseDTO create(Void data) {
        throw new UnsupportedOperationException("Create operation is not supported for User resource");
    }

    @Override
    public UserResponseDTO patch(UUID uuid, Map<String, Object> data) {
        throw new UnsupportedOperationException("Patch operation is not supported for User resource");
    }

    @Override
    public UserResponseDTO update(UUID uuid, Void data) {
        throw new UnsupportedOperationException("Update operation is not supported for User resource");
    }

    @Override
    public List<UUID> patchMany(List<UUID> uuids, Map<String, Object> fields) {
        throw new UnsupportedOperationException("Bulk patch operation is not supported for User resource");
    }

    @Override
    public void deleteById(UUID uuid) {
        throw new UnsupportedOperationException("Delete operation is not supported for User resource");
    }

    @Override
    public List<UUID> deleteMany(List<UUID> uuids) {
        throw new UnsupportedOperationException("Bulk delete operation is not supported for User resource");
    }
}
