package com.oep.entities;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.AttributeOverrides;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/*log_id INT PRIMARY KEY AUTO_INCREMENT,
service_name VARCHAR(50),
user_email VARCHAR(150),
action VARCHAR(150),
details JSON,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP*/
@Entity
@Table(name = "audit_logs")

@AttributeOverrides({@AttributeOverride(name = "createdOn", column = @Column(name = "created_at")),
		@AttributeOverride(name = "id", column = @Column(name = "log_id"))})
@Getter
@Setter
public class AuditLogs extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "service_name", nullable = false)
    private ServiceName serviceName;

    @Column(name = "user_email", length = 150, nullable = false)
    private String userEmail;
    
    @Column(name = "user_role", length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "action", nullable = false)
    private AuditAction action;
    
    @Column(name = "details", columnDefinition = "json")
    private String details;
}
