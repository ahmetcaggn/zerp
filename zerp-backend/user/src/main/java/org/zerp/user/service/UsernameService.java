package org.zerp.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.zerp.common.dto.user.UsernameCheckResponseDTO;
import org.zerp.user.config.KeycloakAdminProperties;
import org.zerp.user.repository.UserRepository;

import java.util.List;
import java.util.regex.Pattern;

@Log4j2
@Service
@RequiredArgsConstructor
public class UsernameService {
    // Username validation constants
    public static final int USERNAME_MIN_LENGTH = 3;
    public static final int USERNAME_MAX_LENGTH = 255;
    public static final String USERNAME_PATTERN_STRING = "^[a-zA-Z0-9._-]{" + USERNAME_MIN_LENGTH + "," + USERNAME_MAX_LENGTH + "}$";
    public static final String USERNAME_VALIDATION_MESSAGE = "Username must be " + USERNAME_MIN_LENGTH + "-" + USERNAME_MAX_LENGTH
            + " characters and contain only letters, numbers, dots, hyphens, and underscores";

    private static final Pattern USERNAME_PATTERN = Pattern.compile(USERNAME_PATTERN_STRING);

    private final Keycloak keycloakAdminClient;
    private final KeycloakAdminProperties keycloakAdminProperties;
    private final UserRepository userRepository;

    public UsernameCheckResponseDTO isUsernameAvailable(String username) {
        boolean isAvailable = !isUserExists(username);
        return UsernameCheckResponseDTO.builder()
                .username(username)
                .available(isAvailable).build();
    }

    public boolean isUserExists(String username) {
        validateUsername(username);

        List<UserRepresentation> kcResult = keycloakAdminClient.realm(keycloakAdminProperties.getRealm())
                .users()
                .search(username, true);
        boolean existInKeycloak = kcResult.stream().anyMatch(u -> u.getUsername().equals(username));
        boolean existInDb = userRepository.existsByUsername(username);

        if (existInDb != existInKeycloak) {
            throw new IllegalStateException("Data inconsistency detected for username " + username +
                    ": existInDb=" + existInDb + ", existInKeycloak=" + existInKeycloak);
        }

        return existInDb;
    }

    /**
     * Validates username to prevent injection attacks and ensure expected format.
     * Username must be 3-255 characters containing only alphanumeric characters, dots, hyphens, and underscores.
     *
     * @param username the username to validate
     * @throws ResponseStatusException with BAD_REQUEST if username format is invalid
     */
    private void validateUsername(String username) {
        if (username == null || username.isBlank()) {
            log.warn("Invalid username validation attempt: username is null or blank");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username cannot be blank");
        }

        if (!USERNAME_PATTERN.matcher(username).matches()) {
            log.warn("Invalid username format detected for input: {} (possible injection attempt)",
                    username.length() > 50 ? username.substring(0, 50) + "..." : username);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, USERNAME_VALIDATION_MESSAGE);
        }

        log.debug("Username validation passed for: {}", username);
    }
}
