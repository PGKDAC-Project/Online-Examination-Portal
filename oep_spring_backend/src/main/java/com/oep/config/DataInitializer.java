package com.oep.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.oep.entities.Status;
import com.oep.entities.User;
import com.oep.entities.UserRole;
import com.oep.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Initializing test data...");
        
        // Update existing users with properly encoded password
        String encodedPassword = passwordEncoder.encode("admin@123");
        log.info("Generated BCrypt hash for password 'admin@123'");
        
        // Update all existing users
        userRepository.findAll().forEach(user -> {
            user.setPasswordHash(encodedPassword);
            userRepository.save(user);
            log.info("Updated password for user: {}", user.getEmail());
        });
        
        log.info("Data initialization completed!");
    }
}