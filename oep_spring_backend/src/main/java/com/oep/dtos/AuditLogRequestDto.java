package com.oep.dtos;

import com.oep.entities.AuditAction;
import com.oep.entities.ServiceName;
import com.oep.entities.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogRequestDto {
    private ServiceName serviceName;
    private String userEmail;
    private UserRole role;
    private AuditAction action;
    private String details;
}
