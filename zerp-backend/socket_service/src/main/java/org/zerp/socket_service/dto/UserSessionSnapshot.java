package org.zerp.socket_service.dto;

import java.util.Set;

public record UserSessionSnapshot(String userId, Set<String> sessionIds) {
}
