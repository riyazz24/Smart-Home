package com.example.smart.home.automation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.jackson.Jacksonized;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Jacksonized
@Builder
public class SecurityCodeModel {

    private String securityCodeId;

    private String email;

    private String securityCode;

    private LocalDateTime securityCodeExpiresAt;

}