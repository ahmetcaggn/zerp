package org.zerp.gateway.config;

import lombok.extern.log4j.Log4j2;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Log4j2
@Component
public class AspectLogger {

    @Before("execution(* org.zerp.Gateway.config.GatewayConfig.*(..)) && !@annotation(org.zerp.Gateway.config.annotation.NoAspectLogging)")
    public void beforeMethodCall(JoinPoint joinPoint) {
        log.trace("{} - {} start...", joinPoint.toShortString(), Arrays.toString(joinPoint.getArgs()));
    }
    @After("execution(* org.zerp.Gateway.config.GatewayConfig.*(..)) && !@annotation(org.zerp.Gateway.config.annotation.NoAspectLogging)")
     public void afterMethodCall(JoinPoint joinPoint) {
        log.trace("{} - {} end...", joinPoint.toShortString(), Arrays.toString(joinPoint.getArgs()));
    }

}
