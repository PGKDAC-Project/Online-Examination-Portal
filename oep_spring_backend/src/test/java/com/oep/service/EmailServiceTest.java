package com.oep.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class EmailServiceTest {

    @Autowired
    private EmailService emailService;

    @Test
    void testSendPasswordResetEmail() {
        String resetToken = "test-token-123";
        
        emailService.sendResetPasswordLink("Arkkseies967@gmail.com", resetToken);
        
        System.out.println("Password reset email sent to Arkkseies967@gmail.com");
        System.out.println("Reset token: " + resetToken);
    }
}
