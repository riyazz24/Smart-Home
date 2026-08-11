package com.example.smart.home.automation.api.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class CreateUserHttpRequest {

    @NotBlank(message = "This field is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "This field is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
            regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
            message = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    private String rawPassword;

    @NotBlank(message = "This field is required")
    private String fullName;

    @NotBlank(message = "This field is required")
    @Pattern(regexp = "^[0-9]{5}\\s[0-9]{5}$", message = "Contact number must be 10 digits")
    private String contactNo;

}