package com.oep.service;

import com.oep.dtos.AuthResp;
import com.oep.dtos.LoginDto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public interface AuthService {

	void sendResetPasswordLink(String email);

	void validateToken(String token);

	void resetPassword(String token, String password);

	void updateLastLogin(String email);
}
