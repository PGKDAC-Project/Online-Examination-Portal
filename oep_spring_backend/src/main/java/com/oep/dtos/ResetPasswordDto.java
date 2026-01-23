package com.oep.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordDto {

    @NotBlank(message = "Token is required")
    private String token;

    @Pattern(
        regexp = "((?=.*\\d)(?=.*[a-z])(?=.*[#@$*]).{5,20})",
        message = "Password must be 5–20 chars, include digit, lowercase and Special character."
    )
    private String newPassword;
}
