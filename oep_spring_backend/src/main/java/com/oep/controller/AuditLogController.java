package com.oep.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.oep.entities.AuditLogs;
import com.oep.repository.AuditLogRepository;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AuditLogController {
    private final AuditLogRepository auditLogRepository;

    @GetMapping("/audit-logs")
    @Operation(description = "Get all audit logs")
    public List<AuditLogs> getAllLogs() {
        return auditLogRepository.findAll();
    }
}