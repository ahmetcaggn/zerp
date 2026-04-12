package org.pomocra.socket_service.principal;

import java.security.Principal;

public class StompUserPrincipal implements Principal {
    private final String userId;
    private final String sessionId;

    public StompUserPrincipal(String userId, String sessionId) {
        this.userId = userId;
        this.sessionId = sessionId;
    }

    @Override
    public String getName() {
        return userId;
    }

    public String getSessionId() {
        return sessionId;
    }
}
