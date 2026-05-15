package org.zerp.user.service;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.zerp.common.dto.feign.user.keycloak.KeycloakCreateUserRequestDTO;
import org.zerp.common.dto.feign.user.keycloak.KeycloakCreateUserResponseDTO;
import org.zerp.common.dto.feign.user.keycloak.KeycloakUpdateUserRequestDTO;
import org.zerp.common.dto.feign.user.keycloak.KeycloakUpdateUserResponseDTO;
import org.zerp.user.config.KeycloakAdminProperties;

import java.util.*;

@Log4j2
@Service
@RequiredArgsConstructor
public class FeignKeycloakService {
    private static final String KEYCLOAK_TENANT_ID_ATTRIBUTE = "tenant_id";

    private final Keycloak keycloakAdminClient;
    private final KeycloakAdminProperties keycloakAdminProperties;
    private final UsernameService usernameService;

    public KeycloakCreateUserResponseDTO createUser(KeycloakCreateUserRequestDTO data) {
        log.info("Starting user creation in Keycloak for username: {}, email: {}", data.getUsername(), data.getEmail());

        checkIfUserExists(data.getUsername());

        UserRepresentation user = new UserRepresentation();
        user.setUsername(data.getUsername());
        user.setEmail(data.getEmail());
        user.setEnabled(true);

        Map<String, List<String>> attributes = new HashMap<>();
        if (data.getTenantId() != null) {
            log.debug("Setting tenant_id attribute: {} for user: {}", data.getTenantId(), data.getUsername());
            attributes.put(KEYCLOAK_TENANT_ID_ATTRIBUTE, Collections.singletonList(data.getTenantId().toString()));
        }
        user.setAttributes(attributes);

        String realm = keycloakAdminProperties.getRealm();
        UsersResource usersResource = keycloakAdminClient.realm(realm).users();

        try (Response response = usersResource.create(user)) {
            if (response.getStatus() == Response.Status.CREATED.getStatusCode()) {
                log.debug("User created successfully in Keycloak, status: {}", response.getStatus());

                // get user id from keycloak
                String path = response.getLocation().getPath();
                String userIdString = path.substring(path.lastIndexOf('/') + 1);
                UUID userId;
                try {
                    userId = UUID.fromString(userIdString);
                    log.debug("Parsed user ID from Keycloak response: {}", userId);
                } catch (IllegalArgumentException e) {
                    log.error("Failed to parse created user ID from Keycloak response path: {}", path, e);
                    throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                            "Failed to parse created user ID from Keycloak response", e);
                }

                if (data.getTempPassword() != null && !data.getTempPassword().isBlank()) {
                    log.debug("Setting temporary password for user: {}", data.getUsername());
                    CredentialRepresentation passwordCred = new CredentialRepresentation();
                    passwordCred.setTemporary(true);
                    passwordCred.setType(CredentialRepresentation.PASSWORD);
                    passwordCred.setValue(data.getTempPassword());

                    usersResource.get(userIdString).resetPassword(passwordCred);
                    log.debug("Temporary password set successfully for user: {}", data.getUsername());
                } else {
                    log.debug("No temporary password provided for user: {}", data.getUsername());
                }

                log.info("User {} successfully created in Keycloak with userId: {}", data.getUsername(), userId);
                return KeycloakCreateUserResponseDTO.builder()
                        .userId(userId)
                        .build();
            } else if (response.getStatus() == Response.Status.CONFLICT.getStatusCode()) {
                log.warn("User creation failed for username: {} - User already exists in Keycloak (Status: 409)", data.getUsername());
                throw new ResponseStatusException(HttpStatus.CONFLICT, "User creation failed. Username already exists.");
            } else {
                log.error("Failed to create user in Keycloak for username: {} - Unexpected status: {}",
                        data.getUsername(), response.getStatus());
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY,
                        "Failed to create user in Keycloak. Status: " + response.getStatus());
            }
        } catch (ResponseStatusException e) {
            // Already logged at source, just rethrow
            throw e;
        } catch (Exception e) {
            log.error("Error creating user in Keycloak for username {}: {}",
                    data.getUsername(), e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to create user in Keycloak", e);
        }
    }

    /**
     * Throws ResponseStatusException with CONFLICT if user with given username already exists in Keycloak or database.
     *
     * @param username the username to be checked.
     */
    private void checkIfUserExists(String username) {
        try {
            boolean exists = usernameService.isUserExists(username);
            if (exists) {
                log.info("User creation attempt for existing username: {}", username);
                throw new ResponseStatusException(HttpStatus.CONFLICT, "User creation failed. Username is already exist.");
            }
        } catch (IllegalStateException e) {
            log.error("Data inconsistency detected for username {}. {}", username, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User creation failed");
        } catch (Exception e) {
            log.error("Error checking if user exists in Keycloak for username {}: {}",
                    username, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "User creation failed");
        }
    }

    public void deleteUser(UUID userId) {
        log.info("Deleting user from Keycloak with id: {}", userId);
        String realm = keycloakAdminProperties.getRealm();
        try (Response response = keycloakAdminClient.realm(realm).users().delete(userId.toString())) {
            log.info("User {} successfully deleted from Keycloak, status: {}", userId, response.getStatus());
        } catch (Exception e) {
            log.error("Failed to delete user {} from Keycloak: {}", userId, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to delete user from Keycloak", e);
        }
    }

    public KeycloakUpdateUserResponseDTO updateUser(UUID userId, KeycloakUpdateUserRequestDTO data) {
        log.info("Updating user in Keycloak for userId: {}", userId);

        String realm = keycloakAdminProperties.getRealm();
        UsersResource usersResource = keycloakAdminClient.realm(realm).users();

        try {
            UserResource userResource = usersResource.get(userId.toString());
            UserRepresentation user = userResource.toRepresentation();
            if (data.getEmail() != null) {
                user.setEmail(data.getEmail());
            }

            userResource.update(user);
            log.info("User {} successfully updated in Keycloak", userId);
            return KeycloakUpdateUserResponseDTO.builder().build();
        } catch (Exception e) {
            log.error("Error updating user in Keycloak for userId {}: {}", userId, e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Failed to update user in Keycloak", e);
        }
    }
}
