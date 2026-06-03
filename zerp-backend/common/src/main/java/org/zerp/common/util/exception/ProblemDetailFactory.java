package org.zerp.common.util.exception;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.stereotype.Component;
import org.zerp.common.context.RequestContext;

import java.net.URI;
import java.time.Instant;

@Component
public class ProblemDetailFactory {
    @Value("${app.version}")
    private String appVersion;

    public ProblemDetail buildProblem(HttpStatus status, String errorCode, String detail) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(status, detail);
        problem.setType(URI.create("https://zerp.org/errors/" + errorCode.toLowerCase().replace('_', '-')));
        problem.setProperty("errorCode", errorCode);
        problem.setProperty("timestamp", Instant.now());
        problem.setProperty("durationMs", RequestContext.endTiming());
        problem.setProperty("version", appVersion);
        return problem;
    }
}
