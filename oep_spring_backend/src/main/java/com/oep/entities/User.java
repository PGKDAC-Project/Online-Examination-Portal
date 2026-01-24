package com.oep.entities;

import java.time.LocalDateTime;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "users", indexes = {
		@Index(name = "idx_user_email", columnList = "email"),
		@Index(name = "idx_user_role", columnList = "role"),
		@Index(name = "idx_user_batch", columnList = "batch_id")
})
@AttributeOverride(name = "id", column = @Column(name = "userId"))
@Getter
@Setter
@ToString
public class User extends BaseEntity {
	
	@Column(name = "user_name", length = 100, nullable = false)
	private String userName;
	
	@Column(name = "user_code", nullable = false, length = 15)
	private String userCode;
	
	@Column(name = "email", nullable = false, unique = true, length = 150)
	private String email;
	
	@Column(name = "password_hash", nullable = false)
	private String passwordHash;
	
	@Column(name = "phone_number", length = 10, unique = true)
	private String phoneNumber;
	
	@Column(length = 15,nullable = false)
	@Enumerated(EnumType.STRING)
	private UserRole role;
	
	@Column(length = 15, nullable = false)
	@Enumerated(EnumType.STRING)
	private Status status;
	
	@Column(name = "last_login")
	private LocalDateTime lastLogin;
	
	@Column(name = "is_first_login")
	private Boolean isFirstLogin;
	
	@Column(name = "activation_token")
	private String activationToken;
	
	@Column(name = "activation_expiry")
	private LocalDateTime activationExpiry;
	
	@ManyToOne
	@JoinColumn(name = "batch_id")
	private Batch batch;
}
