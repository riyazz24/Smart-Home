package com.example.smart.home.automation.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OtpVerifyHttpRequest {

    @NotBlank(message = "Verification code is required")
    private String securityCode;

}