package org.zerp.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.dto.feign.user.UserCheckResponseDTO;
import org.zerp.common.dto.feign.user.UserCreateIfNotExistRequestDTO;
import org.zerp.common.entity.user.AppUser;
import org.zerp.user.mapper.UserMapper;
import org.zerp.user.repository.TenantRepository;
import org.zerp.user.repository.UserRepository;

import java.util.UUID;

@Log4j2
@Service
@RequiredArgsConstructor
public class FeignUserService {
    private final UserRepository repository;
    private final TenantRepository tenantRepository;
    private final UserMapper mapper;

    /**
     * Check if user with given id exists, if not create new user with given info
     * @param request the user info to check and create if not exist
     */
    public UserCheckResponseDTO checkUserExists(UserCreateIfNotExistRequestDTO request) {
        validateRequest(request);

        UUID tenantId = request.getTenantId();
        if (!tenantRepository.existsById(tenantId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Tenant not found for user creation: " + tenantId
            );
        }

        log.trace("Checking if user with id {} exists", request.getId());
        boolean exist = repository.existsById(request.getId());
        log.trace("User with id {} exists: {}", request.getId(), exist);

        // return true if already exist
        if (exist) {
            log.debug("User with id {} already exists, skipping creation", request.getId());
            return UserCheckResponseDTO.builder().valid(true).build();
        }

        // create new
        log.info("User with id {} does not exist, creating new user", request.getId());
        AppUser newUser = mapper.toEntity(request);
        newUser.setTenantId(tenantId);
        try {
            repository.save(newUser);
            log.info("Created new user with id {}", request.getId());
        } catch (DataIntegrityViolationException e) {
            // Another request may create the same user between exists-check and save.
            if (repository.existsById(request.getId())) {
                log.info("User with id {} was created concurrently, treating as already existing", request.getId());
                return UserCheckResponseDTO.builder().valid(true).build();
            }

            if (isForeignKeyViolation(e)) {
                log.error("Foreign key violation while creating user with id {}: {}", request.getId(), e.getMessage());
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Tenant not found for user creation: " + tenantId, e);
            }

            if (isUniqueViolation(e)) {
                log.error("Unique constraint violation while creating user with id {}: {}", request.getId(), e.getMessage());
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "User already exists with conflicting unique fields", e);
            }

            log.error("Data integrity violation while creating user with id {}: {}", request.getId(), e.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "User creation failed due to invalid data", e);
        } catch (Exception e) {
            log.error("Failed to create user with id {}: {}", request.getId(), e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to create user", e);
        }
        return UserCheckResponseDTO.builder().valid(false).build();
    }

    public void deleteById(UUID id) {
        log.info("Deleting user with id {} from DB", id);
        repository.deleteById(id);
    }

    private void validateRequest(UserCreateIfNotExistRequestDTO request) {
        if (request == null || request.getId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User id is required");
        }
        if (request.getTenantId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tenant id is required");
        }
    }

    private boolean isUniqueViolation(DataIntegrityViolationException exception) {
        return hasSqlState(exception, "23505");
    }

    private boolean isForeignKeyViolation(DataIntegrityViolationException exception) {
        return hasSqlState(exception, "23503");
    }

    private boolean hasSqlState(Throwable throwable, String sqlState) {
        Throwable current = throwable;
        while (current != null) {
            if (current instanceof java.sql.SQLException sqlException
                    && sqlState.equals(sqlException.getSQLState())) {
                return true;
            }
            current = current.getCause();
        }
        return false;
    }
}
