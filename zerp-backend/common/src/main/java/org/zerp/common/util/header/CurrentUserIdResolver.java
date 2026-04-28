package org.zerp.common.util.header;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Log4j2
@Component
public class CurrentUserIdResolver {
    public static final String USER_ID_HEADER = "X-User-Id";

    public UUID resolve() {
        Object attrs = RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            log.error("cannot resolve user ID outside request scope");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing request context");
        }

        String rawUserId;
        try {
            Object request = attrs.getClass().getMethod("getRequest").invoke(attrs);
            if (request == null) {
                log.error("request is null in request context");
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing request context");
            }
            rawUserId = (String) request.getClass().getMethod("getHeader", String.class)
                    .invoke(request, USER_ID_HEADER);
        } catch (ReflectiveOperationException ex) {
            log.error("error resolving user ID from request", ex);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing request context", ex);
        }

        if (!StringUtils.hasText(rawUserId)) {
            log.error("missing X-User-Id header");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing X-User-Id header");
        }

        try {
            return UUID.fromString(rawUserId.trim());
        } catch (IllegalArgumentException ex) {
            log.error("invalid X-User-Id header value: {}", rawUserId, ex);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid X-User-Id header", ex);
        }
    }
}

