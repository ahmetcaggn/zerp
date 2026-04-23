package org.zerp.common.security;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Component
public class CurrentUserIdResolver {
    public UUID resolve() {
        Object attrs = RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing request context");
        }

        String rawUserId;
        try {
            Object request = attrs.getClass().getMethod("getRequest").invoke(attrs);
            if (request == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing request context");
            }
            rawUserId = (String) request.getClass().getMethod("getHeader", String.class)
                    .invoke(request, "X-User-Id");
        } catch (ReflectiveOperationException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing request context", ex);
        }

        if (!StringUtils.hasText(rawUserId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id header");
        }

        try {
            return UUID.fromString(rawUserId.trim());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid X-User-Id header", ex);
        }
    }
}

