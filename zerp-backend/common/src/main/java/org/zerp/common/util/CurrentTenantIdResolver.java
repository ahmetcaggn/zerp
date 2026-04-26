package org.zerp.common.util;

import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.UUID;

@Log4j2
@Component
public class CurrentTenantIdResolver {
    public static final String TENANT_ID_HEADER = "X-Tenant-Id";

    public UUID resolve() {
        Object attrs = RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            log.warn("cannot resolve tenant header {} outside request scope", TENANT_ID_HEADER);
            return null;
        }

        String tenantHeader;
        try {
            Object request = attrs.getClass().getMethod("getRequest").invoke(attrs);
            if (request == null) {
                log.warn("request is null in request context while resolving {}", TENANT_ID_HEADER);
                return null;
            }
            tenantHeader = (String) request.getClass().getMethod("getHeader", String.class)
                    .invoke(request, TENANT_ID_HEADER);
        } catch (ReflectiveOperationException ex) {
            log.warn("error resolving tenant header {} from request context", TENANT_ID_HEADER, ex);
            return null;
        }

        if (!StringUtils.hasText(tenantHeader)) {
            log.warn("missing required tenant header {}", TENANT_ID_HEADER);
            return null;
        }

        try {
            return UUID.fromString(tenantHeader.trim());
        } catch (IllegalArgumentException ex) {
            log.warn("invalid tenant header {} value {}", TENANT_ID_HEADER, tenantHeader);
            return null;
        }
    }
}
