package com.oep.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LoginDto {
	@NotBlank(message = "Email is required!")
	@Email(message = "Invalid Email Format")
	private String email;
	@NotBlank
	@Pattern(regexp="^.{5,20}$",message = "Password must be between 5 and 20 characters")
	private String password;
}