package com.oep.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.oep.dtos.AuditLogRequestDto;
import com.oep.entities.AuditAction;
import com.oep.entities.ServiceName;
import com.oep.entities.UserRole;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogServiceImpl implements AuditLogService {
    private final RestTemplate restTemplate;
    
    @Value("${admin.service.url:http://localhost:7097}")
    private String adminServiceUrl;

    @Override
    @Async
    public void logAction(ServiceName serviceName, String userEmail, UserRole role, AuditAction action, String details) {
        try {
            AuditLogRequestDto dto = new AuditLogRequestDto(serviceName, userEmail, role, action, details);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<AuditLogRequestDto> request = new HttpEntity<>(dto, headers);
            
            restTemplate.postForEntity(adminServiceUrl + "/api/audit-logs", request, Void.class);
        } catch (Exception e) {
            log.error("Audit logging failed: {}", e.getMessage(), e);
        }
    }

    @Override
    public void logSuccess(ServiceName serviceName, String userEmail, UserRole role, AuditAction action, String details) {
        logAction(serviceName, userEmail, role, action, details);
    }

    @Override
    public void logFailure(ServiceName serviceName, String userEmail, UserRole role, AuditAction action, String details, String errorMessage) {
        String failureDetails = details + " | Error: " + errorMessage;
        logAction(serviceName, userEmail, role, action, failureDetails);
    }
}