package org.zerp.socket_service.principal;

import java.security.Principal;

public record SocketPrincipal(String principalId, String sessionId, String tenantId) implements Principal {

    @Override
    public String getName() {
        return principalId;
    }
}
