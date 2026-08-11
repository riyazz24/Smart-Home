package com.example.smart.home.automation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class GetSecurityCodeByIdResponse {

    private String securityCodeId;

    private String email;

    private String securityCode;

    private LocalDateTime securityCodeExpiresAt;

}