package com.oep.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.oep.entities.AuditAction;
import com.oep.entities.ServiceName;
import com.oep.entities.UserRole;
import com.oep.service.AuditLogService;
import com.oep.security.UserPrincipal;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditLogAspect {
    private final AuditLogService auditLogService;

    @Around("execution(* com.oep.service.*ServiceImpl.create*(..)) || " +
            "execution(* com.oep.service.*ServiceImpl.update*(..)) || " +
            "execution(* com.oep.service.*ServiceImpl.delete*(..))")
    public Object auditServiceMethods(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getName();

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = "system";
        UserRole userRole = UserRole.ROLE_ADMIN;
        
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
            userEmail = principal.getEmail();
            userRole = UserPrincipal.getUserRole(principal.getUserRole());
        }

        ServiceName serviceName = mapToServiceName(className);
        AuditAction action = mapToAction(methodName);
        String details = String.format("%s.%s", className, methodName);

        try {
            Object result = joinPoint.proceed();
            auditLogService.logSuccess(serviceName, userEmail, userRole, action, details);
            return result;
        } catch (Exception e) {
            auditLogService.logFailure(serviceName, userEmail, userRole, action, details, e.getMessage());
            throw e;
        }
    }

    private ServiceName mapToServiceName(String className) {
        if (className.contains("Auth")) return ServiceName.AUTH_SERVICE;
        if (className.contains("User")) return ServiceName.USER_SERVICE;
        if (className.contains("Course")) return ServiceName.COURSE_SERVICE;
        if (className.contains("Exam")) return ServiceName.EXAM_SERVICE;
        if (className.contains("Question")) return ServiceName.QUESTION_SERVICE;
        if (className.contains("Result")) return ServiceName.RESULT_SERVICE;
        return ServiceName.ADMIN_SERVICE;
        
    }

    private AuditAction mapToAction(String methodName) {
        if (methodName.startsWith("create")) return AuditAction.USER_CREATED;
        if (methodName.startsWith("update")) return AuditAction.USER_UPDATED;
        if (methodName.startsWith("delete")) return AuditAction.USER_DELETED;
        return AuditAction.LOG_VIEWED;
    }
    
}
