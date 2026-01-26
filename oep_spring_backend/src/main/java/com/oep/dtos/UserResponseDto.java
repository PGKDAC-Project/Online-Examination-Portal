package com.oep.dtos;

import com.oep.entities.UserRole;
import com.oep.entities.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String name; // maps to userName
    private String email;
    private String role;
    private String status;
    private String userCode;
    private Long batchId;
    private LocalDateTime lastLogin;
}
