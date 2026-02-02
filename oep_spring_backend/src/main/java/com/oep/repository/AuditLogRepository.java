package com.oep.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.oep.entities.AuditLogs;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLogs, Long> {
    // Additional query methods can be added here if needed
}