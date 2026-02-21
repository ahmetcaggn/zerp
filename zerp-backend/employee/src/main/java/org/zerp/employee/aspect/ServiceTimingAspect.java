package org.zerp.employee.aspect;

import lombok.extern.log4j.Log4j2;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.zerp.common.context.RequestContext;

import java.time.LocalDateTime;

/**
 * Aspect for timing service method executions.
 * Captures start and end times and stores them in RequestContext for use in responses.
 */
@Aspect
@Component
@Log4j2
public class ServiceTimingAspect {

    @Pointcut("execution(* org.zerp.employee.service.*.*(..))")
    public void serviceMethods() {}

    @Around("serviceMethods()")
    public Object timeServiceMethod(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName();
        LocalDateTime startTime = LocalDateTime.now();
        
        log.debug("Entering service method: {} at {}", methodName, startTime);
        RequestContext.startTiming(methodName);

        try {
            Object result = joinPoint.proceed();
            
            LocalDateTime endTime = LocalDateTime.now();
            long durationMs = java.time.Duration.between(startTime, endTime).toMillis();
            
            log.debug("Exiting service method: {} at {} (duration: {}ms)", methodName, endTime, durationMs);
            
            return result;
        } catch (Throwable ex) {
            LocalDateTime endTime = LocalDateTime.now();
            long durationMs = java.time.Duration.between(startTime, endTime).toMillis();
            
            log.error("Service method {} failed after {}ms: {}", methodName, durationMs, ex.getMessage());
            throw ex;
        }
    }
}
