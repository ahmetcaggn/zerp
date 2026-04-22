package org.zerp.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.dto.feign.user.UserCheckResponseDTO;
import org.zerp.common.dto.feign.user.UserCreateIfNotExistRequestDTO;
import org.zerp.common.entity.user.AppUser;
import org.zerp.user.mapper.UserMapper;
import org.zerp.user.repository.UserRepository;

@Log4j2
@Service
@RequiredArgsConstructor
public class FeignUserService {
    private final UserRepository repository;
    private final UserMapper userMapper;

    /**
     * Check if user with given id exists, if not create new user with given info
     * @param request the user info to check and create if not exist
     */
    public UserCheckResponseDTO checkUserExists(UserCreateIfNotExistRequestDTO request) {
        log.trace("Checking if user with id {} exists", request.getId());
        AppUser user = repository.findById(request.getId()).orElse(null);
        boolean exist = user != null;
        log.trace("User with id {} exists: {}", request.getId(), exist);

        // return true if already exist
        if (exist) {
            log.debug("User with id {} already exists, skipping creation", request.getId());
            return UserCheckResponseDTO.builder().valid(true).build();
        }

        // create new
        log.info("User with id {} does not exist, creating new user", request.getId());
        AppUser newUser = userMapper.toAppUser(request);
        try {
            repository.save(newUser);
            log.info("Created new user with id {}", request.getId());
        } catch (Exception e) {
            log.error("Failed to create user with id {}: {}", request.getId(), e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to create user");
        }
        return UserCheckResponseDTO.builder().valid(false).build();
    }
}
