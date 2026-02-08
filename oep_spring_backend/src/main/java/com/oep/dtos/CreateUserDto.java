package com.oep.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateUserDto {
	@NotBlank(message = "Username cannot be blank.")
	private String name;
	@NotBlank(message = "Email cannot be blank.")
	@Email(message = "Invalid Email format.")
	private String email;
	@NotBlank
	private String role;
	@NotBlank
	private String status;
	private String password; // Optional
	private Long batchId;
}
