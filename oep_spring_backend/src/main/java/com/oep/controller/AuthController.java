package com.oep.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.oep.dtos.*;
import com.oep.security.JwtUtils;
import com.oep.security.UserPrincipal;
import com.oep.service.AuthService;
import com.oep.service.CourseServiceImpl;
import com.oep.service.EmailService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated
public class AuthController {

    private final JwtUtils jwtUtils;
    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    // login
    @PostMapping("/signin")
    @Operation(description = "User Login")
    public ResponseEntity<AuthResp> userSignIn(@RequestBody @Valid LoginDto dto) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtUtils.generateToken(principal);
        Long userId = principal.getUserId();
        String role = principal.getUserRole();
        if (role != null && role.startsWith("ROLE_")) {
            role = role.substring(5).toLowerCase();
        }
        return ResponseEntity.ok(new AuthResp(userId, token, role, "Successfully logged in"));
    }

    // forgot Password
    @PostMapping("/forgot-password")
    @Operation(description = "Send reset password link")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody @Valid ForgotPasswordDto dto) {
        System.out.println("Email: " + dto.getEmail());
        authService.sendResetPasswordLink(dto.getEmail());
        return ResponseEntity.ok(new ApiResponse("success", "Reset link has been sent"));
    }

    // Validate Token
    @GetMapping("/reset-password/validate")
    @Operation(description = "Validate reset password token")
    public ResponseEntity<ApiResponse> validateToken(@RequestParam String token) {
        authService.validateToken(token);
        return ResponseEntity.ok(new ApiResponse("success", "Token is valid"));
    }

    // Reset Password
    @PostMapping("/reset-password")
    @Operation(description = "Reset password using token")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody @Valid ResetPasswordDto dto) {
        authService.resetPassword(dto.getToken(), dto.getNewPassword());
        return ResponseEntity.ok(new ApiResponse("success", "Password reset successfully"));
    }


}
