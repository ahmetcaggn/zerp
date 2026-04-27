package org.zerp.user.config;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
@ConfigurationProperties(prefix = "keycloak.admin")
public class KeycloakAdminProperties {
    @NotBlank(message = "keycloak.admin.server-url is required and must not be blank")
    private String serverUrl;

    @NotBlank(message = "keycloak.admin.realm is required and must not be blank")
    private String realm;

    @NotBlank(message = "keycloak.admin.client-id is required and must not be blank")
    private String clientId;

    @NotBlank(message = "keycloak.admin.client-secret is required and must not be blank")
    private String clientSecret;
}
