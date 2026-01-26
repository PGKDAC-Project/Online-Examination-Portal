package com.oep.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.oep.custom_exceptions.ResourceNotFoundException;
import com.oep.entities.User;
import com.oep.repository.AuthRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService; // to add when implementing mail sending

    @Override
    public void sendResetPasswordLink(String email) {
        User user = authRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid Email id"));
        System.out.println("User: \n" + user.toString());
        String token = UUID.randomUUID().toString() + UUID.randomUUID().toString();
        user.setActivationToken(token);
        user.setActivationExpiry(LocalDateTime.now().plusMinutes(15));
        authRepository.save(user);

        // TODO: send email
        emailService.sendResetPasswordLink(user.getEmail(), token);
    }

    @Override
    public void validateToken(String token) {
        User user = authRepository.findByActivationToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid token"));
        if (user.getActivationExpiry() == null ||
                user.getActivationExpiry().isBefore(LocalDateTime.now())) {
            throw new ResourceNotFoundException("Token expired");
        }
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        User user = authRepository.findByActivationToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid token"));
        if (user.getActivationExpiry() == null ||
                user.getActivationExpiry().isBefore(LocalDateTime.now())) {
            throw new ResourceNotFoundException("Token expired");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setActivationToken(null);
        user.setActivationExpiry(null);
        authRepository.save(user);
    }
}
