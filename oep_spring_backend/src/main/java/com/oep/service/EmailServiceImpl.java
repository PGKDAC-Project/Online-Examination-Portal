package com.oep.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService{
	private final JavaMailSender mailSender;
	
	@Value("${frontend.reset.url}")
	private String resetBaseUrl;
	
	@Override
	public void sendResetPasswordLink(String to, String token) {
		String resetLink = resetBaseUrl+"?token="+token;
		SimpleMailMessage message  = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject("Reset Password");
		message.setText(
				"Click the link below to reset your password:\n\n" 
				+ resetLink 
				+ "\n\nThis link expires in 15 minutes.\n\nIf you did not request this, ignore this email."
				);
		mailSender.send(message);
	}

	
}
