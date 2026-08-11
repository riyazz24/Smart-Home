package com.example.smart.home.automation.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdateAdminProfileHttpRequest {

    @NotBlank(message = "This field is required")
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "This field is required")
    private String address;

    @NotBlank(message = "This field is required")
    @Pattern(regexp = "^[0-9]{5}\\s[0-9]{5}$", message = "Contact number must be 10 digits")
    private String contactNo;

    @NotBlank(message = "This field is required")
    @Pattern(regexp = "^[0-9]{5}\\s[0-9]{5}$", message = "WhatsApp number must be 10 digits")
    private String whatsappNo;

}