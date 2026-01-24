package com.oep.service;

public interface EmailService {
	void sendResetPasswordLink(String to, String token);
}
