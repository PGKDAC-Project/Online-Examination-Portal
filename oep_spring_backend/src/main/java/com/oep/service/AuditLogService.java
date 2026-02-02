package com.oep.service;

import com.oep.entities.AuditAction;
import com.oep.entities.AuditLogs;
import com.oep.entities.ServiceName;
import com.oep.entities.UserRole;

public interface AuditLogService {
    void logAction(ServiceName serviceName, String userEmail, UserRole role, AuditAction action, String details);
    void logSuccess(ServiceName serviceName, String userEmail, UserRole role, AuditAction action, String details);
    void logFailure(ServiceName serviceName, String userEmail, UserRole role, AuditAction action, String details, String errorMessage);
}