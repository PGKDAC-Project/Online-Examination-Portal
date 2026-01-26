package com.oep.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
	@NotBlank
	@Pattern(regexp = "((?=.*\\d)(?=.*[a-z])(?=.*[#@$*]).{5,20})", message = "Blank or invalid password")
	private String password;
	private Long batchId;
}
